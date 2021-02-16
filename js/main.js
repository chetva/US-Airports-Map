
    // 1. Create a map object.
    var mymap = L.map('map', {
      center: [39.50, -98.35],
      zoom: 3.5,
      detectRetina: true // detect whether the sceen is high resolution or not.
    });

    // 2. Add a base map.
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);
    // 3. Add cell towers GeoJSON Data
    // Null variable that will hold cell tower data

    var colors = ['#7a0177', '#c51b8a'];

    // 5. dynamically append style classes to this page. This style classes will be used for colorize the markers.
    for (i = 0; i < 2; i++) {
      $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
    }

    var airports = null;
    // Get GeoJSON and put on it on the map when it loads
    airports = L.geoJson.ajax("assets/airports.geojson", {

      onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.AIRPT_NAME);
        return feature.properties.STATE;
      },
      pointToLayer: function(feature, latlng) {
        var id = 0;
        if (feature.properties.CNTL_TWR == "Y") {
          id = 0;

        } else {
          id = 1;
        }
        return L.marker(latlng, {
          icon: L.divIcon({
            className: 'fa fa-plane marker-color-' + (id + 1).toString(),
          })
        });
      },
      attribution: 'USGS Airports of the US &copy; Data.gov | US States &copy; Mike Bostock D3 | Base Map &copy; CartoDB | Made By Abriana Chet'


    });
    airports.addTo(mymap);
    // assign a function to the onEachFeature parameter of the cellTowers object.
    // Then each (point) feature will bind a popup window.
    // The content of the popup window is the value of `feature.properties.company`

    // 6. Set function for color ramp
    colors = chroma.scale('BuPu').colors(5);

    function setColor(airportCount) {
      var id = 0;
      if (airportCount > 59) {
        id = 4;
      } else if (airportCount > 26 && airportCount <= 59) {
        id = 3;
      } else if (airportCount > 15 && airportCount <= 26) {
        id = 2;
      } else if (airportCount > 8 && airportCount <= 15) {
        id = 1;
      } else {
        id = 0;
      }
      return colors[id];
    }

    // 7. Set style function that sets fill color.md property equal to cell tower density
    function style(feature) {
      return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
      };
    }

    // create the states layer
    var states = L.geoJson.ajax("assets/us-states.geojson", {
      style: style
    }).addTo(mymap);


    // 9. Create Leaflet Control Object for Legend
    var legend = L.control({
      position: 'topright'
     });


    // 10. Function that runs when legend is added to map
    legend.onAdd = function() {

      // Create Div Element and Populate it with HTML
      var div = L.DomUtil.create('div', 'legend');
      div.innerHTML += '<b># Airports in State</b><br />';
      div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p> 60+ </p>';
      div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p> 27-59 </p>';
      div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p> 14-26 </p>';
      div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 9-15 </p>';
      div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 1-8 </p>';
      div.innerHTML += '<hr><b>Air Traffic Control<b><br />';
      div.innerHTML += '<i class="fa fa-plane marker-color-1"></i><p> Control Tower </p>';
      div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p> No Control Tower </p>';

      // Return the Legend div containing the HTML content
      return div;
    };

    // 11. Add a legend to map
    legend.addTo(mymap);

    // 12. Add a scale bar to map
    L.control.scale({
      position: 'bottomleft'
    }).addTo(mymap);
