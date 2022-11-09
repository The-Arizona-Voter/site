var map = L.map('map', {
    center: [34.5, -112.074036], // EDIT latitude, longitude to re-center map
    zoom: 6,  // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
    scrollWheelZoom: false,
    tap: false,
    minZoom: 0,
    maxZoom: 8

});

/* Control panel to display map layers */
var controlLayers = L.control.layers(null, null, {
    position: "bottomright",
    collapsed: false
}).addTo(map);


var Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    ext: 'png'
}).addTo(map)


$.get('data_updated_fall22.csv', function (csvString) {

    // Use PapaParse to convert string to array of objects
    var data = Papa.parse(csvString, { header: true, dynamicTyping: true }).data;

    // For each row in data, create a marker and add it to the map
    // For each row, columns `Latitude`, `Longitude`, and `Title` are required
    for (var i in data) {
        var row = data[i];
        if (row.pid == "Republican (REP)") {
            var circle = L.circleMarker([row.latitude, row.longitude], {
                radius: row.voters/200,
                fillOpacity: 0.40,
                opacity: 0.30,
                fillColor: row.color
            })
            circle.addTo(map);
        }
    }
    for (var i in data) {
        var row = data[i];
        if (row.pid == "Democrat (DEM)") {
            var circle = L.circleMarker([row.latitude, row.longitude], {
                className: 'pulse',
                radius: row.voters/200,
                fillOpacity: 0.40,
                opacity: 0.30,
                fillColor: row.color
            })
            circle.addTo(map);
        }
    }


});


$.getJSON("CD_S.json", function (data) {
    L.geoJson(data, {
        style: function (feature) {
            return {
                color: "darkgreen",
                weight: 2,
                fillColor: "white"
            }
        },
        onEachFeature: function (feature, layer) {
            var out = layer.feature.properties.DIST_INT;
            layer.bindTooltip("CD: " + out,
                {
                    direction: 'left',
                    permanent: false,
                    sticky: true,
                    font: '500px',
                    offset: [10, 0],
                    opacity: 0.8,
                    className: 'leaflet-tooltip-own'
                });
        }
    }).addTo(map);
    ;
})

