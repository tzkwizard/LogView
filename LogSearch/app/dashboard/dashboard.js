(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['$scope', '$cookieStore', '$rootScope', 'common', 'dataconfig', 'datasearch', 'chartservice', dashboard]);

    function dashboard($scope, $cookieStore, $rootScope, common, dataconfig, datasearch, chartservice) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var vm = this;
        $scope.gcollapse = false;
        $scope.gcollapse2 = false;

        //#region variable
        vm.st = "";
        vm.ft = "";
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
        vm.title = 'Dashboard';
        vm.indicesName = [];
        vm.type = "";
        vm.geomap2selection = "USA";
        vm.geoCount = 50;
        vm.mapCount = 15;
        //#endregion

        //#region function
        vm.getIndexName = getIndexName;
        vm.geoMap = geoMap;
        vm.init = init;
        vm.timeLineGram = timeLineGram;
        vm.worldGeoMap = worldGeoMap;
        vm.usGeoMap = usGeoMap;
        vm.changeMap = changeMap;
        vm.usCityMap = usCityMap;
        vm.changeMap2 = changeMap2;
        //#endregion


        //#region test
        vm.test = test;
        function test() {

        }
        //#endregion


        //#region View Load
        activate();
        function activate() {
            common.activateController([getIndexName()], controllerId)
                .then(function () {
                    init();
                    log('Activated Dashboard View');

                });
        }

        function init() {
            vm.type = $rootScope.logtype;
            vm.ft = $rootScope.ft;
            vm.st = $rootScope.st;

            // worldGeoMap();
            common.$q.all(usGeoMap(), geoMap(), pieChart(), timeLineGram()).then(function () {
                vm.isBusy = false;
            });
        }

        function getIndexName() {
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
        //#endregion


        //#region Draw Map1
        function worldGeoMap() {
            datasearch.termAggragation(vm.indicesName, vm.type, "geoip.country_name.raw", vm.geoCount, vm.st, vm.ft).
                then(function (resp) {
                    if (resp.data.Total !== 0) {
                        //drawMap2(resp.data.AggData);
                        chartservice.drawWorldMap(resp.data.AggData, 'gmap_div');
                    }
                }, function (err) {
                    //log("geoMap2 data error" + err.message);
                });
        }

        function usGeoMap() {
            return datasearch.termQueryAggragation(vm.indicesName, vm.type, "geoip.country_code3.raw", "USA", "geoip.real_region_name.raw", vm.geoCount, vm.st, vm.ft).
                   then(function (resp) {
                       if (resp.data.Total !== 0) {
                           //drawUSmap(resp.data.AggData);
                           chartservice.drawUSmap(resp.data.AggData, 'gmap_div');
                       }
                   }, function (err) {
                       //log("geoMap2 data error" + err.message);
                   });
        }

        function usCityMap() {
            datasearch.termQueryAggragation(vm.indicesName, vm.type, "geoip.country_code3.raw", "USA", "geoip.city_name.raw", vm.geoCount, vm.st, vm.ft).
                    then(function (resp) {
                        if (resp.data.Total !== 0) {
                            //drawoCitymap(resp.data.AggData);
                            chartservice.drawoUSCitymap(resp.data.AggData, 'gmap_div');
                        }
                    }, function (err) {
                        //log("geoMap2 data error" + err.message);
                    });
        }
        //#endregion


        //#region Draw Map2
        function geoMap() {
            return datasearch.termAggragation(vm.indicesName, vm.type, "geoip.city_name.raw", vm.mapCount, vm.st, vm.ft).
                then(function (resp) {
                    if (resp.data.Total !== 0) {
                        //drawMap(resp.data.AggData);
                        chartservice.drawCityMap(resp.data.AggData, 'dtable_div', 'dmap_div');
                    }
                }, function (err) {
                    //log("geoMap data error " + err.message);
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
            pieChart();
        }

        function changeMap2() {
            geoMap();
            pieChart();
        }
        //#endregion


        //#region Draw Pie 
        function pieChart() {
            return datasearch.dashboardPieAggregation("verb", "geoip.city_name.raw", "request.raw", vm.st, vm.ft)
           .then(function (resp) {
               //drawpie(resp.data);
               chartservice.drawDashPie(resp.data, 'pie_div1', 'pie_div2', 'pie_div3');
           }, function (err) {
               //log("pieChart data error " + err.message);
           });
        }

        //#endregion


        //#region Time Chart
        function timeLineGram() {
            return datasearch.dateHistogramAggregation(vm.indicesName, vm.type, "@timestamp", "day", vm.st, vm.ft)
                .then(function (resp) {
                    if (resp.data.Total !== 0) {
                        //drawTimwLine(resp.data.DateHistData);
                        //drawHist(resp.data.DateHistData);                    
                        chartservice.drawHist(resp.data.DateHistData, 'DateHist_div');
                        chartservice.drawTimeLine(resp.data.DateHistData, 'TimeLine_div');
                    }
                }, function (err) {
                    //log("timelineGram data error " + err.message);
                });
        }
        //#endregion

    }
})();

