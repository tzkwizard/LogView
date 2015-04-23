(function () {
    'use strict';

    var controllerId = 'topnav';
    angular.module('app').controller(controllerId,
        ['$cookieStore', '$timeout', '$rootScope', '$http', '$window', '$route', '$scope', '$location', 'dataconfig', 'datasearch', 'config', topnav]);

    function topnav($cookieStore, $timeout, $rootScope, $http, $window, $route, $scope, $location, dataconfig, datasearch, config) {
        var vm = this;
        // var keyCodes = config.keyCodes;


        //#region variable   
        vm.searchText = '';             
        vm.ip = [];
        vm.init = init;
        vm.loading = true;
        //#endregion


        //#region function
        vm.path = path;
        vm.search = search;
        vm.refresh = refresh;
        vm.logout = logout;
        activate();
        //#endregion


        //#region Time
        vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy.MM.dd'];
        vm.format = vm.formats[4];
        vm.it = ["Last three months", "Last Month", "Last four weeks", "Last three weeks", "Last two weeks", "Last week", "Last five days", "Last three days", "Last day"];
        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };


        vm.filterst = filterst;
        function filterst(x, $event) {

            switch (x) {
                case "Last three months":
                    $rootScope.st = moment(new Date()).subtract(3, 'month');
                    break;
                case "Last Month":
                    $rootScope.st = moment(new Date()).subtract(1, 'month');
                    break;
                case "Last four weeks":
                    $rootScope.st = moment(new Date()).subtract(28, 'days');
                    break;
                case "Last three weeks":
                    $rootScope.st = moment(new Date()).subtract(21, 'days');
                    break;
                case "Last two weeks":
                    $rootScope.st = moment(new Date()).subtract(14, 'days');
                    break;
                case "Last week":
                    $rootScope.st = moment(new Date()).subtract(7, 'days');
                    break;
                case "Last five days":
                    $rootScope.st = moment(new Date()).subtract(5, 'days');
                    break;
                case "Last three days":
                    $rootScope.st = moment(new Date()).subtract(3, 'days');
                    break;
                case "Last day":
                    $rootScope.st = moment(new Date()).subtract(1, 'days');
                    break;

                default:
                    // log(x);
                    break;
            }
            $route.reload();

        }
        //#endregion


        //#region Auto-Fill
        function init() {
            var word = [];
            vm.pfx = ["ident.raw", "auth.raw", "geoip.city_name.raw", "request.raw", "geoip.country_name.raw", "geoip.region_name.raw", "geoip.postal_code.raw"];
            angular.forEach(vm.pfx, function (agg) {

                datasearch.termAggragation($rootScope.index, 'logs', agg, 40, $rootScope.st, $rootScope.ft)
                .then(function (resp) {
                    var tt = resp.aggregations.ag.agg.buckets;

                    angular.forEach(tt, function (y) {
                        word.push(y.key);
                    });
                    // toastr.info(vm.ip);
                }, function (err) {
                    //log(err.message);
                });

            });
            vm.ip = word;
            //$rootScope.ip = word;
        }


        vm.getLocation = getLocation;

        function getLocation(val) {
            return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: val,
                    sensor: false
                }
            }).then(function (response) {
                return response.data.results.map(function (item) {
                    return item.formatted_address;
                });
            });
        };
        //#endregion



        //#region View
        function path(n) {

            switch (n) {
                case 1: $location.path("/dashboard"); break;
                case 2: $location.path("/els"); break;
                case 3: $location.path("/aggs"); break;
                case 4: $location.path("/todo"); break;
                default: $location.path("/"); break;
            }

        }

        function activate() {
            $timeout(init, 500);
        }

        function search($event) {
            if ($event.keyCode === config.keyCodes.esc) {
                vm.searchText = '';

                return;
            }



            if ($event.type === 'click' || $event.keyCode === config.keyCodes.enter) {
                var route = '/els/';
                $location.search.text = vm.searchText;
                $location.path('/els/');
                // $location.path(route + vm.searchText);
            }
        }
        function refresh($event) {
            if ($event.keyCode === config.keyCodes.esc) {
                vm.searchText = '';

                return;
            }
            $location.search.refresh = true;
            //$window.location.reload();
            $route.reload();
            toastr.info("Refresh" + $location.path());
        }

        function logout() {
            $cookieStore.remove("ueranme");
            $cookieStore.remove("password");
            window.location.reload();
        }
        //#endregion

    };
})();

