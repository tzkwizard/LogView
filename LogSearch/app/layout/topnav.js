(function () {
    'use strict';

    var controllerId = 'topnav';
    angular.module('app').controller(controllerId,
        ['$q', '$cookieStore', '$timeout', '$rootScope', '$http', '$window', '$route', '$scope', '$location', 'dataconfig', 'datasearch', 'config','client', topnav]);

    function topnav($q, $cookieStore, $timeout, $rootScope, $http, $window, $route, $scope, $location, dataconfig, datasearch, config,client) {
        var vm = this;
        // var keyCodes = config.keyCodes;

        //#region variable   
        vm.searchText = '';
        vm.ip = [];
        vm.loading = true;        
        //#endregion


        //#region function
        vm.path = path;
        vm.search = search;
        vm.refresh = refresh;
        vm.logout = logout;
        vm.autoFill = autoFill;
       // vm.suggest = suggest;
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
            $rootScope.ft = new Date();

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

            $rootScope.reload = true;
            $route.reload();
            // window.location.reload();

        }
        //#endregion


        //#region Auto-Fill
 
        function autoFill() {         
             dataconfig.autoFill().then(function (word) {
                if (vm.ip.length !== word.length) {

                    vm.ip = word;
                    toastr.info("Auto Fill Update !");
                }
            });

           
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

        vm.st = "";
        vm.ft = "";
        activate();
        function activate() {
            if ($rootScope.ft !== undefined && $rootScope.st !== undefined) {
                vm.ft = $rootScope.ft;
                vm.st = $rootScope.st;
            } else {
                vm.st = moment(new Date()).subtract(2, 'month');
                vm.ft = new Date();
            }

            dataconfig.autoFill().then(function(word) {
                vm.ip = word;
                toastr.info("Auto Fill Load");
            });
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
            window.location.reload();
            toastr.info("Refresh" + $location.path());
        }

        function logout() {

            $cookieStore.remove("useranme");
            $cookieStore.remove("password");
            $cookieStore.remove("key");
            $location.path("/");
            window.location.reload();
        }
        //#endregion

    };
})();

