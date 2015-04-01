(function () {
    'use strict';

    var controllerId = 'aggs';

    angular.module('app')
        .controller(controllerId, function ($rootScope,$scope, $location, common, client, datasearch, dataconfig) {


            var vm = this;
            vm.title = "Aggragations";
            //variable
            var getLogFn = common.logger.getLogFn;
            var log = getLogFn(controllerId);

            vm.hitSearch = "";
            vm.hits = "";
            vm.total = 0;
            vm.mystyle = { 'color': 'blue' };
            vm.aggName = "";
            vm.type = 'logs';
            vm.filterAggName = "";
            vm.pagecount = 10;
            vm.indices = ['logs', 'logsd'];

            vm.fieldsName = [];
            vm.typesName = [];
            vm.indicesName = [];
            vm.index = 'logs';
            vm.type = '';


            vm.dashboard = "dash";
            vm.range = "range";
            vm.barchart = "bar";
            vm.tablechart = "table";
            vm.treMap = treeMap;
            //function
  
            vm.changev = changev;
            vm.aggShow = aggShow;
            vm.aggshows = aggshows;
        vm.drawTable = drawTable;
        vm.drawMap = drawMap;
            vm.getFieldName = getFieldName;
            vm.getIndexName = getIndexName;
            vm.getTypeName = getTypeName;



            function drawtreemap() {
                /*var data = google.visualization.arrayToDataTable([
          ['Location', 'Parent', 'Market trade volume (size)', 'Market increase/decrease (color)'],
          ['Global', null, 0, 0],
          ['America', 'Global', 0, 0],
          ['Europe', 'Global', 0, 0],
          ['Asia', 'Global', 0, 0],
          ['Australia', 'Global', 0, 0],
          ['Africa', 'Global', 0, 0],
          ['Brazil', 'America', 11, 10],
          ['USA', 'America', 52, 31],
          ['Mexico', 'America', 24, 12],
          ['Canada', 'America', 16, -23],
          ['France', 'Europe', 42, -11],
          ['Germany', 'Europe', 31, -2],
          ['Sweden', 'Europe', 22, -13],
          ['Italy', 'Europe', 17, 4],
          ['UK', 'Europe', 21, -5],
          ['China', 'Asia', 36, 4],
          ['Japan', 'Asia', 20, -12],
          ['India', 'Asia', 40, 63],
          ['Laos', 'Asia', 4, 34],
          ['Mongolia', 'Asia', 1, -5],
          ['Israel', 'Asia', 12, 24],
          ['Iran', 'Asia', 18, 13],
          ['Pakistan', 'Asia', 11, -52],
          ['Egypt', 'Africa', 21, 0],
          ['S. Africa', 'Africa', 30, 43],
          ['Sudan', 'Africa', 12, 2],
          ['Congo', 'Africa', 10, 12],
          ['Zaire', 'Africa', 8, 10],
          ['Beijing','China',23,22]
                ]);*/
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Name');
                data.addColumn('string', 'Parent');
                 data.addColumn('number', 'count');
                 data.addColumn('number', 'color');           
              
                 angular.forEach(vm.indicesName, function (n) {

                     data.addRow(["Elasticsearch", null, 2, 3]);
                     data.addRow([n, "Elasticsearch", 2, 3]);
                     vm.fieldsName = dataconfig.getFieldName("logstash-2015.02.10", 'logs');
                     
                     angular.forEach(vm.fieldsName, function (m) {
                         data.addRow([m, n, 2, 3]);
                     });
                 });


                var tree = new google.visualization.TreeMap(document.getElementById('treemap_div'));

                tree.draw(data, {
                    minColor: '#f00',
                    midColor: '#ddd',
                    maxColor: '#0d0',
                    headerHeight: 15,
                    fontColor: 'black',
                    showScale: true,
                    showTooltips:true,
                    generateTooltip: showStaticTooltip
                });
                function showStaticTooltip(row, size, value) {
                    return '<div style="background:#fd9; padding:10px; border-style:solid">' +
                           'Read more about the <a> Row:' + row + '</b> Size:' + size + '</a>.</div>';
                }
                google.visualization.events.addListener(tree, 'select',
               function () {
                   tree.goUpAndDraw();
               });

            }
     
            activate();
            function activate() {
                common.activateController([getIndexName()], controllerId)
                    .then(function () {
                     
                        log('Activated Aggs search View');
                        google.setOnLoadCallback(drawDashboard);

                    });
            }
            
            
            vm.tes = "ab";
            vm.test = test;
            function test(doc) {
               /* var route = '/';
                var temp = doc.key;
                var field = vm.aggName;
                $location.path(route + temp);
                $location.search('logs', "logs");
                $location.search('log', "log");
                $location.search('field', field);*/
            }

           

            function treeMap() {

                
            }
           

            function aggshows(aggName) {

                dataconfig.createContainer(aggName);
     
                vm.dashboard = "dash";
                vm.range = "range";
                vm.barchart = "bar";
                vm.tablechart = "table";

                client.search({
                    index: vm.indicesName,
                    type: "logs",
                    body: ejs.Request()
                        .aggregation(ejs.TermsAggregation("agg").field(aggName))       

                }).then(function (resp) {
                    vm.dashboard = vm.dashboard + aggName;
                    vm.range = vm.range + aggName;
                    vm.barchart = vm.barchart + aggName;
                    vm.tablechart = vm.tablechart + aggName;
                    vm.total = resp.hits.total;
                    drawDashboard2(resp.aggregations.agg, aggName);                   
                }, function (err) {
                    log(err.message);
                });

            }

            function aggShow(aggName) {
                var main = document.getElementById('div2');
                var contain = document.getElementById('contain');
                if (contain !== null)
               { main.removeChild(contain);}

                if(vm.aggName===""||vm.aggName==="all")
                {angular.forEach(vm.fieldsName, function (name) {
                    aggshows(name);
                });
                    return;
                }
   
                client.search({
                    index: vm.index,
                    type: vm.type,
                    body: ejs.Request()
                        .aggregation(ejs.TermsAggregation("agg").field(aggName))          

                }).then(function (resp) {                   
                    vm.total = resp.hits.total;
                    vm.hitSearch = resp.aggregations.agg.buckets;
                    drawDashboard(resp.aggregations.agg);                    
                }, function (err) {
                    log(err.message);
                });

            }

            function drawDashboard2(agg,y) {
                        

                var data = new google.visualization.DataTable();
                data.addColumn('string', 'key');
                data.addColumn('number', 'Number');
                for (var i = 0; i < agg.buckets.length; i++) {
                    data.addRow([agg.buckets[i].key.toString(), agg.buckets[i].doc_count]);

                }
                // Create a dashboard.
                var dashboard = new google.visualization.Dashboard(
                    document.getElementById("dash"+y));

                // Create a range slider, passing some options
                var donutRangeSlider = new google.visualization.ControlWrapper({
                    'controlType': 'NumberRangeFilter',
                    'containerId': "range"+y,
                    'options': {
                        'filterColumnLabel': 'Number'
                    }
                });

                // Create a pie chart, passing some options
                var pieChart = new google.visualization.ChartWrapper({
                    'chartType': 'PieChart',
                    'containerId': "bar"+y,
                    'options': {
                        'width': 800,
                        'height': 800,
                        'pieSliceText': 'value',
                        'legend': 'right',
                        is3D: true
                    }
                });

                //table

                var table = new google.visualization.ChartWrapper({
                    'chartType': 'Table',
                    'containerId': "table"+y,
                    'options': {
                        'width': '300px'
                    }
                });

                // Establish dependencies, declaring that 'filter' drives 'pieChart',
                // so that the pie chart will only display entries that are let through
                // given the chosen slider range.
                dashboard.bind(donutRangeSlider, [pieChart, table]);

                // Draw the dashboard.
                dashboard.draw(data);
            }

        function drawDashboard(agg) {

            // Create our data table.
            /*var data = google.visualization.arrayToDataTable([
                  ['Key', 'Number'],
                  [vm.hits.myagg3.buckets[0].key, vm.hits.myagg3.buckets[0].doc_count],
                  [vm.hits.myagg3.buckets[1].key, vm.hits.myagg3.buckets[1].doc_count],
                  [vm.hits.myagg3.buckets[2].key, vm.hits.myagg3.buckets[2].doc_count],
                  [vm.hits.myagg3.buckets[3].key, vm.hits.myagg3.buckets[3].doc_count],
                  [vm.hits.myagg3.buckets[4].key, vm.hits.myagg3.buckets[4].doc_count]
                ]);*/


      
           



            if (vm.typesName.indexOf(vm.type) === -1 || vm.fieldsName.indexOf(vm.aggName) === -1) {
                return;
            }

            var data = new google.visualization.DataTable();
            data.addColumn('string', 'key');
            data.addColumn('number', 'Number');
            for (var i = 0; i < agg.buckets.length; i++) {
                data.addRow([agg.buckets[i].key.toString(), agg.buckets[i].doc_count]);

            }
            // Create a dashboard.
            var dashboard = new google.visualization.Dashboard(
                document.getElementById('dashboard'));

            // Create a range slider, passing some options
            var donutRangeSlider = new google.visualization.ControlWrapper({
                'controlType': 'NumberRangeFilter',
                'containerId': 'filter_div',
                'options': {
                    'filterColumnLabel': 'Number'
                }
            });

            // Create a pie chart, passing some options
            var pieChart = new google.visualization.ChartWrapper({
                'chartType': 'PieChart',
                'containerId': 'chart_div',
                'options': {
                    'width': 800,
                    'height': 800,
                    'pieSliceText': 'value',
                    'legend': 'right',
                    is3D: true
                }
            });

            //table

         /*  var table = new google.visualization.ChartWrapper({
                'chartType': 'Table',
                'containerId': 'table_div',
                'options': {
                    'width': '300px'
                }
            });*/

            drawTable(data);

// Establish dependencies, declaring that 'filter' drives 'pieChart',
                // so that the pie chart will only display entries that are let through
                // given the chosen slider range.
                dashboard.bind(donutRangeSlider, [pieChart]);

                // Draw the dashboard.
                dashboard.draw(data);

                datasearch.getSampledata(vm.index, vm.type, 500).then(function (resp) {
                    vm.hit = resp.hits.hits;
                    drawMap(vm.hit);
                }, function (err) {
                    log(err.message);
                });


            
            /* google.visualization.events.addListener(table, 'select', function () {

                    /*  var route = '/';
                        var temp = doc.key;
                        var field = vm.aggName;
                        $location.path(route + temp);
                        $location.search('logs', "logs");
                        $location.search('log', "log");
                        $location.search('field', field);#1#
                   // var selection = table.getSelection();
                    log("4");
                    // alert('You selected '+ data.getValue(vm.text, 0) );
                });*/
        }


            function getIndexName() {

                vm.indicesName = $rootScope.index;
                vm.index = vm.indicesName[0];
                vm.fieldsName = dataconfig.getFieldName(vm.index, vm.type);
                drawtreemap();
            }

            function getTypeName() {
                vm.typesName = dataconfig.getTypeName(vm.index, vm.pagecount);
            }

            function getFieldName() {
                vm.fieldsName = dataconfig.getFieldName(vm.index, vm.type);
                vm.aggName = "";
            }
           


            function drawMap(r) {


               

                var geoData = new google.visualization.DataTable();
                geoData.addColumn('number', 'Lat');
                geoData.addColumn('number', 'Lon');
                geoData.addColumn('string', 'Name');

                angular.forEach(r, function (n) {

                    geoData.addRow([n._source.geoip.latitude, n._source.geoip.longitude, n._source.geoip.city_name]);
                });

               

             /*   var geoData = google.visualization.arrayToDataTable([
          ['Lat', 'Lon', 'Name', 'Food?'],
          [51.5072, -0.1275, 'Cinematics London', true],
          [48.8567, 2.3508, 'Cinematics Paris', true],
          [55.7500, 37.6167, 'Cinematics Moscow', false]]);*/

                var geoView = new google.visualization.DataView(geoData);
                geoView.setColumns([0, 1]);

                var table =
                    new google.visualization.Table(document.getElementById('table'));
             //   table.draw(geoData, { showRowNumber: false });

                var map =
                    new google.visualization.Map(document.getElementById('map_div'));
                map.draw(geoView, { showTip: true });

                // Set a 'select' event listener for the table.
                // When the table is selected, we set the selection on the map.
               /* google.visualization.events.addListener(table, 'select',
                    function () {
                        map.setSelection(table.getSelection());
                    });*/

                // Set a 'select' event listener for the map.
                // When the map is selected, we set the selection on the table.
                google.visualization.events.addListener(map, 'select',
                    function () {
                        table.setSelection(map.getSelection());
                    });

            }

        function drawTable(data) {
            

            var table = new google.visualization.Table(document.getElementById('table_div'));

            table.draw(data, { showRowNumber: true });
           /* google.visualization.events.addListener(table, 'select', selectHandler);

            // The selection handler.
            // Loop through all items in the selection and concatenate
            // a single message from all of them.
            function selectHandler() {
                var selection = table.getSelection();
                var message = '';
                for (var i = 0; i < selection.length; i++) {
                    var item = selection[i];
                    if (item.row != null && item.column != null) {
                        var str = data.getFormattedValue(item.row, item.column);
                        message += '{row:' + item.row + ',column:' + item.column + '} = ' + str + '\n';
                    } else if (item.row != null) {
                        var str = data.getFormattedValue(item.row, 0);
                        message += '{row:' + item.row + ', column:none}; value (col 0) = ' + str + '\n';
                    } else if (item.column != null) {
                        var str = data.getFormattedValue(0, item.column);
                        message += '{row:none, column:' + item.column + '}; value (row 0) = ' + str + '\n';
                    }
                }
                if (message == '') {
                    message = 'nothing';
                }
                alert('You selected ' + message);
            }*/
            google.visualization.events.addListener(table, 'select', function () {
                var row = table.getSelection()[0].row;
                alert('You selected ' + data.getValue(row, 0));
            
            var row = table.getSelection()[0].row;
                var x = data.getValue(row, 0);
                var route = '/els';
                var field = vm.aggName;
                
                $location.search('logs', "logs");
                $location.search('log', "log");
                $location.search('field', field);
                $location.path(route + x);
            });
           
        }


        function changev(aggName) {
                client.search({
                    index: 'logs',
                    type: vm.type,
                    body: {
                        "aggs": {
                            "myagg1": {
                                "terms": {
                                    "field": "ip",
                                    "size": 10
                                }
                            },
                            "myagg2": {
                                "terms": {
                                    "field": "username",
                                    "size": 10
                                }
                            },
                            "myagg3": {
                                "terms": {
                                    "field": "response",
                                    "size": 10
                                }
                            },
                            "myagg4": {
                                "terms": {
                                    "field": "message",
                                    "size": 10
                                }
                            }
                        }
                    }
                }).then(function (resp) {
                    //vm.hits = resp.aggregations;
                    vm.total = resp.hits.total;
                    switch (aggName) {
                        case "ip":
                            vm.hits = resp.aggregations.myagg1;
                            drawDashboard(resp.aggregations.myagg1);
                            break;
                        case "username":
                            drawDashboard(resp.aggregations.myagg2);
                            vm.hits = resp.aggregations.myagg2;
                            break;
                        case "response":
                            drawDashboard(resp.aggregations.myagg3);
                            vm.hits = resp.aggregations.myagg3;
                            break;
                        case "message":
                            drawDashboard(resp.aggregations.myagg4);
                            vm.hits = resp.aggregations.myagg4;
                            break;

                    }
                }, function (err) {
                    log(err.message);
                });

            }


        });
})();


