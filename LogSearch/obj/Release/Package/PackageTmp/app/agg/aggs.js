﻿(function () {
    'use strict';

    var controllerId = 'aggs';

    angular.module('app')
        .controller(controllerId, function ($q, $route, $timeout, $cookieStore, $rootScope, $scope, $location,
            common, bsDialog, datasearch, dataconfig, config) {

            var vm = this;
            vm.title = "Aggragations";
            vm.title2 = "PieChart";
            var getLogFn = common.logger.getLogFn;
            var log = getLogFn(controllerId);
            var events = config.events;


            //#region variable
            vm.isBusy = true;
            vm.busyMessage = "wait";
            vm.spinnerOptions = {
                radius: 60,
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
            vm.ft = "";
            vm.st = "";
            var terror = false;
            vm.token = false;


            vm.dashboard = "dash";
            vm.range = "range";
            vm.barchart = "bar";
            vm.tablechart = "table";
            //#endregion


            //#region function
            vm.treMap = treeMap;
            vm.aggShow = aggShow;
            vm.aggShows = aggShows;
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

            /*$rootScope.$on('$viewContentLoaded', function readyToTrick() {
                  activate();
                 log("1");
            });  */

            /* $scope.$on('$routeChangeSuccess', function dd() {
                 log("2");
                 activate();
             });*/
            /*$scope.$emit('$routeChangeSuccess', function () {
                 return "haha";
             });*/
            //#endregion


            //#region button
            //refresh page
            function refresh() {
                //$route.reload();
                //window.location.reload();
                activate();
                $location.search.refresh = true;
                log("Refreshed");
            }

            //go to els page get result
            function go() {

                $location.search.text = vm.searchText;
                $location.path('/els/');
            }

            //clear searchtext
            function clear() {
                vm.searchText = "*";
                vm.refinedsearch = [
                       { key: 'Time', value: new Date() },
                       { key: 'School', value: 'TCU' }
                ];
                getFieldName();
            }
            //#endregion


            //#region Draw-tree
            vm.fieldstree = [];
            vm.treestatus = true;
            //get treemap data
            function treeMap(index, aggName, datatree) {
                return datasearch.termAggragation(index, vm.type, aggName, vm.size, vm.st, vm.ft)
                        .then(function (resp) {
                            var tt = resp.aggregations.ag.agg.buckets;
                            tt.map(function (y) {
                                var x = Math.random() * y.doc_count - 50;
                                // datatree.addRow([y.key + "\n" + aggName + "\n" + index, aggName + "\n" + index, y.doc_count, x]);
                                datatree.addRow([y.key + "\n" + aggName, aggName, y.doc_count, x]);
                            });
                        }, function (err) {
                            //log("Tree data Load " + err.message);
                            terror = true;
                        });

            }

            //draw tree map
            function drawTreemap() {
                google.setOnLoadCallback(drawTreemap);

                var datatree = new google.visualization.DataTable();
                vm.fieldstree = [];

                var fieldtree = vm.fieldsName;
                angular.forEach(fieldtree, function (x) {
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


                vm.treeAddData = treeAddData;
                var tpromise = [];
                function treeAddData() {


                    datatree.addRow(["Elasticsearch", null, 0, 0]);

                    vm.fieldstree.map(function (m) {

                        var x = Math.random() * 100 - 50;
                        datatree.addRow([m, "Elasticsearch", 0, 0]);

                        tpromise.push(treeMap(vm.indicesName, m, datatree));

                    });
                    // return $q.all(promise);
                }


                treeAddData();

                var tree = new google.visualization.TreeMap(document.getElementById('treemap_div'));

                vm.startDrawTree = startDrawTree;

                $q.all(tpromise).then(function () {
                    if (terror === true) {
                        terror = false;
                        vm.indicesName = $rootScope.index;
                        drawTreemap();
                    }
                    else {
                        startDrawTree();
                    }

                }, function (e) { log("TreeMap Promise Error" + e); });


                function startDrawTree() {
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

                    //vm.isBusy = false;
                }
            }
            //#endregion


            //#region View Load
            var ip;
            var fp;
            var ap = [];
            activate();
            function activate() {
                common.activateController([getIndexName()], controllerId)
                      .then(function () {
                          vm.refinedsearch = [
                          { key: 'Time', value: new Date() },
                          { key: 'School', value: $rootScope.school }
                          ];
                          //log(vm.searchText);
                          log('Activated Aggs search View');

                      });
            }

            //Load index
            function getIndexName() {

                if ($rootScope.ft !== undefined && $rootScope.st !== undefined) {
                    vm.ft = $rootScope.ft;
                    vm.st = $rootScope.st;
                } else {
                    vm.st = moment(new Date()).subtract(2, 'month');
                    vm.ft = new Date();
                }
                vm.type = $rootScope.logtype;
                try {
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
                            // vm.indicesName = dataconfig.initIndex();
                            ip = dataconfig.initIndex();
                        }
                    }


                    // vm.indicesName = $cookieStore.get('index');
                    vm.treestatus = true;

                } catch (ex) {
                    log("Fail to Load Index " + ex);
                }

                if (ip === undefined) {
                    getFieldName();
                } else {
                    ip.then(function (data) {
                        vm.indicesName = data;
                        getFieldName();
                    });
                }

            }

            //Load type
            function getTypeName() {
                vm.typesName = dataconfig.getTypeName(vm.index, vm.pagecount);
            }

            //Load field
            function getFieldName() {

                try {
                    if ($cookieStore.get('logfield') !== undefined && $rootScope.logfield !== undefined) {
                        if ($rootScope.logfield.length !== $cookieStore.get('logfield').length) {
                            log("Field Changed");
                            $cookieStore.remove('logfield');
                        }

                    }
                    vm.fieldsName = $cookieStore.get('logfield');

                    if ($cookieStore.get('logfield') === undefined) {
                        if ($rootScope.logfield !== undefined) {
                            $cookieStore.put('logfield', $rootScope.logfield);
                            vm.fieldsName = $cookieStore.get('logfield');
                        } else {

                            //vm.fieldsName = dataconfig.getFieldName(vm.indicesName[0], $rootScope.logtype);
                            fp = dataconfig.getFieldName(vm.indicesName[0], $rootScope.logtype);
                        }
                    }
                } catch (ex) {
                    log("Fail to Load Field " + ex);
                }


                vm.aggName = "";

                if (fp === undefined) {
                    if (vm.treestatus === true) {
                        drawTreemap();
                    }
                    aggShow();
                } else {
                    fp.then(function (data) {
                        vm.fieldsName = data;
                        if (vm.treestatus === true) {
                            drawTreemap();
                        }
                        aggShow();
                    });
                }

            }
            //#endregion


            //#region Draw chart
            //get dashboard data
            function aggShow(aggName) {

                var main = document.getElementById('div2');
                log(main.childNodes.length);
                var contain = document.getElementById('contain');
                if (contain !== null && main.childNodes.length !== 0) {
                    main.removeChild(contain);

                }

                if (vm.aggName === "" || vm.aggName === "all") {
                    vm.aggfield = vm.fieldsName;
                    vm.token = false;

                    var fieldFilter = ["geoip.timezone", "timestamp.raw", "@timestamp", "referrer", "referrer.raw", "timestamp", "request", "edata", "host", "action", "agent", "geoip.location"];

                    fieldFilter.map(function (f) {

                        var index = vm.aggfield.indexOf(f);
                        vm.aggfield.splice(index, 1);
                    });


                    var flag;

                    var main2 = document.getElementById('div2');
                    var contain2 = document.createElement('div');

                    contain2.setAttribute('id', 'contain');
                    main2.appendChild(contain2);

                    angular.forEach(vm.aggfield, function (name) {
                        dataconfig.createContainer(name);
                    });

                    angular.forEach(vm.aggfield, function (name) {
                        //dataconfig.createContainer(name);

                        if (vm.aggfield.length <= 2) {
                            flag = true;
                        } else {
                            flag = false;
                        }
                        ap.push(aggShows(name, flag));
                    });

                } else {
                    vm.token = true;
                    datasearch.termAggragationwithQuery(vm.indicesName, vm.type, aggName, vm.size, vm.searchText, vm.st, vm.ft)
                        .then(function (resp) {
                            vm.total = resp.hits.total;
                            vm.hitSearch = resp.aggregations.ag.agg.buckets;
                            drawDashboard(resp.aggregations.ag.agg, aggName);
                        }, function (err) {
                            log(err.message);
                            vm.indicesName = $rootScope.index;
                            aggShow(aggName);

                        });
                }

                $q.all(ap).then(function () {
                    vm.isBusy = false;
                });
            }

            //get multi-field dashboard2 data
            function aggShows(aggName, flag) {

                //dataconfig.createContainer(aggName);
                vm.dashboard = "dash";
                vm.range = "range";
                vm.barchart = "bar";
                vm.tablechart = "table";

                return datasearch.termAggragationwithQuery(vm.indicesName, vm.type, aggName, vm.size, vm.searchText, vm.st, vm.ft)
                      .then(function (resp) {
                          vm.dashboard = vm.dashboard + aggName;
                          vm.range = vm.range + aggName;
                          vm.barchart = vm.barchart + aggName;
                          vm.tablechart = vm.tablechart + aggName;
                          vm.total = resp.hits.total;
                          if (!flag) {
                              if (resp.aggregations.ag.agg.buckets.length > 1) {
                                  drawDashboard2(resp.aggregations.ag.agg, aggName);
                              }
                          } else {
                              drawDashboard2(resp.aggregations.ag.agg, aggName);
                          }

                      }, function (err) {
                          // log("aggshows err "+err.message);
                          vm.indicesName = $rootScope.index;
                          aggShows(aggName, flag);
                      });

            }

            //draw multi-field dashboard2
            function drawDashboard2(agg, y) {

                google.setOnLoadCallback(drawDashboard2);
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

                // Establish dependencies, declaring that 'filter' drives 'pieChart',given the chosen slider range.
                dashboard.bind(donutRangeSlider, [pieChart]);

                // Draw the dashboard.
                dashboard.draw(data);
                google.visualization.events.addListener(pieChart, 'select', function () {
                    var row = getSelection(pieChart);
                });

            }

            //draw dashboard
            function drawDashboard(agg, aggName) {

                google.setOnLoadCallback(drawDashboard);

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
                datasearch.getSampledata(vm.indicesName, vm.type, 15, vm.st, vm.ft).then(function (resp) {
                    vm.hit = resp.hits.hits;
                    drawMap(vm.hit);
                }, function (err) {
                    log("sample data error " + err.message);
                });


            }

            //draw map in dashboard
            function drawMap(r) {
                google.setOnLoadCallback(drawMap);
                var geoData = new google.visualization.DataTable();
                geoData.addColumn('number', 'Lat');
                geoData.addColumn('number', 'Lon');
                geoData.addColumn('string', 'Name');

                angular.forEach(r, function (n) {

                    geoData.addRow([n._source.geoip[latitude], n._source.geoip[longitude], n._source.geoip.city_name]);
                });

                var geoView = new google.visualization.DataView(geoData);
                geoView.setColumns([0, 1]);

                var table =
                    new google.visualization.Table(document.getElementById('table'));
                //table.draw(geoData, { showRowNumber: false });

                var map =
                    new google.visualization.Map(document.getElementById('map_div'));
                map.draw(geoView, { showTip: true });

                /* google.visualization.events.addListener(table, 'select',
                     function () {
                         map.setSelection(table.getSelection());
                     });*/

                google.visualization.events.addListener(map, 'select',
                    function () {
                        table.setSelection(map.getSelection());
                    });

            }

            //draw table in dashboard
            function drawTable(data, name, field) {

                google.setOnLoadCallback(drawTable);
                var table = new google.visualization.Table(document.getElementById(name));

                table.draw(data, { showRowNumber: true });

                google.visualization.events.addListener(table, 'select', function () {
                    var row = table.getSelection()[0].row;
                    if (vm.refinedsearch.length > 1)
                    { vm.treestatus = false; }
                    if (field.substring(field.length - 3, field.length) === "raw") {
                        // log(field.substring(0, field.length - 4));
                        field = field.substring(0, field.length - 4);
                    }


                    if (vm.searchText === "*") {
                        vm.searchText = field + " : \"" + data.getValue(row, 0) + "\"";
                        pushrefinedata();
                    }
                    else {
                        vm.searchText += " AND " + field + " : \"" + data.getValue(row, 0) + "\"";
                        pushrefinedata();
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


