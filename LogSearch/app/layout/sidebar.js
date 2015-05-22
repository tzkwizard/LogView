(function () {
    'use strict';

    var controllerId = 'sidebar';
    angular.module('app').controller(controllerId,
        ['config', 'routes', 'dataconfig', 'datasearch', 'common', '$mdBottomSheet', sidebar]);

    function sidebar(config, routes, dataconfig, datasearch, common, $mdBottomSheet) {
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        //#region variable       
        vm.searchText = '';
        vm.size = 6;
        vm.st = "";
        vm.ft = "";
        vm.facet = common.$rootScope.facet;
        //#endregion


        //#region public function
        vm.isCurrent = isCurrent;
        vm.sidebarNav = sidebarNav;
        vm.showFacet = showFacet;
        //#endregion


        //#region Sidebar Load
        activate();
        function activate() {
            //getFieldName();
            common.activateController([getNavRoutes()], controllerId)
                .then(function () {
                    if (common.$rootScope.ft !== undefined && common.$rootScope.st !== undefined) {
                        vm.ft = common.$rootScope.ft;
                        vm.st = common.$rootScope.st;
                    } else {
                        vm.st = moment(new Date()).subtract(2, 'month');
                        vm.ft = new Date();
                    }
                });
        }

        //get nav
        function getNavRoutes() {
            vm.navRoutes = routes.filter(function (r) {
                return r.config.settings && r.config.settings.nav;
            }).sort(function (r1, r2) {
                return r1.config.settings.nav - r2.config.settings.nav;
            });
        }

        function isCurrent(route) {
            if (!route.config.title || !common.$route.current || !common.$route.current.title) {
                return '';
            }
            var menuName = route.config.title;
            return common.$route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }

        //#endregion


        //#region Siderbar Facet
        //get and show location facet
        function showFacet(facet) {
            var x = vm.facet.indexOf(facet);
            if (vm.facet[x].data === "" || vm.facet[x].data === undefined || common.$location.search.refresh) {
                datasearch.termAggragation(common.$rootScope.index, common.$rootScope.logtype, vm.facet[x].field, vm.size, vm.st, vm.ft).then(function (resp) {
                    vm.facet[x].data = resp.data.AggData;
                    common.$location.search.refresh = false;
                }, function (err) {
                    log(err.data.Message);
                });
            } else {
                vm.facet[x].collapse = !vm.facet[x].collapse;
            }
        }


        //nav to els page
        function sidebarNav(text, f) {
            //$location.search();
            common.$location.search.field = f;
            common.$location.search('field', f);
            common.$location.search('text', text.Key.toString());
            common.$location.search.text = "\"" + text.Key.toString() + "\"";
            common.$location.path('/els/');
            //$location.path('/els/' + r.key.toString());
        }
        //#endregion

        //#region Settings
        vm.showSettingBottomSheet = showSettingBottomSheet;
        vm.alert = '';
        function showSettingBottomSheet($event) {
            vm.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'app/layout/settingbottomsheet/settingBottomSheet.html',
                controller: 'settingBottomSheet',
                targetEvent: $event
            }).then(function (clickedItem) {
                vm.alert = clickedItem.name + ' clicked!';
            });
        };
        //#endregion

    };
})();


