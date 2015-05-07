﻿(function () {
    'use strict';

    var controllerId = 'topnav';
    angular.module('app').controller(controllerId,
        ['$cookieStore', '$rootScope', '$route', '$scope', 'dataconfig', 'config', 'common', '$timeout', '$mdSidenav', '$mdUtil', '$mdBottomSheet', topnav]);

    function topnav($cookieStore, $rootScope, $route, $scope, dataconfig, config, common, $timeout, $mdSidenav, $mdUtil, $mdBottomSheet) {
        var vm = this;
        // var keyCodes = config.keyCodes;

        //#region variable   
        vm.searchText = '';
        vm.ip = [];
        vm.loading = true;
        vm.tabs = ["Dashboard", "ELS", "Agg", "TODO"];
        vm.selectedIndex = "";
        vm.autocompleLoading = false;
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
        vm.it = ["Last three months", "Last Month", "Last four weeks", "Last three weeks", "Last two weeks", "Last week",
            "Last five days", "Last three days", "Last day"];
        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };



        vm.filterst = filterst;
        //change time span global
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

            /*$rootScope.reload = true;
            $route.reload();*/
            common.$location.path(common.$location.path() + "/");
            // window.location.reload();

        }
        $scope.toggleRight = timeNav('right');
        
        function timeNav(navID) {          
            var debounceFn = $mdUtil.debounce(function () {
                $mdSidenav(navID)
                  .toggle()
                  .then(function () {
                      //document.getElementById("nav").style.height = "10%";
                      document.getElementById("nav").style.overflow = "visible";
                      document.getElementById("sidenav").style.height= vm.it.length*50+"%";
                      toastr.info("toggle " + navID + " is done");
                  });
            }, 300);
            return debounceFn;
        }

        //#endregion


        //#region Auto-Fill
        //get auto-fill data
        function autoFill() {
            vm.autocompleLoading = true;
            dataconfig.autoFill().then(function (resp) {
                vm.ip = resp.data.AutoData;
                vm.autocompleLoading = false;
            });


        }
    
        //#endregion


        //#region View
        //navi to other page
        function path() {
            switch (vm.selectedIndex) {
                case 0: common.$location.path("/dashboard"); break;
                case 1: common.$location.path("/els"); break;
                case 2: common.$location.path("/aggs"); break;
                case 3: common.$location.path("/todo"); break;
                default: common.$location.path("/"); break;
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

            dataconfig.autoFill(vm.searchText).then(function (resp) {
                vm.ip = resp.data.AutoData;
                toastr.info("Auto Fill Load");
            });
        }

        //search 
        function search($event) {
            if ($event.keyCode === config.keyCodes.esc) {
                vm.searchText = '';
                return;
            }

            if ($event.type === 'click' || $event.keyCode === config.keyCodes.enter) {
                var route = '/els/';
                common.$location.search.text = vm.searchText;
                common.$location.path('/els/');
                // $location.path(route + vm.searchText);
            }
        }

        //refresh page
        function refresh($event) {
            if ($event.keyCode === config.keyCodes.esc) {
                vm.searchText = '';
                return;
            }
            common.$location.search.refresh = true;
            window.location.reload();
            toastr.info("Refresh" + common.$location.path());
        }

        //log out
        function logout() {

            $cookieStore.remove("useranme");
            $cookieStore.remove("password");
            $cookieStore.remove("key");
            common.$location.path("/");
            window.location.reload();
        }
        //#endregion

    };
})();

(function () {
    'use strict';

    var controllerId = 'RightCtrl';

    angular.module('app')
        .controller(controllerId, function ($rootScope,$scope, $timeout, $mdSidenav, common) {
            $scope.time = ["Last three months", "Last Month", "Last four weeks", "Last three weeks", "Last two weeks", "Last week",
                "Last five days", "Last three days", "Last day"];

            $scope.nav=function(x) {
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
                        break;
                }
                $mdSidenav('right').close();
                common.$location.path(common.$location.path() + "/");
            }
            $scope.$on("$destroy", function () {
                document.getElementById("nav").style.height = "10%";
            });
            $scope.close = function () {
                $mdSidenav('right').close()
                  .then(function () {                     
                      toastr.info("close RIGHT is done");
                  });
            };
        });
})();
