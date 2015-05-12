(function () {
    'use strict';

    var controllerId = 'aggs';

    angular.module('app')
        .controller(controllerId, function ($cookieStore, $rootScope, $scope,
            common, datasearch, dataconfig) {

            var vm = this;
            vm.title = "Aggragations";
            vm.title2 = "PieChart";
            var getLogFn = common.logger.getLogFn;
            var log = getLogFn(controllerId);


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
            vm.process = true;


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
            vm.aggFieldFilter = aggFieldFilter;
            vm.removePieContainer = removePieContainer;
            vm.addPieContainer = addPieContainer;
            vm.startDrawTree = startDrawTree;
            vm.treeAddData = treeAddData;
            vm.init = init;
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
                vm.isBusy = true;
                common.$location.search.refresh = true;
                activate();
                log("Refreshed");
            }

            //go to els page get result
            function go() {

                common.$location.search.text = vm.searchText;
                common.$location.path('/els/');
            }

            //clear searchtext
            function clear() {
                vm.process = true;
                vm.searchText = "*";
                vm.aggName = "";
                vm.refinedsearch = [
                       { key: 'Time', value: new Date() },
                       { key: 'School', value: 'TCU' }
                ];
                aggShow(vm.aggName);
            }
            //#endregion


            //#region Draw-tree
            vm.fieldstree = [];
            vm.treestatus = true;
            var tpromise = [];
            //get treemap data
            function treeMap(aggName, datatree) {
                return datasearch.termAggragation(vm.indicesName, vm.type, aggName, vm.size, vm.st, vm.ft)
                        .then(function (resp) {
                            //var tt = resp.aggregations.ag.agg.buckets;
                            var tt = resp.data.AggData;
                            tt.map(function (y) {
                                //var x = Math.random() * y.doc_count - 50;
                                //datatree.addRow([y.key + "\n" + aggName, aggName, y.doc_count, x]);
                                var x = Math.random() * y.DocCount - 50;
                                datatree.addRow([y.Key + "\n" + aggName, aggName, y.DocCount, x]);

                            });
                        }, function (err) {
                            //log("Tree data Load " + err.message);
                            terror = true;
                        });

            }


            function treeAddData(datatree) {


                datatree.addRow(["Elasticsearch", null, 0, 0]);

                vm.fieldstree.map(function (m) {

                    var x = Math.random() * 100 - 50;
                    datatree.addRow([m, "Elasticsearch", 0, 0]);

                    tpromise.push(treeMap(m, datatree));

                });
                // return $q.all(promise);
            }


            function startDrawTree(tree, datatree) {
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

                vm.isBusy = false;
                vm.process = false;
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
                field = vm.fieldstree.indexOf("tags.raw");
                vm.fieldstree.splice(field, 1);

                datatree.addColumn('string', 'Name');
                datatree.addColumn('string', 'Parent');
                datatree.addColumn('number', 'count');
                datatree.addColumn('number', 'color');


                tpromise = [];

                treeAddData(datatree);

                var tree = new google.visualization.TreeMap(document.getElementById('treemap_div'));


                common.$q.all(tpromise).then(function () {
                    if (terror === true) {
                        terror = false;
                        log("treedata error");
                    }
                    else {
                        startDrawTree(tree, datatree);
                    }

                }, function (e) {
                    log("TreeMap Promise Error" + e);
                });

            }
            //#endregion


            //#region View Load
            var ip;
            var fp;
            var ap = [];
            activate();
            function activate() {
                common.activateController([getIndexName(), getFieldName()], controllerId)
                      .then(function () {
                          init();
                          log('Activated Aggs search View');
                      });
            }


            function init() {
                if ($rootScope.ft !== undefined && $rootScope.st !== undefined) {
                    vm.ft = $rootScope.ft;
                    vm.st = $rootScope.st;
                } else {
                    vm.st = moment(new Date()).subtract(2, 'month').toDate();
                    vm.ft = new Date();
                }

                vm.type = $rootScope.logtype;
                if (vm.treestatus === true) {
                    drawTreemap();
                }
                aggShow();

                vm.refinedsearch = [
                { key: 'Time', value: new Date() },
                { key: 'School', value: $rootScope.school }
                ];
            }


            //Load index
            function getIndexName() {
                dataconfig.checkIndexCookie();
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

                vm.treestatus = true;


                /* if (ip === undefined) {
                     getFieldName();
                 } else {
                     ip.then(function (data) {
                         vm.indicesName = data;
                         getFieldName();
                     });
                 }*/
                if (ip !== undefined) {
                    return ip.then(function (data) {
                        vm.indicesName = data;
                    });
                }

                return null;
            }

            //Load type
            function getTypeName() {
                vm.typesName = dataconfig.getTypeName(vm.index, vm.pagecount);
            }

            //Load field
            function getFieldName() {

                dataconfig.checkFieldCookie();

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

                vm.aggName = "";

                /*   if (fp === undefined) {
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
                   }*/

                if (fp !== undefined) {
                    return fp.then(function (data) {
                        vm.fieldsName = data;
                    });
                }

                return null;

            }
            //#endregion


            //#region PieLaout
            function removePieContainer() {
                var main = document.getElementById('div2');
                var contain = document.getElementById('contain');
                if (contain !== null && main.childNodes.length !== 0) {
                    main.removeChild(contain);

                }
            }

            function addPieContainer(fields) {
                var main = document.getElementById('div2');
                var contain = document.createElement('div');

                contain.setAttribute('id', 'contain');
                main.appendChild(contain);

                angular.forEach(fields, function (name) {
                    dataconfig.createContainer(name);
                });
            }

            function aggFieldFilter(aggField) {
                var fieldFilter = ["geoip.timezone", "timestamp.raw", "@timestamp", "referrer", "referrer.raw",
                    "timestamp", "request", "edata", "host", "action", "agent", "tags", "message",
                    "geoip.country_name", "geoip.coordinates", "geoip.latitude", "geoip.longitude"];

                fieldFilter.map(function (f) {
                    var index = aggField.indexOf(f);
                    if (index !== -1) {
                        aggField.splice(index, 1);
                    }
                });

                return aggField;
            }
            //#endregion


            //#region Draw chart
            //get dashboard data
            function aggShow(aggName) {

                vm.process = true;
                removePieContainer();

                if (vm.aggName === "" || vm.aggName === "all") {
                    vm.aggfield = vm.fieldsName;
                    vm.token = false;

                    vm.aggfield = aggFieldFilter(vm.aggfield);

                    addPieContainer(vm.aggfield);

                    var flag = vm.aggfield.length <= 2 ? true : false;
                    angular.forEach(vm.aggfield, function (name) {
                        ap.push(aggShows(name, flag));
                    });
                } else {
                    vm.token = true;
                    datasearch.termAggragationwithQuery(vm.indicesName, vm.type, aggName, vm.size, vm.searchText, vm.st, vm.ft)
                        .then(function (resp) {
                            /* vm.total = resp.hits.total;
                             vm.hitSearch = resp.aggregations.ag.agg.buckets;
                             drawDashboard(resp.aggregations.ag.agg, aggName);*/
                            vm.total = resp.data.Total;
                            vm.hitSearch = resp.data.AggData;
                            drawDashboard(resp.data.AggData, aggName);

                        }, function (err) {
                            log(err.message);
                        });
                }

                common.$q.all(ap).then(function () {
                    vm.process = false;
                    //vm.isBusy = false;
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
                          //vm.total = resp.hits.total;
                          vm.total = resp.data.Total;

                          /* if (!flag) {
                               if (resp.aggregations.ag.agg.buckets.length > 1) {
                                   drawDashboard2(resp.aggregations.ag.agg, aggName);
                               }
                           } else {
                               drawDashboard2(resp.aggregations.ag.agg, aggName);
                           }*/

                          if (!flag) {
                              if (resp.data.AggData.length > 1) {
                                  drawDashboard2(resp.data.AggData, aggName);
                              }
                          } else {
                              drawDashboard2(resp.data.AggData, aggName);
                          }


                      }, function (err) {
                          // log("aggshows err "+err.message);
                      });

            }

            //draw multi-field dashboard2
            function drawDashboard2(agg, y) {

                google.setOnLoadCallback(drawDashboard2);
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

                var name = "table" + y;
                drawTable(data, name, y);

                // Establish dependencies
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

                var data = new google.visualization.DataTable();
                data.addColumn('string', 'key');
                data.addColumn('number', 'Number');

                angular.forEach(agg, function (ag) {
                    data.addRow([ag.Key.toString(), ag.DocCount]);
                    // data.addRow([agg.key.toString(), agg.doc_count]);
                });

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


                drawTable(data, 'table_div', aggName);

                // Establish dependencies
                dashboard.bind(donutRangeSlider, [pieChart]);

                // Draw the dashboard.
                dashboard.draw(data);

                datasearch.getSampledata(vm.indicesName, vm.type, 15, vm.st, vm.ft).then(function (resp) {
                    //vm.hit = resp.hits.hits;
                    // drawMap(vm.hit);
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
                    if (vm.refinedsearch.length > 1) {
                        vm.treestatus = false;

                    }
                    if (field.substring(field.length - 3, field.length) === "raw") {
                        field = field.substring(0, field.length - 4);
                    }

                    function pushrefinedata() {
                        vm.refinedsearch.push({ key: field, value: data.getValue(row, 0) });
                    }

                    if (vm.searchText === "*") {
                        vm.searchText = field + " : \"" + data.getValue(row, 0) + "\"";
                        pushrefinedata();
                    }
                    else {
                        vm.searchText += " AND " + field + " : \"" + data.getValue(row, 0) + "\"";
                        pushrefinedata();
                    }
                    aggShow("");
                });

            }
            //#endregion


        });
})();


