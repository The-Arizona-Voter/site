# Fall 2022 Data Pipeline Documentation

After Rongbo cleaned up the data, here is what I did to construct the datasets. First, let's just create a file that we'll use for machine learning purposes.

I will save this table as **registration.clean_data_machine_learning** 

There's a lot going on here. I start by pulling in the updated geocode data that David sent. I then geocode voters in legislative and congressional district. 

```
-- Grab David's updated geocodes
with geo_updates as (
  SELECT 
lat as latitude_22,
long as longitude_22,
ST_GEOGPOINT(long, lat ) AS location_22,
Score,
cast(USER_registrant_id as string) as USERregistrant_id
  FROM `az-voter-file.registration.geocode_0924`),
lds as (
SELECT
updates.USERregistrant_id,
updates.latitude_22,
updates.longitude_22,
updates.location_22,
geo.cd as legislative_district_22,
updates.Score as match_score
from geo_updates as updates cross join `az-voter-file.public_data.geo_legislative_districts`  as geo
  WHERE ST_CONTAINS(st_geogfromgeojson(geo.geo),updates.location_22) ),
updated_voter as (
  SELECT
lds.*,
geo.cd as congressional_district_22,
from lds cross join `az-voter-file.public_data.geo_cd`  as geo
  WHERE ST_CONTAINS(st_geogfromgeojson(geo.geo),lds.location_22) ),
--The above block codes David's data into the CD/LD configuration
registration_voters AS(
  SELECT
    gd.*,
    registrant_id,
    status,
    CAST(year_of_birth AS int) AS birth_year,
    PARSE_DATE("%m/%d/%Y", LEFT(effective_date_of_change, 10)) AS registration_change,
    county,
    party,
    occupation,
    CAST(REGEXP_EXTRACT(congressional, r"([0-9]+)") AS string) AS OLD_CONG_DIST,
    CAST(REGEXP_EXTRACT(legislative, r"([0-9]+)") AS string)  AS OLD_LEG_DIST,
    zipcode,
    CAST(registrant_id AS string) AS ident,
    CASE
      WHEN party = "REP" THEN "Republican (REP)"
      WHEN party = "DEM" THEN "Democrat (DEM)"
      WHEN party = "LBT" THEN "Libertarian (LIB)"
      WHEN party = "GRN" THEN "Green (GREEN)"
    ELSE
    "Independent"
  END
    AS party_identification,
    CASE
      WHEN status LIKE "inactive" THEN 0
    ELSE
    1
  END
    AS voter_status,
  FROM
    `az-voter-file.registration.full_registration_voter_May2022`as c join lds as gd ON
      gd.USERregistrant_id = c.registrant_id
      WHERE
  status = "Active"),
  --- Pull in the voting data.
  registration_votes AS(
  SELECT
    election,
    CASE
      WHEN election = "GENERAL 2020" THEN 1
    ELSE
    0
  END
    AS gen_2020,
    CASE
      WHEN election = "PRIMARY 2020" THEN 1
    ELSE
    0
  END
    AS primary_2020,
    CASE
      WHEN election = "2018 PRIMARY ELECTION" THEN 1
    ELSE
    0
  END
    AS primary_2018,
    CASE
      WHEN election = "2016 PRIMARY ELECTION" THEN 1
    ELSE
    0
  END
    AS primary_2016,
    CASE
      WHEN election = "2014 GENERAL ELECTION" THEN 1
    ELSE
    0
  END
    AS gen_2014,
    CASE
      WHEN election = "2018 GENERAL ELECTION" THEN 1
    ELSE
    0
  END
    AS gen_2018,
    CASE
      WHEN election = "2016 GENERAL ELECTION" THEN 1
    ELSE
    0
  END
    AS gen_2016,
    CAST(is_general AS int64) AS general_participation,
    CAST(is_primary AS int64) AS primary_participation,
    CAST(registrant_id AS string) AS ident,
    CAST(REGEXP_CONTAINS(UPPER(election), "GENERAL 2020") AS int64) AS vote2020
  FROM
    `az-voter-file.registration.full_registration_votes_2022`),
  registration_count AS(
  SELECT
    ident,
    SUM(gen_2020) AS general_2020,
    SUM(primary_2020) AS primary_2020,
    SUM(gen_2018) AS general_2018,
    SUM(primary_2018) AS primary_2018,
    SUM(gen_2016) AS general_2016,
    SUM(primary_2016) AS primary_2016,
    SUM(gen_2014) AS general_2014,
    SUM(general_participation) AS general_participation,
    SUM(primary_participation) AS primary_participation,
    SUM(vote2020) AS vote2020
  FROM
    registration_votes
  GROUP BY
    ident ),
  registration_merged AS (
  SELECT
    *,
  FROM
    registration_count
  RIGHT JOIN
    registration_voters
  ON
    registration_count.ident = registration_voters.registrant_id ),
  blocks AS(
  SELECT
    registration_merged.*,
    bg.geo_ID,
    bg.internal_point_lat as block_latitude,
    bg.internal_point_lon as block_longitude
  FROM
    registration_merged
  CROSS JOIN
    `bigquery-public-data.geo_census_blockgroups.blockgroups_04` AS bg
  WHERE
    ST_CONTAINS(bg.blockgroup_geom, location_22))
SELECT
  *,
FROM
  `bigquery-public-data.census_bureau_acs.blockgroup_2018_5yr` AS a
LEFT JOIN
  blocks
ON
  blocks.geo_ID = a.geo_id
```
The final few tables geocode voters into census blocks, create summary counts, and append the data with block group information. 

