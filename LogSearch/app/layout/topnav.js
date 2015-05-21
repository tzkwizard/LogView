(function () {
    'use strict';

    var controllerId = 'topnav';
    angular.module('app').controller(controllerId,
        ['$cookieStore', '$rootScope', '$scope', 'dataconfig', 'datasearch', 'config', 'common', '$timeout', '$mdSidenav', '$mdUtil', topnav]);

    function topnav($cookieStore, $rootScope, $scope, dataconfig, datasearch, config, common, $timeout, $mdSidenav, $mdUtil) {
        var vm = this;
        // var keyCodes = config.keyCodes;

        //#region variable   
        vm.searchText = '';
        vm.autoText = [];
        vm.loading = true;
        vm.tabs = ["Dashboard", "ELS", "Agg", "TODO"];
        vm.selectedIndex = "";
        vm.autocompleLoading = true;
        vm.st = "";
        vm.ft = "";
        //#endregion

        //#region public function
        vm.path = path;
        vm.search = search;
        vm.refresh = refresh;
        vm.logout = logout;
        vm.autoFill = autoFill;
        //#endregion


        //#region Time
        vm.filterst = filterst;
        //change time span global
        function filterst(span) {
            $rootScope.ft = new Date();
            $rootScope.st = dataconfig.changeTimeSpan(span);
            common.$location.path(common.$location.path() + "/");
            // window.location.reload();
        }

        $scope.toggleRight = sideNav('right');
        $scope.toggleLeft = sideNav('left');

        function sideNav(navID) {
            var debounceFn = $mdUtil.debounce(function () {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        //document.getElementById("nav").style.height = "10%"; 
                        //document.getElementById("timeSidenav").style.height = vm.it.length * 60 + "%";
                        // document.getElementById("nav").style.overflow = "visible";
                        // toastr.info("toggle " + navID + " is done");
                    });
            }, 10);
            return debounceFn;
        }
        //#endregion


        //#region Auto-Fill
        var appre = "";
        var apre = "";
        var anow = "";

        //get auto-fill data
        function autoFill(force) {           
            if (force !== true && vm.searchText === "") return null;
            vm.autocompleLoading = true;
            return datasearch.autoFill(vm.searchText).then(function (resp) 
            {
                appre = apre; apre = anow;
                anow = resp.data.AutoData;
                if (vm.autoText.length < 1000 && vm.autoText.length !== 0) {
                    vm.autoText = dataconfig.arrayUnique(anow.concat(dataconfig.arrayUnique(apre.concat(appre))));
                } else {
                    vm.autoText = anow.concat(apre.concat(appre));
                }
                vm.autocompleLoading = false;
                return resp.data.AutoData;
            });
        }

        //#endregion


        //#region View and Button
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

        activate();
        function activate() {
            vm.ft = $rootScope.ft;
            vm.st = $rootScope.st;
            autoFill(true);
            toastr.info("Auto Fill Load");
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
            $rootScope.logged = false;
            $cookieStore.remove("useranme");
            $cookieStore.remove("password");
            $cookieStore.remove("key");
            $cookieStore.remove("SiderBarFacet");
            //common.$location.path("/");
            window.location.reload();
        }
        //#endregion

    };

})();

