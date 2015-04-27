(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['$interval', '$scope', '$q', '$timeout', '$cookieStore', '$rootScope', 'common', 'dataconfig', 'datasearch', 'client', dashboard]);

    function dashboard($interval, $scope, $q, $timeout, $cookieStore, $rootScope, common, dataconfig, datasearch, client) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var vm = this;


        //#region variable
        vm.size = 15;
        vm.isBusy = true;
        vm.busyMessage = "wait";
        vm.spinnerOptions = {
            radius: 120,
            lines: 24,
            length: 0,
            width: 30,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: 'Blue'
        };
        vm.title = 'Dashboard';
        vm.indicesName = [];
        vm.type = "";
        //#endregion

        //#region function
        //  vm.getFieldName = getFieldName;
        vm.getIndexName = getIndexName;
        vm.geoMap = geoMap;
        vm.histGram = histGram;
        vm.init = init;
        vm.timeLineGram = timeLineGram;
        vm.geoMap2 = geoMap2;
        //#endregion


        //#region test
        vm.test = test;
        function test() {

        }
        //#endregion


        //#region View Load
        vm.st = "";
        vm.ft = "";

        activate();
        function activate() {
            common.activateController([], controllerId)
                .then(function () {
                    if ($rootScope.reload) {
                        $timeout(init, 1000);
                        $rootScope.reload = false;
                    } else {
                        init();
                    }
                    log('Activated Dashboard View');
                   
                });
        }

        function init() {
            getIndexName();
            vm.type = $rootScope.logtype;
            if ($rootScope.ft !== undefined && $rootScope.st !== undefined) {
                vm.ft = $rootScope.ft;
                vm.st = $rootScope.st;
            } else {
                vm.st = moment(new Date()).subtract(2, 'month');
                vm.ft = new Date();
            }

            if (typeof pp === 'Promise') {
                pp.then(function (data) {
                    vm.indicesName = data
                    timeLineGram();
                    pieChart();
                    geoMap();
                    histGram();
                    geoMap2();
                });
            } else {
                timeLineGram();
                pieChart();
                geoMap();
                histGram();
                geoMap2();
            }

           /* vm.indicesName = $cookieStore.get('index');
             $timeout(timeLineGram, 200);
             $timeout(pieChart, 200);
             $timeout(geoMap, 200);
             $timeout(histGram, 200);
             $timeout(geoMap2, 200);*/

        }

        var pp;

        function getIndexName() {

            if ($cookieStore.get('index') !== undefined && $rootScope.index !== undefined) {
                if ($rootScope.index.length !== $cookieStore.get('index').length) {
                    log("Index Changed");
                    $cookieStore.remove('index');
                }
            }
            vm.indicesName = $cookieStore.get('index');

            if ($cookieStore.get('index') === undefined) {
                if ($rootScope.index !== undefined) {
                    $cookieStore.put('index', $rootScope.index);
                    vm.indicesName = $cookieStore.get('index');
                } else {

                    pp = dataconfig.initIndex();
                }
            }


        }
        //#endregion


        //#region Draw Map
        vm.location = [];
        function geoMap() {
            datasearch.termAggragation(vm.indicesName, vm.type, "geoip.city_name.raw", vm.size, vm.st, vm.ft).
                then(function (resp) {
                    vm.tt = resp.hits.total;
                    drawMap(resp.aggregations.ag.agg.buckets, vm.tt);
                }, function (err) {
                    //log("geoMap data error " + err.message);
                    vm.indicesName = $rootScope.index;
                    $timeout(geoMap, 1000);
                });

        }
        function drawMap(r, tt) {

            google.setOnLoadCallback(drawMap);
            var geoData = new google.visualization.DataTable();
            geoData.addColumn('string', 'Name');
            // geoData.addColumn('string', 'ip');
            // geoData.addColumn('number', 'Lat');
            //  geoData.addColumn('number', 'Lon');           
            geoData.addColumn('number', 'Number');
            //geoData.addRow([n._source.geoip.city_name, 1, n._source.geoip.latitude, n._source.geoip.longitude]);
            vm.j = -1;
            angular.forEach(r, function (n) {

                if (n.doc_count > 10) {
                    geoData.addRow([n.key.toString(), n.doc_count]);
                }
            });

            var geoView = new google.visualization.DataView(geoData);
            geoView.setColumns([0, 1]);


            var table =
                new google.visualization.Table(document.getElementById('dtable_div'));


            // google.visualization.data.group(table, keys, columns)
            table.draw(geoData, { showRowNumber: true });

            var map =
                new google.visualization.Map(document.getElementById('dmap_div'));
            map.draw(geoView, { showTip: true, enableScrollWheel: true, useMapTypeControl: true, zoomLevel: 3 });
            // map.setSelection({ row: null, column: 1 });
            // Set a 'select' event listener for the table.
            // When the table is selected, we set the selection on the map.
            google.visualization.events.addListener(table, 'select',
                function () {
                    map.setSelection(table.getSelection());
                });

            // Set a 'select' event listener for the map.
            // When the map is selected, we set the selection on the table.
            google.visualization.events.addListener(map, 'select',
                function () {
                    table.setSelection(map.getSelection());
                });

        }
        //#endregion


        //#region Draw Pie 
        function pieChart() {
            client.search({
                index: vm.indicesName,
                type: vm.type,
                body: ejs.Request()
                     .aggregation(ejs.FilterAggregation("ag1").filter(ejs.RangeFilter("@timestamp").lte(vm.ft).gte(vm.st)).agg(ejs.TermsAggregation("agg1").field("verb")))
                    .aggregation(ejs.FilterAggregation("ag2").filter(ejs.RangeFilter("@timestamp").lte(vm.ft).gte(vm.st)).agg(ejs.TermsAggregation("agg2").field("geoip.city_name.raw")))
                    .aggregation(ejs.FilterAggregation("ag3").filter(ejs.RangeFilter("@timestamp").lte(vm.ft).gte(vm.st)).agg(ejs.TermsAggregation("agg3").field("request.raw")))

            }).then(function (resp) {
                //vm.pietitle = ["verb","clientip.raw","request.raw"];
                drawpie(resp.aggregations);
            }, function (err) {
                //log("pieChart data error " + err.message);
                vm.indicesName = $rootScope.index;
                $timeout(pieChart, 1000);
            });
        }

        function drawpie(agg) {
            google.setOnLoadCallback(drawpie);
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'key');
            data.addColumn('number', 'Number');
            angular.forEach(agg.ag1.agg1.buckets, function (n) {
                data.addRow([n.key.toString(), n.doc_count]);

            });

            var piechart = new google.visualization.PieChart(document.getElementById('pie_div1'));
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
            piechart.draw(data, options);


            var data1 = new google.visualization.DataTable();
            data1.addColumn('string', 'key');
            data1.addColumn('number', 'Number');
            angular.forEach(agg.ag2.agg2.buckets, function (n) {
                data1.addRow([n.key.toString(), n.doc_count]);

            });

            var piechart1 = new google.visualization.PieChart(document.getElementById('pie_div2'));
            piechart1.draw(data1, options);

            var data2 = new google.visualization.DataTable();
            data2.addColumn('string', 'key');
            data2.addColumn('number', 'Number');
            angular.forEach(agg.ag3.agg3.buckets, function (n) {
                data2.addRow([n.key.toString(), n.doc_count]);

            });

            var piechart2 = new google.visualization.PieChart(document.getElementById('pie_div3'));
            piechart2.draw(data2, options);

            google.visualization.events.addListener(piechart, 'select',
               function () {
                   var row = piechart.getSelection()[0].row;
                   log(data.getValue(row, 0) + data.getValue(row, 1))

               });


        }
        //#endregion


        //#region Time Chart

        function timeLineGram() {

            datasearch.dateHistogramAggregation(vm.indicesName, vm.type, "@timestamp", "day", vm.st, vm.ft)
                .then(function (resp) {
                vm.total = resp.aggregations;
                vm.hitSearch = resp.aggregations.ag.agg.buckets;
                drawTimwLine(resp.aggregations.ag.agg.buckets);
            }, function (err) {
                //log("timelineGram data error " + err.message);
                vm.indicesName = $rootScope.index;
                $timeout(timeLineGram, 1000);
            });
        }

        function drawTimwLine(agg) {
            google.setOnLoadCallback(drawTimwLine);
            var data = new google.visualization.DataTable();
            data.addColumn('date', 'Date');
            data.addColumn('number', 'Count');

            angular.forEach(agg, function (n) {
                data.addRow([new Date(n.key), n.doc_count]);
            });
            var chart = new google.visualization.AnnotatedTimeLine(document.getElementById('TimeLine_div'));
            chart.draw(data, {
                displayAnnotations: true, dateFormat: 'MM-dd-yyyy', displayAnnotationsFilter: true,
                thickness: 3, wmode: 'transparent'
            });

        }

        function histGram() {

            datasearch.dateHistogramAggregation(vm.indicesName, vm.type, "@timestamp", "day", vm.st, vm.ft).then(function (resp) {
                vm.total = resp.aggregations;
                vm.hitSearch = resp.aggregations.ag.agg.buckets;
                drawHist(resp.aggregations.ag.agg.buckets);
            }, function (err) {
                log("histGram data error " + err.message);
            });
        }

        function drawHist(agg) {

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
                data.addRow([new Date(n.key), n.doc_count]);

                // Data.addRow([n.doc_count, new Date(n.key_as_string.substring(0,4), n.key_as_string.substring(5,7), n.key_as_string.substring(8,10))]);
            });


            var options = google.charts.Bar.convertOptions({
                title: 'Total Request Received Throughout the Day',
                hAxis: {
                    format: 'MM/dd/yyyy',
                },
            });


            var chart = new google.charts.Bar(document.getElementById('DateHist_div'));
            chart.draw(data, options);

            /*      var chart = new google.visualization.LineChart(document.getElementById('DateHist_div'));
                     chart.draw(data, options);*/

        }
        //#endregion


        //#region Draw Map2
        function geoMap2() {
            datasearch.termAggragation(vm.indicesName, vm.type, "geoip.country_name.raw", 100, vm.st, vm.ft).
                then(function (resp) {
                    //vm.tt = resp.hits.total;
                    drawMap2(resp.aggregations.ag.agg.buckets);
                }, function (err) {
                    log("geoMap2 data error" + err.message);
                    //vm.indicesName = $rootScope.index;
                    //$timeout(geoMap2, 1000);
                });
        }

        function drawMap2(r) {

           google.setOnLoadCallback(drawMap2);

            var geoData2 = new google.visualization.DataTable();
            geoData2.addColumn('string', 'Country');
            geoData2.addColumn('number', 'Count');

            angular.forEach(r, function (n) {
                geoData2.addRow([n.key.toString(), n.doc_count]);
            });
            var options = {
                colorAxis: { colors: ['#B2B2FF', '#0000FF', '#00004C'] },
                backgroundColor: '#FFF0F5'
            };

            if (document.getElementById('gmap_div')==undefined) {
                log("1");
            }
            var chart = new google.visualization.GeoChart(document.getElementById('gmap_div'));
    
            chart.draw(geoData2, options);
           
            vm.isBusy = false;
        }
        //#endregion
    }




})();