What comes next is outside of big query -- though it need not be (*this is a project -- how to automate this better*).

I use python/tensorflow, to run a machine learning model. Honestly, this could be improved. The accuracy isn't great (0.85), but also, there's just not a lot of individual data to then accurately predict things. It works, however, and it's generally correlated with other participation measures.

Here is the jupyter notebook for that:

https://github.com/The-Arizona-Voter/site/blob/main/tensorflow/nn.ipynb

I do want to note that this is overkill. There's almost no reason to apply machine learning in this case, as far as I can tell. First, we have all the data. Second, we don't have a whole lot of x-variables. Nonetheless, it's a useful exercise. **Future projects will use these scores to predict not-yet-occurred* outcomes, or those things that haven't been incorporated into this build of the file**

Now there should be a table in big query entitled **nn05**. We'll need to incorporate that into the tables in BQ and then create summary measures.

Let's start with summaries for block groups. 

```
-- This query uses census data and voter data to create a summary file at the level of census tract. 
-- One should save this file under public data as "tracts_actionable
with m1 as (SELECT 
    cast(geo_id as string) as census_block,
    cast(CD as int64) as CD,
    cast(LD as int64) as LD,
    party_identification,
    general_2020,
    primary_2020,
    general_2018,
    primary_2018,
    general_2016,
    primary_2016,
    general_2014,
    bachelors_degree, 
    total_pop as tn, 
    median_age, 
    median_income,
    white_pop,
    hispanic_pop,
    housing_units,
    armed_forces,
    employed_pop,
    pop_in_labor_force,
    registrant_id as registrant_id
 FROM `az-voter-file.registration.clean_data_machine_learning_blocks`),
--- Select out and construct percentages and meaningful measures.
m2 as (SELECT
    census_block,
  SUM(CASE
    WHEN party_identification = "Republican (REP)" THEN 1
        ELSE 0 END) as Republicans,
    SUM(CASE
    WHEN party_identification = "Democrat (DEM)" THEN 1
        ELSE 0 END) as Democrats,
    SUM(CASE
    WHEN party_identification = "Libertarian (LIB)" THEN 1
        ELSE 0 END) as Libertarian,
    SUM(CASE
    WHEN party_identification <> "Republican (REP)"  AND  party_identification <> "Republican (REP)"  AND
         party_identification <> "Libertarian (LIB)"  
    THEN 1
        ELSE 0 END) as Independents,
    avg(safe_divide(point, tn))        as  engaged_count_pr,
    avg(safe_divide(white_pop, tn))    as  white_block,
    avg(safe_divide(hispanic_pop, tn)) as hispanic_block,
    avg(safe_divide(bachelors_degree, tn)) as college_block,
    avg(safe_divide(employed_pop, tn)) as employed_block,
    avg(engaged_pr)*100 as engagement_score,
    sum(CASE 
        WHEN general_2020 = 1
        AND general_2018 = 1
        AND general_2016 = 1
        AND primary_2016 = 1
        AND primary_2018 = 1
        AND primary_2020 = 1 THEN 1
        ELSE 0 END)  as threeXthree,
    sum(CASE 
        WHEN general_2020 = 1
        AND  general_2016 = 1
        AND  primary_2016 = 1
        AND  primary_2020 = 1 THEN 1
        ELSE 0 END)  as twoXtwo,
        from m1 LEFT JOIN 
        `az-voter-file.registration.nn04` as m2 ON
                m1.registrant_id = m2.registrant_id
        WHERE CD IS NOT NULL
        GROUP BY census_block
)
select
      m2.*,
      centroids.geo_id,
      centroids.internal_point_lat as latitude,
      centroids.internal_point_lon as longitude,
from `bigquery-public-data.geo_census_blockgroups.blockgroups_04` as centroids
      join  m2 on  centroids.geo_id = m2.census_block
      
```

