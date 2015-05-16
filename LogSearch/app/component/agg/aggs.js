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

            vm.treesize = 100;
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
            vm.token = false;
            vm.process = true;
            vm.treestatus = true;
            //#endregion


            //#region function
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
            vm.init = init;
            vm.treesizeChange = treesizeChange;
            vm.show = show;
            //#endregion


            //#region Test
            vm.tes = "ab";
            vm.test = function test() {
                /* var route = '/';
                 $location.path(route + temp);
                 $location.search('logs', "logs");*/
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
                vm.ft = $rootScope.ft;
                vm.st = $rootScope.st;
                vm.type = $rootScope.logtype;
                vm.refinedsearch = [
                    { key: 'Time', value: new Date() },
                    { key: 'School', value: $rootScope.school }
                ];
                if (vm.treestatus === true) {
                    //drawTreemap();
                    chartservice.drawTreeMap(vm.fieldsName, vm.treesize, vm.st, vm.ft).then(function () {
                        vm.isBusy = false;
                        vm.process = false;
                    });
                }
                aggShow();
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


            //#region button and function
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

            function treesizeChange() {
                chartservice.drawTreeMap(vm.fieldsName, vm.treesize, vm.st, vm.ft);
            }

            function show() {
                aggShow(vm.aggName);
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
                var fieldFilter = ["geoip.timezone", "timestamp.raw", "@timestamp", "referrer", "referrer.raw", "timestamp", "request", "edata",
                    "host", "action", "agent", "tags", "message", "geoip.country_name", "geoip.coordinates", "geoip.latitude", "geoip.longitude"];
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
                    var aggfield = vm.fieldsName;
                    vm.token = false;
                    aggfield = aggFieldFilter(aggfield);
                    addPieContainer(aggfield);
                    var flag = aggfield.length <= 2 ? true : false;

                    angular.forEach(aggfield, function (name) {
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
                        }, function (e) {
                            log(e.data.Message);
                        });
                }
                common.$q.all(ap).then(function () {
                    vm.process = false;
                    //vm.isBusy = false;
                });
            }

            //get multi-field dashboard2 data
            function aggShows(aggName, flag) {
                return datasearch.termAggragationwithQuery(vm.indicesName, vm.type, aggName, vm.size, vm.searchText, vm.st, vm.ft)
                      .then(function (resp) {
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
                      }, function (e) {
                          log("aggshows err " + e.data.Message);
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

