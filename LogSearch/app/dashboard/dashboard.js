(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['common', 'chartservice', dashboard]);

    function dashboard(common, chartservice) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var vm = this;

        //#region variable
        vm.st = "";
        vm.ft = "";
        vm.title = 'Dashboard';
        vm.indicesName = [];
        vm.type = "";
        vm.geomap2selection = "USA";
        vm.geoCount = 50;
        vm.mapCount = 15;
        //#endregion

        //#region public function
        vm.changeMap = changeMap;
        vm.changeMap2 = changeMap2;
        //#endregion


        //#region View Load
        activate();
        function activate() {
            common.activateController([getMap()], controllerId)
                .then(function () {
                    init();
                    log('Activated Dashboard View');
                });
        }

        function init() {
            vm.type = common.$rootScope.logtype;
            vm.ft = common.$rootScope.ft;
            vm.st = common.$rootScope.st;

            // worldGeoMap();
            common.$q.all(usGeoMap(), geoMap(), pieChart(), timeLineGram()).then(function () {
                common.$rootScope.spinner = false;
            });
        }

        function getMap() {
            var promise = chartservice.config.loadMap();
            try {
                return promise.then(function () {
                    vm.indicesName = common.$rootScope.index;
                });
            } catch (e) {
                vm.indicesName = promise.indicesName;
                return null;
            }
        }
        //#endregion


        //#region Draw Map1
        function worldGeoMap() {
            chartservice.data.termAggragation(vm.indicesName, vm.type, "geoip.country_name.raw", vm.geoCount, vm.st, vm.ft).
                then(function (resp) {
                    if (resp.data.Total !== 0) {
                        //drawMap2(resp.data.AggData);
                        chartservice.drawWorldMap(resp.data.AggData, 'gmap_div');
                    }
                }, function (e) {
                    log("geoMap2 data error" + e.data.Message);
                });
        }

        function usGeoMap() {
            return chartservice.data.termQueryAggragation(vm.indicesName, vm.type, "geoip.country_code3.raw", "USA", "geoip.real_region_name.raw", vm.geoCount, vm.st, vm.ft).
                   then(function (resp) {
                       if (resp.data.Total !== 0) {
                           //drawUSmap(resp.data.AggData);
                           chartservice.drawUSmap(resp.data.AggData, 'gmap_div');
                       }
                   }, function (e) {
                       log("geoMap2 data error" + e.data.Message);
                   });
        }

        function usCityMap() {
            chartservice.data.termQueryAggragation(vm.indicesName, vm.type, "geoip.country_code3.raw", "USA", "geoip.city_name.raw", vm.geoCount, vm.st, vm.ft).
                    then(function (resp) {
                        if (resp.data.Total !== 0) {
                            //drawoCitymap(resp.data.AggData);
                            chartservice.drawoUSCitymap(resp.data.AggData, 'gmap_div');
                        }
                    }, function (e) {
                        log("geoMap2 data error" + e.data.Message);
                    });
        }
        //#endregion


        //#region Draw Map2
        function geoMap() {
            return chartservice.data.termAggragation(vm.indicesName, vm.type, "geoip.city_name.raw", vm.mapCount, vm.st, vm.ft).
                then(function (resp) {
                    if (resp.data.Total !== 0) {
                        //drawMap(resp.data.AggData);
                        chartservice.drawCityMap(resp.data.AggData, 'dtable_div', 'dmap_div');
                    }
                }, function (e) {
                    log("geoMap data error " + e.data.Message);
                });
        }
        //#endregion


        //#region map selector
        function changeMap() {
            if (vm.geomap2selection === "World") {
                worldGeoMap();
            }
            if (vm.geomap2selection === "USA") {
                usGeoMap();
            }
            if (vm.geomap2selection === "City") {
                usCityMap();
            }
        }

        function changeMap2() {
            geoMap();
        }
        //#endregion


        //#region Draw Pie 
        function pieChart() {
            return chartservice.data.dashboardPieAggregation("verb.raw", "geoip.city_name.raw", "action.raw", vm.st, vm.ft)
           .then(function (resp) {
               //drawpie(resp.data);
               chartservice.drawDashPie(resp.data, 'pie_div');
           }, function (e) {
               log("pieChart data error " + e.data.Message);
           });
        }

        //#endregion


        //#region Time Chart
        function timeLineGram() {
            return chartservice.data.dateHistogramAggregation(vm.indicesName, vm.type, "@timestamp", "day", vm.st, vm.ft)
                .then(function (resp) {
                    if (resp.data.Total !== 0) {
                        //drawTimwLine(resp.data.DateHistData);
                        //drawHist(resp.data.DateHistData);                    
                        chartservice.drawHist(resp.data.DateHistData, 'DateHist_div');
                        chartservice.drawTimeLine(resp.data.DateHistData, 'TimeLine_div');
                    }
                }, function (e) {
                    log("timelineGram data error " + e.data.Message);
                });
        }
        //#endregion

    }
})();