This file produces a 4000 or so row dataset - 4088, I think...the number of census block groups in AZ.

Now what we can do is just go ahead and create summary counts for LDs and CDs, according to the 2020 Census. Just change the unit from legislative to congressional districts.

```
-- One should save this file under public data as "legislative_districts_actionable"
with m1 as (SELECT 
    geo_id as census_tract,
    cast(CONG_DIST as int64) as congressional_district,
    cast(LEG_DIST as int64) as legislative_district,
    party_identification,
    general_2020,
    primary_2020,
    general_2018,
    primary_2018,
    general_2016,
    primary_2016,
    general_2014,
    registrant_id as registrant_id,
FROM `az-voter-file.registration.clean_data_machine_learning_blocks`)
--- Select out and construct percentages and meaningful measures.
SELECT
    m1.congressional_district,
  SUM(CASE
    WHEN party_identification = "Republican (REP)" THEN 1
        ELSE 0 END) as Republicans_cd,
    SUM(CASE
    WHEN party_identification = "Democrat (DEM)" THEN 1
        ELSE 0 END) as Democrats_cd,
    SUM(CASE
    WHEN party_identification = "Libertarian (LIB)" THEN 1
        ELSE 0 END) as Libertarian_cd,
    SUM(CASE
    WHEN party_identification = "Green (GREEN)" THEN 1
        ELSE 0 END) as Greens_cd,
    SUM(CASE
    WHEN party_identification <> "Republican (REP)"  AND  party_identification <> "Republican (REP)"  AND
         party_identification <> "Libertarian (LIB)"  AND  party_identification <> "Green (GREEN)" 
    THEN 1
        ELSE 0 END) as Independents_cd,
    avg(engaged_pr)*100 as engagement_score_cd,
    sum(CASE 
        WHEN general_2020 = 1
        AND general_2018 = 1
        AND general_2016 = 1
        AND primary_2016 = 1
        AND primary_2018 = 1
        AND primary_2020 = 1 THEN 1
        ELSE 0 END)  as threeXthree,
    sum(CASE 
        WHEN general_2020 = 1
        AND  general_2016 = 1
        AND  primary_2016 = 1
        AND  primary_2020 = 1 THEN 1
        ELSE 0 END)  as twoXtwo,
        from m1 LEFT JOIN 
        `az-voter-file.registration.nn05` as m2 ON
                m1.registrant_id = m2.registrant_id
        WHERE congressional_district IS NOT NULL
        GROUP BY congressional_district

```

To recap, I now have several useful tables. 1) A table of block characteristics, called **blocks_actionable** 2) a table of LD, and a table of 3) CD characteristics. The  data also includes the block centroid latitude and longitude for mapping. Now the idea is to use the raw, 
"clean_machine_learning" data, aggregated to 
    
    * tract
    * LD
    * CD
    * Party Identification

