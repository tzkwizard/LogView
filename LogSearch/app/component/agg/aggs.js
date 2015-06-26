(function () {
    'use strict';

    var controllerId = 'aggs';

    angular.module('app')
        .controller(controllerId, function (common, aggService, commonService) {
            var vm = this;
            var getLogFn = common.logger.getLogFn;
            var log = getLogFn(controllerId);

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
            vm.token = true; //show table
            vm.process = true; //spinner when running
            var flag = 0;
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
            var aggfield = [];
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
                if (vm.refinedsearch.length === 2) {
                    aggService.drawTreeMap(vm.fieldsName, vm.treesize, vm.st, vm.ft).then(function () {
                        vm.process = false;
                        common.$rootScope.spinner = false;
                    });
                }
                aggfield = commonService.aggFieldFilter(vm.fieldsName);
                aggShow();
            }

            function getMap() {
                var promise = commonService.loadMap();
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

            
            //#region Draw chart
            //get dashboard data
            function aggShow() {
                vm.process = true;
                aggService.removePieContainer();
                if (vm.aggName === "" || vm.aggName === "all") {
                    vm.token = false;
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
                run(ap);
            }
            function run(ap) {
                common.$q.all(ap).then(function () {
                    if (flag === 0) {
                        var confirm = common.$mdDialog.confirm()
                            .title('Would you like to Search Page?')
                            .ariaLabel('Lucky day')
                            .ok('Just do it!')
                            .cancel('Stay on here');
                        // .targetEvent(ev);
                        common.$mdDialog.show(confirm).then(function () {
                            go();
                        }, function () {
                            log("No chart!");
                        });
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

        });
})();

