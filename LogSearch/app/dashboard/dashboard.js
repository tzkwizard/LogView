(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['$timeout', '$cookieStore', '$rootScope', 'common', 'dataconfig', 'datasearch', 'client', dashboard]);

    function dashboard($timeout, $cookieStore, $rootScope, common, dataconfig,datasearch, client) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
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
        // vm.people = [];
        vm.title = 'Dashboard';
        vm.indicesName = [];

        //  vm.getFieldName = getFieldName;
        vm.getIndexName = getIndexName;
        //   vm.getTypeName = getTypeName;
        vm.geoMap = geoMap;
        vm.histGram = histGram;
        vm.init = init;
        vm.timeLineGram = timeLineGram;



        vm.test = test;
        function test() {

        }







        //  Load
        activate();
        function activate() {
            common.activateController([init()], controllerId)
                .then(function () {


                    google.setOnLoadCallback(drawMap);
                    google.setOnLoadCallback(drawHist);
                    google.setOnLoadCallback(drawpie);
                    google.setOnLoadCallback(drawTimwLine);
                    log('Activated Dashboard View');

                });
        }

        function init() {
            getIndexName();

            $timeout(timeLineGram, 1200);
            $timeout(pieChart, 1200);
            $timeout(geoMap, 1200);
            $timeout(histGram, 1200);
            //$timeout(renew, 800);
        }

 

        function getIndexName() {
             
            if ($cookieStore.get('index') !== undefined) {
                if ($rootScope.index.length !== $cookieStore.get('index').length && $rootScope.index.length > 1) {
                    $cookieStore.remove('index');
                }
                
            }
            vm.indicesName = $cookieStore.get('index');

            if ($cookieStore.get('index') === undefined || $cookieStore.get('index').length <= 1) {
                if ($rootScope.index !== undefined && $rootScope.index.length >= 1) {
                    $cookieStore.put('index', $rootScope.index);
                    vm.indicesName = $cookieStore.get('index');
                } else {

                    vm.indicesName = dataconfig.filterIndex();
                }
            }
            


            
        }


        //   Draw Map
        vm.location = [];
        function geoMap() {
            datasearch.termAggragation(vm.indicesName, 'logs', "geoip.city_name.raw", vm.size).then(function (resp) {
                vm.tt = resp.hits.total;
                drawMap(resp.aggregations.agg.buckets, vm.tt);
            }, function (err) {
                log(err.message);
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


                /* if (vm.location.indexOf(n._source.clientip) === -1 && n._source.geoip.city_name!==undefined) {
                     vm.location.push(n._source.clientip);                   
                     geoData.addRow([n._source.geoip.city_name, n._source.clientip, n._source.geoip.latitude, n._source.geoip.longitude, 1]);
                 }*/

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

            vm.isBusy = false;
        }


        //   Draw Pie      

        function pieChart() {
            client.search({
                index: vm.indicesName,
                type: 'logs',
                body: ejs.Request()
                    .aggregation(ejs.TermsAggregation("agg1").field("verb"))
                    .aggregation(ejs.TermsAggregation("agg2").field("clientip.raw"))
                    .aggregation(ejs.TermsAggregation("agg3").field("request.raw"))

            }).then(function (resp) {
                //vm.pietitle = ["verb","clientip.raw","request.raw"];
                drawpie(resp.aggregations);
                //log("1");
            }, function (err) {
                log(err.message);
            });
        }

        function drawpie(agg) {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'key');
            data.addColumn('number', 'Number');
            angular.forEach(agg.agg1.buckets, function (n) {
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
            angular.forEach(agg.agg2.buckets, function (n) {
                data1.addRow([n.key.toString(), n.doc_count]);

            });

            var piechart1 = new google.visualization.PieChart(document.getElementById('pie_div2'));
            piechart1.draw(data1, options);

            var data2 = new google.visualization.DataTable();
            data2.addColumn('string', 'key');
            data2.addColumn('number', 'Number');
            angular.forEach(agg.agg3.buckets, function (n) {
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


        //   Time Chart

        function timeLineGram() {

            datasearch.dateHistogramAggregation(vm.indicesName, 'logs', "@timestamp", "day").then(function (resp) {
                vm.total = resp.aggregations;
                vm.hitSearch = resp.aggregations.agg.buckets;
                drawTimwLine(resp.aggregations.agg.buckets);
            }, function (err) {
                log(err.message);
            });
        }

        function drawTimwLine(agg) {
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
    
            datasearch.dateHistogramAggregation(vm.indicesName, 'logs', "@timestamp", "day").then(function (resp) {
                vm.total = resp.aggregations;
                vm.hitSearch = resp.aggregations.agg.buckets;
                drawHist(resp.aggregations.agg.buckets);
            }, function (err) {
                log(err.message);
            });
        }

        function drawHist(agg) {


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




    }




})();