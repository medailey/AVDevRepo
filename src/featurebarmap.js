var FeatureBarMap = {
    feature_bar_map: function feature_bar_map (id, indx){
    "use strict";
    var map;
    var region = abmviz_utilities.GetURLParameter("region");
    var dataLocation = localStorage.getItem(region);
    var url = dataLocation+ abmviz_utilities.GetURLParameter("scenario");
    var fileName = "FeatureBarMap.csv";
    var chartSelector = "#"+id+"-chart";
    //these will be replaced by default palette/ramp colors
    //slider
    var zoneData;
    var dataItems = [];
    var currentCounty = "";
    var modes;
    var circleMarkers;
    var countiesSet;
    var enabledCounties;
    var circlesLayerGroup;
    var chartData = null;
    //use Map instead of vanilla object because wish to preserve insertion order
    var modeData = new Map([]);
    var quantityColumn;
    var countyColumn;
    var zoneColumn;
    var modeColumn;
    var scenarioPolyFile;
    var scenario = abmviz_utilities.GetURLParameter("scenario");
    var svgChart;
    var extNvd3Chart;
    var minBarWidth = 1;
    var minBarSpacing = 1;
    var marginTop = 0;
    var marginBottom = 50;
    var marginLeft = 110;
    var marginRight = 50;
    var CSS_UPDATE_PAUSE = 150;
    //milliseconds to pause before redrawing map
    var interval;
    var currentCycleModeIndex = 0;
    var cycleGoing = false;
    var breakUp;
    var currentTripModeZone;
    var currentTripModeBubble;
    var bubblesShowing = false;
    var zonesShowing = true;
    var showOutline = false;
    var maxFeature;
    var zoneDataLayer;
    var countyLayer;
    var focusLayer;
    var barsWrap;
    var barsWrapRect;
    var barsWrapRectHeight;
    var barsWrapRectId = id + "-barsWrapRectRSG"
    var barsWrapRectSelector = "#" + barsWrapRectId;

    var zonefilters = {};
    var zonefilterlabel = "";
    var ZONE_FILTER_LOC = "";
    var zoneFilterData;
    var zonefiles;
    var zoneheaders = [];
    var circleStyle = {
        "stroke": false,
        "fillColor": "set by updateBubbles",
        "fillOpacity": 1.0
    };
    //config file options
    var COUNTY_FILE = "";
    var ZONE_FILE_LOC = "";
    var CENTER_LOC = [];
    var SCENARIO_FOCUS = false;
    var ROTATELABEL = 0;
    var BARSPACING = 0.2;
    var showCycleTools = true;
    var highlightLayer;
    var maxLabelLength = 0;
    var buildChart = $('#'+id+'-chart').children().length ==0;

    function getConfigSettings(callback) {
        if(buildChart) {
            $.getJSON(dataLocation + "region.json", function (data) {
                var configName = "Default";
                if (data["scenarios"][scenario].visualizations != undefined) {
                    if (data["scenarios"][scenario].visualizations["FeatureBarMap"][indx].file) {
                        fileName = data["scenarios"][scenario].visualizations["FeatureBarMap"][indx].file;

                    }
                    if (data["scenarios"][scenario].visualizations["FeatureBarMap"][indx].config) {
                        configName = data["scenarios"][scenario].visualizations["FeatureBarMap"][indx].config;
                    }
                }
                //GO THROUGH REGION LEVEL CONFIG SETTINGS
                $.each(data, function (key, val) {
                    if (key == "CenterMap")
                        CENTER_LOC = val;
                });
                var configSettings = data["FeatureBarMap"][configName];
                if(configSettings != undefined){
                    $.each(configSettings, function (opt, value) {

                    });
                }
            }).complete(function (){
                if (url.indexOf(fileName) == -1) {
                    console.log("here");
                    url += "/" + fileName;
                }
                callback();
            });
        }
    } //END getConfigSettings

    function setDataSpecificDOM() {

    }
    function readInData(callback){
         "use strict";
         d3.csv(url, function (error, data) {
             if (error) {
                 $('#' + id + '-div').html("<div class='container'><h3><span class='alert alert-danger'>Error: An error occurred while loading the Barchart and Map data.</span></h3></div>");
                 throw error;
             }
             //HEADERS SHOULD BE ORIGIN, DESTINATION, DATA COLUMN 1 TO DATA COLUMN N...
             var od = {};
             var headers = d3.keys(data[0]);
             var origCol = headers[0];
             var destCol = headers[1];
             var dataCols = headers.slice(2, headers.len);
             data.forEach(function(row){
                 var orig = +row[origCol];
                 var dest = +row[destCol];
                 if(od[orig]== undefined){
                     od[orig] = {};
                 }

                 if(orig !== dest){

                     dataCols.forEach(function (col) {
                        od[orig][dest][col] = row[col];
                     })

                 }
             }); //end data for each
         }); //end d3.csv
    }
  function createMap(callback) {
        if (map != undefined) {
            return;
        }
        map = L.map(id + "-map", {
            minZoom: 7
        }).setView(CENTER_LOC, 9);

        map.on('zoomend', function (type, target) {
            var zoomLevel = map.getZoom();
            var zoomScale = map.getZoomScale();
            console.log('zoomLevel: ', zoomLevel, ' zoomScale: ', zoomScale);
        });
        		//end geoJson of zone layer
    }; //end createMap
     getConfigSettings(function(){
         readInData(function(){
          console.log("wheeeee");
         })
     })
    } //end function feature bar chart map
} //end namespace