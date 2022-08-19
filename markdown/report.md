
# Primary Voting in Arizona

## Abortion
The sample consists of a survey of <em>n = 900</em> adults. Starting with attitudes on abortion, an important trend emerges: Independents resemble Democrats, more than they resemble Republicans.

First, consider opinions towards *abortion*. One question inquires about when aboortion should be legal, if ever, and the second asks about penalties for abortion providers

<iframe src="https://public.tableau.com/views/lab-primary-01/AbortionAttitudes?:language=en-US&publish=yes&:display_count=n&:origin=viz_share_links?:language=en-US&publish=yes&:display_count=n&:origin=viz_share_link?:language=en-US&:display_count=n&:origin=viz_share_link:showVizHome=no&:embed=true"
 width="90%" height="850"></iframe>

## Party Perceptions

The figure below displays the proportion of Democrats, Independents, and Republicans who view the Republican and Democratic Parties as too liberal, too conservative, or where the party should be.

<iframe src="https://public.tableau.com/views/lab-primary-01/Perceptions?:language=en-US&publish=yes&:display_count=n&:origin=viz_share_links?:language=en-US&publish=yes&:display_count=n&:origin=viz_share_link?:language=en-US&:display_count=n&:origin=viz_share_link:showVizHome=no&:embed=true"
 width="90%" height="850"></iframe>

**Again, independents in the state offer similar opinions. They generally say that Democrats in the state are too conservative, or just right. Among Republicans, the probability is 0.40 that they view the Democratic party as too liberal. Independents (55.6) and Democrats (0.65) view the Republicans as too conservative**

## Trump and the Republican Party

The data make quite clear that Trump played a relatively important role in the state. I looked at this in two ways -- first, simply by looking at how voting is affected by the belief that Trump ought to be the Republican nominee; second, by estimating a statistical model predicting support for the various candidates based on one's tendency to identify as a MAGA voter.


### Some Pie Charts

<iframe src="https://public.tableau.com/views/lab-primary-01/Vote?:language=en-US&publish=yes&:display_count=n&:origin=viz_share_links?:language=en-US&publish=yes&:display_count=n&:origin=viz_share_link?:language=en-US&:display_count=n&:origin=viz_share_link:showVizHome=no&:embed=true"
 width="90%" height="850"></iframe>

**Those whom support Trump are more likely to support Lake and Masters.**

I also estimated a statistical model predicting support for the various candidates based on one's tendency to identify as a MAGA voter. The model specification is a multinomial regression model estimated using non-informative priors in the statistical package, $\texttt{Stan}$ and $\texttt{brms}$.

These are the models.
 ```
 # The Models
rep_vote_senate = brm(senate_rep ~ MAGA,
               family = categorical(link = "logit"),
               data = not_dem, 
               chains = 3, 
               cores = 8, 
               seed = 1234, 
               iter = 5000,
               control = list(adapt_delta = 0.9,
                              max_treedepth = 15))   

rep_vote_governor = brm(governor_rep ~ MAGA,
               family = categorical(link = "logit"),
               data = not_dem, 
               chains = 3, 
               cores = 8, 
               seed = 1234, 
               iter = 5000,
               control = list(adapt_delta = 0.9,
                              max_treedepth = 15))   
 ```

 Below I display the posterior predictive distributions for the Republican vote in the Senate and the Governor.
 
 What is MAGA? It's based on the answers to these three questions:

* To what extent do you think of yourself as being a part of the MAGA movement?

* How well does the term MAGA supporter describe you?

* How important is being a MAGA supporter to you?

These are combined into scale. I then recoded the variable so that MAGA is scored 0 if the respondent scores below the median, 1 = above median. 

 <img src="govenor.png"
     alt="Governor vote"
     style="width : 500px; float: left; margin-right: 10px;" />

 <img src="senate.png"
     alt="Senate vote"
     style="width : 500px; float: left; margin-right: 10px;" />