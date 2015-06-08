(function () {
    'use strict';

    var controllerId = 'aggs';

    angular.module('app')
        .controller(controllerId, function (common, aggService, dataconfig) {
            var vm = this;
            vm.title = "Aggragations";
            vm.title2 = "PieChart";
            var getLogFn = common.logger.getLogFn;
            var log = getLogFn(controllerId);


            //#region test
            vm.strength = "";
            vm.password = '123';
            vm.grade = function () {
                var size = vm.password.length;
                if (size > 8) {
                    vm.strength = 'strong';
                } else if (size > 3) {
                    vm.strength = 'medium';
                } else {
                    vm.strength = 'weak';
                }
            };
            //#endregion

            //#region variable
            vm.treesize = 100;
            vm.size = 20;
            vm.searchText = "*";
            vm.refinedsearch = [];
            vm.hitSearch = "";
            vm.total = 0;
            vm.aggName = "";
            vm.pagecount = 10;
            vm.fieldsName = [];
            vm.indicesName = [];
            vm.type = '';
            vm.ft = "";  //end time
            vm.st = ""; //start time
            vm.token = false; //show table
            vm.process = true; //spinner when running
            vm.treestatus = true; // show tree chart
            //#endregion

            //#region public function
            vm.refresh = refresh;
            vm.go = go;
            vm.clear = clear;
            vm.treesizeChange = treesizeChange;
            vm.show = show;
            //#endregion


            //#region View Load
            var ap = [];
            activate();
            function activate() {
                common.activateController([getMap()], controllerId)
                      .then(function () {
                          init();
                          log('Activated Aggs search View');
                      });
            }

            function init() {
                vm.ft = common.$rootScope.ft;
                vm.st = common.$rootScope.st;
                vm.type = common.$rootScope.logtype;
                vm.refinedsearch = [
                    { key: 'Time', value: new Date() },
                    { key: 'School', value: common.$rootScope.school }
                ];
                if (vm.treestatus === true) {
                    aggService.drawTreeMap(vm.fieldsName, vm.treesize, vm.st, vm.ft).then(function () {
                        vm.process = false;
                        common.$rootScope.spinner = false;
                    });
                }
                aggShow();
            }

            function getMap() {
                var promise = dataconfig.loadMap();
                try {
                    return promise.then(function () {
                        vm.indicesName = common.$rootScope.index;
                        vm.fieldsName = common.$rootScope.logfield;
                    });
                } catch (e) {
                    vm.indicesName = promise.indicesName;
                    vm.fieldsName = promise.fieldsName;
                    return null;
                }
            }
            //#endregion


            //#region button and function
            //refresh page
            function refresh() {
                vm.treestatus = true;
                common.$rootScope.spinner = true;
                vm.searchText = "*";
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
                       { key: 'School', value: common.$rootScope.school }
                ];
                aggShow();
            }

            function treesizeChange() {
                aggService.drawTreeMap(vm.fieldsName, vm.treesize, vm.st, vm.ft);
            }

            function show() {
                aggShow();
            }
            //#endregion

            var flag = 0;
            //#region Draw chart
            //get dashboard data
            function aggShow() {
                vm.process = true;
                aggService.removePieContainer();
                if (vm.aggName === "" || vm.aggName === "all") {
                    vm.token = false;
                    var aggfield = dataconfig.aggFieldFilter(vm.fieldsName);
                    aggService.addPieContainer(aggfield);
                    flag = 0;
                    angular.forEach(aggfield, function (name) {
                        ap.push(aggShows(name));
                    });
                } else {
                    vm.token = true;
                    aggService.data.termAggragationwithQuery(vm.indicesName, vm.type, vm.aggName, vm.size, vm.searchText, vm.st, vm.ft)
                        .then(function (resp) {
                            vm.total = resp.data.Total;
                            vm.hitSearch = resp.data.AggData;
                            var data = aggService.drawaggDashboard1(resp.data.AggData, vm.aggName, 'dashboard', 'filter_div', 'chart_div');
                            drawTable(data, 'table_div', vm.aggName);
                        }, function (e) {
                            log(e.data.Message);
                        });
                }
                common.$q.all(ap).then(function () {
                    if (flag === 0) {
                        log("No chart!");
                    }
                    vm.process = false;
                });
            }

            //get multi-field dashboard2 data
            function aggShows(aggName) {
                return aggService.data.termAggragationwithQuery(vm.indicesName, vm.type, aggName, vm.size, vm.searchText, vm.st, vm.ft)
                      .then(function (resp) {
                          vm.total = resp.data.Total;
                          var data;
                          if (resp.data.AggData.length > 1) {
                              data = aggService.drawaggDashboard2(resp.data.AggData, aggName);
                              drawTable(data, "table" + aggName, aggName);
                              flag++;
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
                    vm.treestatus = false;
                    if (field.substring(field.length - 3, field.length) === "raw") {
                        field = field.substring(0, field.length - 4);
                    }
                    if (vm.searchText === "*") {
                        vm.searchText = field + " : \"" + data.getValue(row, 0) + "\"";
                        vm.refinedsearch.push({ key: field, value: data.getValue(row, 0) });
                    }
                    else {
                        vm.searchText += " AND " + field + " : \"" + data.getValue(row, 0) + "\"";
                        vm.refinedsearch.push({ key: field, value: data.getValue(row, 0) });
                    }
                    aggShow();
                });
            }
            //#endregion

        });
})();