/* function getFieldName() {

               client.indices.getFieldMapping({
                   index: 'logs',
                   type: 'log',
                   field: '*'
               }).then(function (resp) {
                   vm.map = resp.logs.mappings.log;
                   vm.j = 0;
                   vm.res2 = [];
                   angular.forEach(vm.map, function (name) {
                       if (name.full_name.substring(0, 1) !== '_' && name.full_name !== 'constant_score.filter.exists.field') {
                           vm.fieldname[vm.j] = name.full_name;
                           vm.j++;
                       }
                   }
                   );
               }, function (err) {
                   log(err.message);
               });

           }*/


/* 
           }*/

/* $scope.data1.dataTable.addColumn("string", "Name");
$scope.data1.dataTable.addColumn("number", "Qty");
$scope.data1.dataTable.addRow(["Test", 1]);
$scope.data1.dataTable.addRow(["Test2", 2]);
$scope.data1.dataTable.addRow(["Test3", 3]);
$scope.data1.title = "My Pie";

$scope.data2 = {};
$scope.data2.dataTable = new google.visualization.DataTable();
$scope.data2.dataTable.addColumn("string", "Name");
$scope.data2.dataTable.addColumn("number", "Qty");
$scope.data2.dataTable.addRow(["Test", 1]);
$scope.data2.dataTable.addRow(["Test2", 2]);
$scope.data2.dataTable.addRow(["Test3", 3]);


$scope.data3 = {};
$scope.data3.dataTable = new google.visualization.DataTable();
$scope.data3.dataTable.addColumn("string", "Name");
$scope.data3.dataTable.addColumn("number", "Qty");
$scope.data3.dataTable.addRow(["Test", 1]);
$scope.data3.dataTable.addRow(["Test2", 2]);
$scope.data3.dataTable.addRow(["Test3", 3]);*/

