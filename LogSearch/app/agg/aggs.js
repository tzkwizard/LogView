(function () {
    'use strict';

    var controllerId = 'aggs';

    angular.module('app')
        .controller(controllerId, function ($interval, $q, $route, $timeout, $cookieStore, $rootScope, $scope, $location,
            common, bsDialog, client, datasearch, dataconfig) {


            var vm = this;
            vm.title = "Aggragations";
            vm.title2 = "PieChart";
            var getLogFn = common.logger.getLogFn;
            var log = getLogFn(controllerId);


            //#region variable
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


            vm.size = 20;
            vm.searchText = "*";
            vm.refinedsearch = [];
            vm.hitSearch = "";
            vm.total = 0;
            vm.mystyle = { 'color': 'blue' };
            vm.aggName = "";

            vm.filterAggName = "";
            vm.pagecount = 10;

            vm.fieldsName = [];
            vm.typesName = [];
            vm.indicesName = [];
            vm.index = '';
            vm.type = '';


            vm.dashboard = "dash";
            vm.range = "range";
            vm.barchart = "bar";
            vm.tablechart = "table";
            //#endregion


            //#region function
            vm.treMap = treeMap;
            vm.aggShow = aggShow;
            vm.aggshows = aggshows;
            vm.drawTable = drawTable;
            vm.drawMap = drawMap;
            vm.getFieldName = getFieldName;
            vm.getIndexName = getIndexName;
            vm.getTypeName = getTypeName;
            vm.refresh = refresh;
            vm.go = go;
            vm.clear = clear;
            //#endregion


            //#region Test
            vm.tes = "ab";
            vm.test = function test(doc) {
                /* var route = '/';
                 var temp = doc.key;
                 var field = vm.aggName;
                 $location.path(route + temp);
                 $location.search('logs', "logs");
                 $location.search('log', "log");
                 $location.search('field', field);*/
            }
            //#endregion


            //#region button
            function refresh($event) {
                $route.reload();
                /* vm.searchText = '*';
                 vm.isBusy = true;
                 activate();
                 // aggShow("");*/
                $location.search.refresh = true;
                toastr.info("Refreshed");
            }

            function go() {

                $location.search.text = vm.searchText;
                $location.path('/els/');
            }

            function clear() {
                vm.searchText = "*";
                vm.refinedsearch = [
                       { key: 'Time', value: new Date() },
                       { key: 'School', value: 'TCU' }
                ];
                getFieldName();
                if (fp === undefined) {
                    aggShow("");
                } else {
                    fp.then(function (data) {
                        vm.fieldsName = data;
                        aggShow("");
                    });
                }
            }
            //#endregion


            //#region Draw-tree
            vm.fieldstree = [];
            vm.treestatus = true;
            function treeMap(index, aggName, datatree) {
                // var promises = [];
                return datasearch.termAggragation(index, vm.type, aggName, vm.size, $rootScope.st, $rootScope.ft)
                        .then(function (resp) {
                            var tt = resp.aggregations.ag.agg.buckets;
                            tt.map(function (y) {
                                var x = Math.random() * y.doc_count - 50;
                                // datatree.addRow([y.key + "\n" + aggName + "\n" + index, aggName + "\n" + index, y.doc_count, x]);
                                datatree.addRow([y.key + "\n" + aggName, aggName, y.doc_count, x]);
                            });
                            //return $q.all(promises);
                        }, function (err) {
                            // log(err.message);
                        });

            }


            function drawtreemap() {
                /*var data = google.visualization.arrayToDataTable([
              ['Location', 'Parent', 'Market trade volume (size)', 'Market increase/decrease (color)'],
              ['Global', null, 0, 0],
              ['America', 'Global', 0, 0],
              ['S. Africa', 'Africa', 30, 43],          
              ['Beijing','China',23,22]
                    ]);*/
                try {
                    var datatree = new google.visualization.DataTable();
                    vm.fieldstree = [];

                    angular.forEach(vm.fieldsName, function (x) {
                        if (x.substring(x.length - 3, x.length) === "raw") {
                            vm.fieldstree.push(x);
                        }
                    });
                    var field = vm.fieldstree.indexOf("timestamp.raw");
                    vm.fieldstree.splice(field, 1);


                    datatree.addColumn('string', 'Name');
                    datatree.addColumn('string', 'Parent');
                    datatree.addColumn('number', 'count');
                    datatree.addColumn('number', 'color');


                    vm.cc = cc;
                    var promise = [];
                    function cc() {

                        /* datatree.addRow(["Elasticsearch", null, 0, 0]);
                        angular.forEach(vm.indicesName, function (n) {
                         
                           datatree.addRow([n, "Elasticsearch", 0, 0]);
                           angular.forEach(vm.fieldstree, function (m) {
   
                               var x = Math.random() * 100 - 50;
                               datatree.addRow([m + "\n" + n, n, 0, 0]);
   
                               treeMap(n, m, datatree);
   
                           });
                        });*/


                        datatree.addRow(["Elasticsearch", null, 0, 0]);

                        vm.fieldstree.map(function (m) {

                            var x = Math.random() * 100 - 50;
                            datatree.addRow([m, "Elasticsearch", 0, 0]);

                            promise.push(treeMap(vm.indicesName, m, datatree));

                        });
                        return $q.all(promise);
                    }

                    cc();

                    var tree = new google.visualization.TreeMap(document.getElementById('treemap_div'));



                    vm.dd = dd;

                    //var deferred = $q.defer();
                    // var promise = deferred.promise;


                    $q.all(promise).then(function () {
                        dd();
                    }, function () { log("2"); });


                    aggShow();
                    function dd() {

                        tree.draw(datatree, {
                            minColor: '#FFFFFF',
                            midColor: '#2EFEF7',
                            maxColor: '#00BFFF',
                            headerHeight: 15,
                            fontColor: 'black',
                            showScale: true,
                            showTooltips: true,
                            generateTooltip: showStaticTooltip
                        });

                        function showStaticTooltip(row, size, value) {
                            return '<div style="background:#fd9; padding:10px; border-style:solid">' +
                                '<a> Tag:' + datatree.getValue(row, 0) + '<hr>' + '</b> Size:' + size + '</b> Value:' + value + '</a>.</div>';
                        }


                        google.visualization.events.addListener(tree, 'select',
                            function () {
                                tree.goUpAndDraw();
                            });

                        //  aggShow();
                        vm.isBusy = false;
                    }
                } catch (ex) {
                    log("Loading Map error" + ex);
                    vm.isBusy = false;
                }


            }
            //#endregion


            //#region View Load
            activate();
            function activate() {
                common.activateController([getIndexName()], controllerId)
                    .then(function () {
                        // aggShow("");
                        // datatree = new google.visualization.DataTable();
                        vm.refinedsearch = [
                        { key: 'Time', value: new Date() },
                        { key: 'School', value: $rootScope.school }
                        ];
                        //log(vm.searchText);
                        log('Activated Aggs search View');
                        google.setOnLoadCallback(drawDashboard);
                        google.setOnLoadCallback(drawDashboard2);
                        google.setOnLoadCallback(drawTable);
                        google.setOnLoadCallback(drawMap);
                        google.setOnLoadCallback(drawtreemap);
                    });
            }


            var ip;
            var fp;
            function getIndexName() {

                try {
                    if ($cookieStore.get('index') !== undefined&&$rootScope.index!== undefined) {
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

                            // vm.indicesName = dataconfig.initIndex();
                            ip = dataconfig.initIndex();
                        }
                    }

                    vm.type = $rootScope.logtype;
                    // vm.indicesName = $cookieStore.get('index');
                    vm.treestatus = true;

                } catch (ex) {
                    log("Fail to Load Index");
                }




                // vm.indicesName = $rootScope.index;
                //vm.index = vm.indicesName[0];
                //vm.index = "logstash-2015.04.01";
                if (ip === undefined) {
                    getFieldName();
                } else {
                    ip.then(function (data) {
                        vm.indicesName = data;
                        getFieldName();
                    });
                }

            }

            function getTypeName() {
                vm.typesName = dataconfig.getTypeName(vm.index, vm.pagecount);
            }

            function getFieldName() {

                try {
                    if ($cookieStore.get('logfield') !== undefined && $rootScope.logfield !== undefined) {
                        if ($rootScope.logfield.length !== $cookieStore.get('logfield').length && $rootScope.logfield.length > 1) {
                            $cookieStore.remove('logfield');
                        }

                    }
                    vm.fieldsName = $cookieStore.get('logfield');

                    if ($cookieStore.get('logfield') === undefined || $cookieStore.get('logfield').length <= 1) {
                        if ($rootScope.logfield !== undefined && $rootScope.logfield.length >= 1) {
                            $cookieStore.put('logfield', $rootScope.logfield);
                            vm.fieldsName = $cookieStore.get('logfield');
                        } else {

                            //vm.fieldsName = dataconfig.getFieldName(vm.indicesName[0], $rootScope.logtype);
                            fp = dataconfig.getFieldName(vm.indicesName[0], $rootScope.logtype);
                        }
                    }
                } catch (ex) {
                    log("Fail to Load Field");
                }




                vm.aggName = "";

                if (fp === undefined) {
                    if (vm.treestatus === true) {
                        drawtreemap();
                    }
                } else {
                    fp.then(function (data) {
                        vm.fieldsName = data;
                        if (vm.treestatus === true) {
                            drawtreemap();
                        }
                    });
                }

            }
            //#endregion


            //#region Draw chart
            function aggShow(aggName) {

                var main = document.getElementById('div2');
                var contain = document.getElementById('contain');
                if (contain !== null) {
                    main.removeChild(contain);
                }
                try {
                    if (vm.aggName === "" || vm.aggName === "all") {
                        // vm.fieldsName = $rootScope.logfield;

                        vm.aggfield = [];
                        vm.aggfield = vm.fieldsName;

                        var index = vm.aggfield.indexOf("@timestamp");
                        vm.aggfield.splice(index, 1);
                        index = vm.aggfield.indexOf("referrer");
                        vm.aggfield.splice(index, 1);
                        index = vm.aggfield.indexOf("referrer.raw");
                        vm.aggfield.splice(index, 1);
                        index = vm.aggfield.indexOf("timestamp");
                        vm.aggfield.splice(index, 1);
                        index = vm.aggfield.indexOf("request");
                        vm.aggfield.splice(index, 1);
                        index = vm.aggfield.indexOf("edata");
                        vm.aggfield.splice(index, 1);
                        index = vm.aggfield.indexOf("action");
                        vm.aggfield.splice(index, 1);
                        index = vm.aggfield.indexOf("host");
                        vm.aggfield.splice(index, 1);
                        index = vm.aggfield.indexOf("action");
                        vm.aggfield.splice(index, 1);
                        index = vm.aggfield.indexOf("agent");
                        vm.aggfield.splice(index, 1);
                        index = vm.aggfield.indexOf("action");
                        vm.aggfield.splice(index, 1);


                        var flag;
                        angular.forEach(vm.aggfield, function (name) {
                            if (vm.aggfield.length <= 2) {
                                flag = true;
                            } else {
                                flag = false;
                            }
                            aggshows(name, flag);
                        });

                    } else {

                        datasearch.termAggragationwithQuery(vm.indicesName, vm.type, aggName, vm.size, vm.searchText, $rootScope.st, $rootScope.ft).then(function (resp) {
                            vm.total = resp.hits.total;
                            vm.hitSearch = resp.aggregations.ag.agg.buckets;
                            drawDashboard(resp.aggregations.ag.agg, aggName);
                        }, function (err) {
                            // log(err.message);
                        });
                    }
                } catch (ex) {
                    log("Loading pie Error" + ex);
                }

                // vm.isBusy = false;
            }

            function aggshows(aggName, flag) {

                dataconfig.createContainer(aggName);

                vm.dashboard = "dash";
                vm.range = "range";
                vm.barchart = "bar";
                vm.tablechart = "table";

                datasearch.termAggragationwithQuery(vm.indicesName, vm.type, aggName, vm.size, vm.searchText, $rootScope.st, $rootScope.ft).then(function (resp) {
                    vm.dashboard = vm.dashboard + aggName;
                    vm.range = vm.range + aggName;
                    vm.barchart = vm.barchart + aggName;
                    vm.tablechart = vm.tablechart + aggName;
                    // vm.hitSearch = resp.hits.hits;
                    vm.total = resp.hits.total;
                    if (!flag) {
                        if (resp.aggregations.ag.agg.buckets.length > 1) {
                            drawDashboard2(resp.aggregations.ag.agg, aggName);
                        }
                    } else {
                        drawDashboard2(resp.aggregations.ag.agg, aggName);
                    }



                }, function (err) {
                    // log(err.message);
                });

            }

            function drawDashboard2(agg, y) {


                var data = new google.visualization.DataTable();
                data.addColumn('string', 'key');
                data.addColumn('number', 'Count Range');
                for (var i = 0; i < agg.buckets.length; i++) {
                    data.addRow([agg.buckets[i].key.toString(), agg.buckets[i].doc_count]);

                }
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
                var name = "table" + y;
                drawTable(data, name, y);

                // Establish dependencies, declaring that 'filter' drives 'pieChart',
                // so that the pie chart will only display entries that are let through
                // given the chosen slider range.
                dashboard.bind(donutRangeSlider, [pieChart]);

                // Draw the dashboard.
                dashboard.draw(data);
                google.visualization.events.addListener(pieChart, 'select', function () {
                    var row = getSelection(pieChart);
                    /* if (field.substring(field.length - 3, field.length) === "raw") {
                        log(field.substring(0, field.length - 4));
                        y = field.substring(0, field.length - 4);
                    }


                    if (vm.searchText === "*") {
                        vm.searchText = field + " : \"" + data.getValue(row, 0) + "\"";
                        $timeout(pushrefinedata, 500);
                    } else {
                        vm.searchText += " AND " + field + " : \"" + data.getValue(row, 0) + "\"";
                        $timeout(pushrefinedata, 500);
                    }
                    vm.pushrefinedata = pushrefinedata;

                    function pushrefinedata() {
                        vm.refinedsearch.push({ key: field, value: data.getValue(row, 0) });
                    }

                    log(vm.searchText);
                    aggShow("");*/
                    /* angular.forEach(row,function(x) {
                         log(x   );
                     });*/

                });

            }

            function drawDashboard(agg, aggName) {

                // Create our data table.


                /*if (vm.typesName.indexOf(vm.type) === -1 || vm.fieldsName.indexOf(vm.aggName) === -1) {
                    return;
                }*/

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
                        'title': aggName,
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

                drawTable(data, 'table_div', aggName);

                // Establish dependencies, declaring that 'filter' drives 'pieChart',
                // so that the pie chart will only display entries that are let through
                // given the chosen slider range.
                dashboard.bind(donutRangeSlider, [pieChart]);

                // Draw the dashboard.
                dashboard.draw(data);
                vm.ft = new Date();
                datasearch.getSampledata(vm.indicesName, $rootScope.logtype, 15, $rootScope.st, $rootScope.ft).then(function (resp) {
                    vm.hit = resp.hits.hits;
                    drawMap(vm.hit);
                }, function (err) {
                    // log(err.message);
                });

            }

            function drawMap(r) {

                var geoData = new google.visualization.DataTable();
                geoData.addColumn('number', 'Lat');
                geoData.addColumn('number', 'Lon');
                geoData.addColumn('string', 'Name');

                angular.forEach(r, function (n) {

                    geoData.addRow([n._source.geoip.latitude, n._source.geoip.longitude, n._source.geoip.city_name]);
                });

                var geoView = new google.visualization.DataView(geoData);
                geoView.setColumns([0, 1]);

                var table =
                    new google.visualization.Table(document.getElementById('table'));
                //table.draw(geoData, { showRowNumber: false });

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

            function drawTable(data, name, field) {


                var table = new google.visualization.Table(document.getElementById(name));

                table.draw(data, { showRowNumber: true });

                google.visualization.events.addListener(table, 'select', function () {
                    var row = table.getSelection()[0].row;
                    /*                
                          $location.search('logs', "logs");
                          $location.search('log', "log");
                          $location.search('field', field);*/
                    // if(field.substring(field.length-3))
                    /* $timeout(xy,1000);
                     vm.xy = xy;
                         function xy () {
                         $location.path('/els');
                     }*/
                    if (vm.refinedsearch.length > 1)
                    { vm.treestatus = false; }
                    if (field.substring(field.length - 3, field.length) === "raw") {
                        // log(field.substring(0, field.length - 4));
                        field = field.substring(0, field.length - 4);
                    }


                    if (vm.searchText === "*") {
                        vm.searchText = field + " : \"" + data.getValue(row, 0) + "\"";
                        $timeout(pushrefinedata, 500);
                    }
                    else {
                        vm.searchText += " AND " + field + " : \"" + data.getValue(row, 0) + "\"";
                        $timeout(pushrefinedata, 500);
                    }
                    vm.pushrefinedata = pushrefinedata;
                    function pushrefinedata() {
                        vm.refinedsearch.push({ key: field, value: data.getValue(row, 0) });
                    }

                    log(vm.searchText);
                    aggShow("");
                });

            }
            //#endregion




        });
})();


