(function () {
    'use strict';

    var controllerId = 'topnav';
    angular.module('app.layout').controller(controllerId,
        ['commonService', 'datasearch', 'config', 'common', topnav]);

    function topnav(commonService, datasearch, config, common) {
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
        vm.openNav = openNav;
        //#endregion


        //#region Time
        vm.filterst = filterst;
        //change time span global
        function filterst(span) {
            common.$rootScope.ft = new Date();
            common.$rootScope.st = commonService.changeTimeSpan(span);
            common.$location.path(common.$location.path() + "/");
            // window.location.reload();
        }

        
        function openNav(navID) {
                common.$mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        //document.getElementById("timeSidenav").style.height = vm.it.length * 60 + "%";
                        // document.getElementById("nav").style.overflow = "visible";
                        // toastr.info("toggle " + navID + " is done");
                    });
        }
        //#endregion   

        //#region Auto-Fill

        var autocache = ["", "", "", ""];
        //get auto-fill data
        function autoFill(force) {
            if (force !== true && vm.searchText === "") return null;
            vm.autocompleLoading = true;
            return datasearch.autoFill(vm.searchText).then(function (resp) {
                if (resp.data.AutoData.length < 1000 && vm.autoText.length < 1000) {
                    var autotemp = vm.autoText;
                    autocache = [autocache[1], autocache[2], autocache[3], resp.data.AutoData];
                    angular.forEach(autocache, function (x) {
                        autotemp = commonService.arrayUnique(autotemp.concat(x));
                    });
                    vm.autoText = autotemp;
                } else {
                    vm.autoText = resp.data.AutoData;
                }
                vm.autocompleLoading = false;
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
            vm.ft = common.$rootScope.ft;
            vm.st = common.$rootScope.st;
            autoFill(true);
            vm.autocompleLoading = false;
            toastr.info("Auto Fill Load");
        }

        //search 
        function search($event) {
            if ($event.keyCode === config.keyCodes.esc) {
                vm.searchText = '';
                return;
            }
            if ($event.type === 'click' || $event.keyCode === config.keyCodes.enter) {
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
            commonService.logout();
            common.$location.path("/");
            window.location.reload();
        }
        //#endregion

    };

})();

