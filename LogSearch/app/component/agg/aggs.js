(function () {
    'use strict';

    var controllerId = 'aggs';

    angular.module('app')
        .controller(controllerId, function ($cookieStore, $rootScope, $scope,
            common, datasearch, dataconfig, chartservice) {

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
            vm.getFieldName = getFieldName;
            vm.getIndexName = getIndexName;
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
                            var tt = resp.data.AggData;
                            tt.map(function (y) {
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
                    datatree.addRow([m, "Elasticsearch", 0, 0]);
                    tpromise.push(treeMap(m, datatree));
                });
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
                vm.treestatus = true;
                var ip = dataconfig.loadIndex();
                try {
                    return ip.then(function (data) {
                        vm.indicesName = data;
                    });
                } catch (e) {
                    vm.indicesName = ip;
                    return null;
                }
            }

            //Load field
            function getFieldName() {
                vm.aggName = "";
                var fp = dataconfig.loadField();
                try {
                    return fp.then(function (data) {
                        vm.fieldsName = data;
                    });
                } catch (e) {
                    vm.fieldsName = fp;
                    return null;
                }
            }
            //#endregion


            //#region PieLayout
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
                            vm.total = resp.data.Total;
                            vm.hitSearch = resp.data.AggData;
                            //drawDashboard(resp.data.AggData, aggName);
                            var data = chartservice.drawaggDashboard1(resp.data.AggData, aggName, 'dashboard', 'filter_div', 'chart_div');
                            drawTable(data, 'table_div', aggName);
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
                          vm.total = resp.data.Total;
                          var data;
                          if (!flag) {
                              if (resp.data.AggData.length > 1) {
                                  //drawDashboard2(resp.data.AggData, aggName);
                                  data = chartservice.drawaggDashboard2(resp.data.AggData, aggName);
                                  drawTable(data, "table" + aggName, aggName);
                              }
                          } else {
                              //drawDashboard2(resp.data.AggData, aggName);
                              data = chartservice.drawaggDashboard2(resp.data.AggData, aggName);
                              drawTable(data, "table" + aggName, aggName);
                          }
                      }, function (err) {
                          // log("aggshows err "+err.message);
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


