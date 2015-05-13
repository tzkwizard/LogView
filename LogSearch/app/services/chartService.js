(function () {
    'use strict';
    var serviceId = 'chartservice';


    angular.module('app')
        .factory(serviceId, function () {
            var vm = this;

            //#region service
            var service = {
                drawCityMap: drawCityMap,
                drawTimeLine: drawTimeLine,
                drawHist: drawHist,
                drawWorldMap: drawWorldMap,
                drawUSmap: drawUSmap,
                drawoUSCitymap: drawoUSCitymap,
                drawDashPie: drawDashPie,
                drawaggDashboard1: drawaggDashboard1,
                drawaggDashboard2:drawaggDashboard2
            }
            return service;


            function drawCityMap(r, tabletag, maptag) {
                google.setOnLoadCallback(drawCityMap);
                var geoData = new google.visualization.DataTable();
                geoData.addColumn('string', 'Name');
                // geoData.addColumn('number', 'Lat');
                //  geoData.addColumn('number', 'Lon');           
                geoData.addColumn('string', 'Number');
                //geoData.addRow([n._source.geoip.city_name, 1, n._source.geoip.latitude, n._source.geoip.longitude]);
                angular.forEach(r, function (n) {
                    if (n.DocCount > 10) {
                        geoData.addRow([n.Key, n.Key + " : " + n.DocCount]);
                    }
                });

                var geoView = new google.visualization.DataView(geoData);
                geoView.setColumns([0, 1]);


                var table =
                    new google.visualization.Table(document.getElementById(tabletag));


                // google.visualization.data.group(table, keys, columns)
                table.draw(geoData, { showRowNumber: true });

                var map =
                    new google.visualization.Map(document.getElementById(maptag));
                map.draw(geoView, {
                    showTip: true,
                    //enableScrollWheel: true,
                    useMapTypeControl: true,
                    zoomLevel: 3
                });

                // When the table is selected, we set the selection on the map.
                google.visualization.events.addListener(table, 'select',
                    function () {
                        map.setSelection(table.getSelection());
                    });

                // When the map is selected, we set the selection on the table.
                google.visualization.events.addListener(map, 'select',
                    function () {
                        /*var row = map.getSelection()[0].row;
                        var x = geoData.getValue(row,0);*/
                        table.setSelection(map.getSelection());
                    });

            }

            function drawTimeLine(agg, timelinetag) {
                google.setOnLoadCallback(drawTimeLine);
                var data = new google.visualization.DataTable();
                data.addColumn('date', 'Date');
                data.addColumn('number', 'Count');

                angular.forEach(agg, function (n) {
                    //data.addRow([new Date(n.key), n.doc_count]);
                    data.addRow([new Date(n.Key), n.DocCount]);

                });
                var chart = new google.visualization.AnnotatedTimeLine(document.getElementById(timelinetag));
                chart.draw(data, {
                    displayAnnotations: true, dateFormat: 'MM-dd-yyyy', displayAnnotationsFilter: true,
                    thickness: 3, wmode: 'transparent'
                });

            }

            function drawHist(agg, datahistag) {

                google.setOnLoadCallback(drawHist);
                /*  var Data = new google.visualization.DataTable();
                 Data.addColumn('date', 'Date');
                  Data.addColumn('number', 'Number');
                 // Data.addColumn('date', 'Date');
      
      
                  angular.forEach(agg, function (n) {
                      Data.addRow([new Date(n.key_as_string.substring(0,4), n.key_as_string.substring(5,7), n.key_as_string.substring(8,10)), n.doc_count]);
                     // Data.addRow([n.doc_count, new Date(n.key_as_string.substring(0,4), n.key_as_string.substring(5,7), n.key_as_string.substring(8,10))]);
                  });
      
      
                  var options = {
                //      title: 'Lengths of dinosaurs, in meters',
                //      legend: { position: 'none' },
                      //histogram: { bucketSize: 100 }
                  };
      
                  var chart = new google.visualization.Histogram(document.getElementById('DateHist_div'));
                  chart.draw(Data, options);
      */
                var data = new google.visualization.DataTable();
                data.addColumn('date', 'Date');
                data.addColumn('number', 'Request');

                /*  data.addRows([
              [new Date(2008, 1 ,1),0.7],
             [new Date(2008, 1 ,2),0.5],
                  ]);*/
                angular.forEach(agg, function (n) {
                    //data.addRow([new Date(n.key), n.doc_count]);
                    data.addRow([new Date(n.Key), n.DocCount]);
                    // Data.addRow([n.doc_count, new Date(n.key_as_string.substring(0,4), n.key_as_string.substring(5,7), n.key_as_string.substring(8,10))]);
                });


                var options = google.charts.Bar.convertOptions({
                    title: 'Total Request Received Throughout the Day',
                    hAxis: {
                        format: 'MM/dd/yyyy',
                    },
                });


                var chart = new google.charts.Bar(document.getElementById(datahistag));
                chart.draw(data, options);

                /*      var chart = new google.visualization.LineChart(document.getElementById('DateHist_div'));
                         chart.draw(data, options);*/

            }

            function drawWorldMap(r, maptag) {

                google.setOnLoadCallback(drawWorldMap);

                var geoData2 = new google.visualization.DataTable();
                geoData2.addColumn('string', 'Country');
                geoData2.addColumn('number', 'Count');

                angular.forEach(r, function (n) {
                    //geoData2.addRow([n.key.toString(), n.doc_count]);
                    geoData2.addRow([n.Key, n.DocCount]);
                });
                var options = {
                    colorAxis: { colors: ['#B2B2FF', '#0000FF', '#00004C'] },
                    backgroundColor: '#FFF0F5'

                };

                var chart = new google.visualization.GeoChart(document.getElementById(maptag));

                chart.draw(geoData2, options);

                google.visualization.events.addListener(chart, 'select', function () {
                    var row = chart.getSelection()[0].row;
                    var x = geoData2.getValue(row, 0);
                    log(x);
                });
                vm.isBusy = false;
            }

            function drawUSmap(r, maptag) {
                google.setOnLoadCallback(drawUSmap);

                var geoDataus = new google.visualization.DataTable();
                geoDataus.addColumn('string', 'City');
                geoDataus.addColumn('number', 'Count');

                angular.forEach(r, function (n) {
                    //geoDataus.addRow([n.key.toString(), n.doc_count]);
                    geoDataus.addRow([n.Key, n.DocCount]);
                });
                var options = {
                    colorAxis: { colors: ['#B2B2FF', '#0000FF', '#00004C'] },
                    backgroundColor: '#FFF0F5',
                    region: 'US',
                    resolution: 'provinces'
                };

                var chart = new google.visualization.GeoChart(document.getElementById(maptag));

                chart.draw(geoDataus, options);

                google.visualization.events.addListener(chart, 'select', function () {
                    var row = chart.getSelection()[0].row;
                    var x = geoDataus.getValue(row, 0);
                    log(x);
                });
                vm.isBusy = false;
            }

            function drawoUSCitymap(r, maptag) {
                google.setOnLoadCallback(drawoUSCitymap);

                var geoDataus = new google.visualization.DataTable();
                geoDataus.addColumn('string', 'State');
                geoDataus.addColumn('number', 'Count');

                angular.forEach(r, function (n) {
                    //geoDataus.addRow([n.key.toString(), n.doc_count]);
                    geoDataus.addRow([n.Key, n.DocCount]);
                });
                var options = {
                    colorAxis: { colors: ['#B2B2FF', '#0000FF', '#00004C'] },
                    backgroundColor: '#FFF0F5',
                    region: 'US',
                    resolution: 'provinces',
                    displayMode: 'markers'
                };

                var chart = new google.visualization.GeoChart(document.getElementById(maptag));

                chart.draw(geoDataus, options);

                google.visualization.events.addListener(chart, 'select', function () {
                    var row = chart.getSelection()[0].row;
                    var x = geoDataus.getValue(row, 0);
                    log(x);
                });
                vm.isBusy = false;
            }

            function drawDashPie(agg, tag1, tag2, tag3) {
                google.setOnLoadCallback(drawDashPie);

                var options = {
                    is3D: true,
                    backgroundColor: '#00FFFF',
                    //legend: 'none',
                    //'width': 440,
                    'height': 300,
                    forceIFrame: true,
                    tooltip:
                    {
                        isHtml: true
                    }
                    // pieSliceText: 'label','value',
                    // 'title': "verb"
                };


                var pdata1 = new google.visualization.DataTable();
                pdata1.addColumn('string', 'key');
                pdata1.addColumn('number', 'Number');
                angular.forEach(agg[1], function (n) {
                    pdata1.addRow([n.Key.toString(), n.DocCount]);

                });
                var piechart1 = new google.visualization.PieChart(document.getElementById(tag1));
                piechart1.draw(pdata1, options);


                var pdata2 = new google.visualization.DataTable();
                pdata2.addColumn('string', 'key');
                pdata2.addColumn('number', 'Number');
                angular.forEach(agg[2], function (n) {
                    pdata2.addRow([n.Key.toString(), n.DocCount]);

                });
                var piechart2 = new google.visualization.PieChart(document.getElementById(tag2));
                piechart2.draw(pdata2, options);

                var pdata3 = new google.visualization.DataTable();
                pdata3.addColumn('string', 'key');
                pdata3.addColumn('number', 'Number');
                angular.forEach(agg[3], function (n) {
                    pdata3.addRow([n.Key.toString(), n.DocCount]);

                });
                var piechart3 = new google.visualization.PieChart(document.getElementById(tag3));
                piechart3.draw(pdata3, options);


            }


            function drawaggDashboard1(agg, aggName, dashboardTag, sliderTag, pieTag) {
                google.setOnLoadCallback(drawaggDashboard1);
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'key');
                data.addColumn('number', 'Number');

                angular.forEach(agg, function (ag) {
                    data.addRow([ag.Key.toString(), ag.DocCount]);
                });

                // Create a dashboard.
                var dashboard = new google.visualization.Dashboard(
                    document.getElementById(dashboardTag));

                // Create a range slider, passing some options
                var donutRangeSlider = new google.visualization.ControlWrapper({
                    'controlType': 'NumberRangeFilter',
                    'containerId': sliderTag,
                    'options': {
                        'filterColumnLabel': 'Number'
                    }
                });

                // Create a pie chart, passing some options
                var pieChart = new google.visualization.ChartWrapper({
                    'chartType': 'PieChart',
                    'containerId': pieTag,
                    'options': {
                        'width': 800,
                        'height': 800,
                        'pieSliceText': 'value',
                        'legend': 'right',
                        'title': aggName,
                        is3D: true
                    }
                });


                //drawTable(data, tableTag, aggName);

                // Establish dependencies
                dashboard.bind(donutRangeSlider, [pieChart]);

                // Draw the dashboard.
                dashboard.draw(data);

                google.visualization.events.addListener(pieChart, 'select', function () {
                    var row = pieChart.getSelection()[0].row;
                    var x = data.getValue(row, 0);
                    log(x);
                });

                return data;
            }


            function drawaggDashboard2(agg, y) {
                google.setOnLoadCallback(drawaggDashboard2);
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'key');
                data.addColumn('number', 'Count Range');

                angular.forEach(agg, function (ag) {
                    // data.addRow([agg.key.toString(), agg.doc_count]);
                    data.addRow([ag.Key.toString(), ag.DocCount]);
                });

                // Create a dashboard.
                var dashboard = new google.visualization.Dashboard(
                    document.getElementById("dash" + y));

                // Create a range slider, passing some options
                var donutRangeSlider = new google.visualization.ControlWrapper({
                    'controlType': 'NumberRangeFilter',
                    'containerId': "range" + y,
                    'options': {
                        'filterColumnLabel': 'Count Range'
                    }
                });

                // Create a pie chart, passing some options
                var pieChart = new google.visualization.ChartWrapper({
                    'chartType': 'PieChart',
                    'containerId': "bar" + y,
                    'options': {
                        'width': 800,
                        'height': 800,
                        'pieSliceText': 'value',
                        'legend': 'right',
                        'title': y
                    }
                });

                //table
                /*var table = new google.visualization.ChartWrapper({
                    'chartType': 'Table',
                    'containerId': "table"+y,
                    'options': {
                        'width': '300px'
                    }
                });
*/

                // var name = "table" + y;
                //drawTable(data, name, y);

                // Establish dependencies
                dashboard.bind(donutRangeSlider, [pieChart]);

                // Draw the dashboard.
                dashboard.draw(data);
                return data;
            }

        });
})();