These form the measures. Create this table, then join in the "actionable" files.

```
-- Star Table, with allowable cd ld comparisons
with raw_1 as (SELECT 
    geo_id as census_tract,
    CONG_DIST,
    LEG_DIST,
    party_identification,
    registrant_id as registrant_id,
    total_pop as t
FROM `az-voter-file.registration.clean_data_machine_learning_blocks`
WHERE CONG_DIST IS NOT NULL OR LEG_DIST IS NOT NULL),
 tmp_dat as (SELECT
    nn.engaged_pr as engaged_pr_unit,
    nn.point      as engaged_point_unit,  
    raw_1.*,
    FROM `az-voter-file.registration.nn05` as nn 
      JOIN raw_1 ON nn.registrant_id = raw_1.registrant_id),
star_voter as( 
  SELECT
  count(distinct registrant_id) as voters,
  census_tract as geoid,
  cast(CONG_DIST as int64) as cd,
  cast(LEG_DIST as int64) as ld,
  party_identification as pid,
  avg(engaged_pr_unit)*100    as engagement_unit,
  avg(engaged_point_unit)*100 as engagement_point_unit,
FROM tmp_dat
WHERE party_identification is not null
group by 2, 3, 4, 5),
star_p2 as (
SELECT
  *,  
  FROM `az-voter-file.public_data.congressional_districts_actionable` as cd LEFT JOIN
    star_voter on star_voter.cd = cd.congressional_district),
star_p3 as (
SELECT
  *,  
  FROM `az-voter-file.public_data.legislative_districts_actionable` as ld LEFT JOIN
    star_p2 on star_p2.ld = ld.legislative_district),
-- Need to now verify geocode. 1) Select everything, create 
star_p4 as (
  SELECT
  *,
  cast(CD as int64) as cd_int,
  cast(LD as int64) as ld_int,
  ST_GEOGPOINT(longitude, latitude) AS location
  FROM `az-voter-file.public_data.blocks_actionable` as tracts left JOIN
    star_p3 on star_p3.geoid = tracts.census_block
)
SELECT
*,
from star_p4


```

This is the main file I then use in Tableau.

## Uploading Outside Geojsons to BQ

Big Query has great geocoding tools. You can easily(?) upload a geojoson and geocode respondents. Here's how this is done.

1) Download the shape files, or whatever. 
2) Convert in mapshaper. Download a json. 
3) Clean the json by removing non geometry attributes.

For CDs,

```
import pandas as pd
from pandas_geojson import read_geojson
geo_json = read_geojson("/Users/Chris/desktop/cds.json")
dat = pd.DataFrame(geo_json)
#dat = dat["features"].to_string
dat.head()
geometry = []
congressional_district = []
for x in range(9):
    geometry.append(dat["features"][x]["geometry"])
    congressional_district.append(dat["features"][x]["properties"]["DISTRICT"])
dat = pd.DataFrame({"cd": congressional_district, "geo" : geometry})
dat.to_csv("geo_cd.csv")
```

Then for LDs.
```
import pandas as pd
from pandas_geojson import read_geojson
geo_json = read_geojson("/Users/Chris/website_fall22/site/report/LD3.json")
dat = pd.DataFrame(geo_json)
#dat = dat["features"].to_string
dat.head()
geometry = []
legislative_district = []
for x in range(30):
    geometry.append(dat["features"][x]["geometry"])
    legislative_district.append(dat["features"][x]["properties"]["DISTRICT"])
dat = pd.DataFrame({"cd": legislative_district, "geo" : geometry})
dat.to_csv("geo_ld.csv")

```

From here, move to a google cloud storage bucket. I uploaded these myself, but that's unnecessary. Then run this to create to files, ld-shape and cd-shape

```
-- SELECT 
--   cd as legislative_district, 
--   st_geogfromgeojson(geo) as geometry,
-- FROM `az-voter-file.public_data.ld_geo` 


SELECT 
  cd as legislative_district, 
  st_geogfromgeojson(geo) as geometry,
FROM `az-voter-file.public_data.geo_legislative_districts` 
```
