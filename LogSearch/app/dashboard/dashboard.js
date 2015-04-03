(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['$cookieStore','$rootScope','common', 'dataconfig','client', dashboard]);

    function dashboard($cookieStore,$rootScope, common, dataconfig, client) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;    

       // vm.people = [];
        vm.title = 'Dashboard';
        vm.indicesName = [];
        vm.findicies = [];
      //  vm.getFieldName = getFieldName;
        vm.getIndexName = getIndexName;
        //   vm.getTypeName = getTypeName;
        vm.geoMap = geoMap;
        vm.init = init;
        vm.histGram = histGram;
        vm.filterindex = filterindex;
        activate();
        function getIndexName() {
            if ($cookieStore.get('index') !== undefined) {
                if ($rootScope.index.length !== $cookieStore.get('index').length && $rootScope.index.length > 1) {
                    $cookieStore.remove('index');
                }
            }

            if ($cookieStore.get('index') === undefined || $cookieStore.get('index').length <= 1) {

                $cookieStore.put('index', $rootScope.index);
            }



            vm.indicesName = $cookieStore.get('index');
          //  vm.indicesName = $rootScope.index;
        }
        function init() {
            getIndexName();
            histGram();
            pieChart();
            geoMap();
        }
            
            function activate() {
                common.activateController([init()], controllerId)
                    .then(function () {
                       
                        log('Activated Dashboard View');                       
                       //google.setOnLoadCallback(drawMap);
                       // google.setOnLoadCallback(drawhist);
                        //google.setOnLoadCallback(drawpie);
                        
                    });
            } 
         
         
            function geoMap() {
                
            client.search({
                index: ["logstash-2015.03.23", "logstash-2015.03.24", "logstash-2015.04.01", "logstash-2015.04.02"],
                type: 'logs',
                size:100,
                body:
                    ejs.Request()
                        .query(ejs.MatchAllQuery())
                        .aggregation(ejs.TermsAggregation("agg").field("geoip.city_name.raw").size(100))

            }).then(function(resp) {
                vm.tt = resp.hits.total;
                drawMap(resp.aggregations.agg.buckets,vm.tt);
            }, function(err) {
                log(err.message);
            });

        }

        function filterindex() {
            vm.findicies = dataconfig.filterIndex();
            histgram();
        }

        function pieChart() {
            client.search({
                index: vm.indicesName,
                type: 'logs',
                body: ejs.Request()
                    .aggregation(ejs.TermsAggregation("agg1").field("verb"))
                    .aggregation(ejs.TermsAggregation("agg2").field("clientip"))
                    .aggregation(ejs.TermsAggregation("agg3").field("request.raw"))   

            }).then(function (resp) {               
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
                'width': 520,
                'height': 300,
                forceIFrame:true,
                //pieSliceText: 'label','value',
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
                   log("1");
                   piechart.getSelection();
               });

            
        }

        function histGram() {

            client.search({
                index: vm.indicesName,
                type: 'logs',
                body: ejs.Request()
                    .aggregation(ejs.DateHistogramAggregation("agg").field("@timestamp").interval("day"))
                //.format("yyyy-MM-dd")

            }).then(function (resp) {
                vm.total = resp.aggregations;
                vm.hitSearch = resp.aggregations.agg.buckets;
                drawhist(resp.aggregations.agg.buckets);
            }, function (err) {
                log(err.message);
            });
        }
        vm.location = [];
        function drawMap(r,tt) {

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
                
                 if (n.doc_count>tt/40)
               {
                    geoData.addRow([n.key.toString(),n.doc_count]);}
         
                
                
            });

            var geoView = new google.visualization.DataView(geoData);
            geoView.setColumns([0,1]);
          

            var table =
                new google.visualization.Table(document.getElementById('dtable_div'));

            
           // google.visualization.data.group(table, keys, columns)
               table.draw(geoData, { showRowNumber: true });

            var map =
                new google.visualization.Map(document.getElementById('dmap_div'));
            map.draw(geoView, { showTip: true });
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
       

        function drawhist(agg) {
         /*   var data = google.visualization.arrayToDataTable([
          ['Dinosaur', 'Length'],
          ['Acrocanthosaurus (top-spined lizard)', 12.2],
          ['Albertosaurus (Alberta lizard)', 9.1],
          ['Allosaurus (other lizard)', 12.2],
          ['Apatosaurus (deceptive lizard)', 22.9],
          ['Archaeopteryx (ancient wing)', 0.9],
          ['Argentinosaurus (Argentina lizard)', 36.6],
          ['Baryonyx (heavy claws)', 9.1],
          ['Brachiosaurus (arm lizard)', 30.5],
          ['Ceratosaurus (horned lizard)', 6.1],
          ['Coelophysis (hollow form)', 2.7],
          ['Compsognathus (elegant jaw)', 0.9],
          ['Deinonychus (terrible claw)', 2.7],
          ['Diplodocus (double beam)', 27.1],
          ['Dromicelomimus (emu mimic)', 3.4],
          ['Gallimimus (fowl mimic)', 5.5],
          ['Mamenchisaurus (Mamenchi lizard)', 21.0],
          ['Megalosaurus (big lizard)', 7.9],
          ['Microvenator (small hunter)', 1.2],
          ['Ornithomimus (bird mimic)', 4.6],
          ['Oviraptor (egg robber)', 1.5],
          ['Plateosaurus (flat lizard)', 7.9],
          ['Sauronithoides (narrow-clawed lizard)', 2.0],
          ['Seismosaurus (tremor lizard)', 45.7],
          ['Spinosaurus (spiny lizard)', 12.2],
          ['Supersaurus (super lizard)', 30.5],
          ['Tyrannosaurus (tyrant lizard)', 15.2],
          ['Ultrasaurus (ultra lizard)', 30.5],
          ['Velociraptor (swift robber)', 1.8]]);

            var Data = new google.visualization.DataTable();
            Data.addColumn('string', 'Date');
            Data.addColumn('number', 'Number');
        


            angular.forEach(agg, function (n) {
                Data.addRow([n.key_as_string,n.doc_count]);
            });


            var options = {
                title: 'Lengths of dinosaurs, in meters',
                legend: { position: 'none' },
                histogram: { bucketSize: 100 }
            };

            var chart = new google.visualization.Histogram(document.getElementById('histgram'));
            chart.draw(Data, options);*/



            var data = new google.visualization.DataTable();
            data.addColumn('date', 'Date');
            data.addColumn('number', 'Count');
            
            angular.forEach(agg, function (n) {
                data.addRow([new Date(n.key_as_string), n.doc_count]);
            });
            /*data.addRows([
              [new Date("2008-02-10T00:00:00.000Z"), 30000],
              [new Date(2008, 1, 2), 14045],
              [new Date(2008, 1, 3), 55022],
              [new Date(2008, 1, 4), 75284],
              [new Date(2008, 1, 5), 41476],
              [new Date(2008, 1, 6), 33322]
            ]);*/

            var chart = new google.visualization.AnnotatedTimeLine(document.getElementById('DateHist_div'));
            chart.draw(data, { displayAnnotations: true });
        }

    }




})();