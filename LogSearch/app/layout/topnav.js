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
        vm.tabs = ["Dashboard", "ELS", "Aggs", "TODO"];
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
            common.$location.path("/" + vm.tabs[vm.selectedIndex].toLowerCase());
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
            }
        }

        //refresh page
        function refresh($event) {
            common.$location.search.refresh = true;
            toastr.info("Refresh" + common.$location.path());
            window.location.reload();            
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

