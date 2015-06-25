(function () {
    'use strict';

    var controllerId = 'sidebar';
    angular.module('app.layout').controller(controllerId,
        ['config', 'routes', 'commonService', 'datasearch', 'common', sidebar]);

    function sidebar(config, routes, commonService, datasearch, common) {
        var vm = this;

        //#region variable       
        vm.searchText = '';
        vm.size = 6;
        vm.facet = common.$rootScope.facet;
        var promise = [];
        //#endregion


        //#region public function
        vm.isCurrent = isCurrent;
        vm.sidebarNav = sidebarNav;
        vm.showFacet = showFacet;
        vm.showSettingBottomSheet = showSettingBottomSheet;
        //#endregion


        //#region Sidebar Load
        activate();
        function activate() {
            //getFieldName();
            common.activateController([getNavRoutes(), loadFacet()], controllerId)
                .then(function () {
                });
        }

        function loadFacet() {
            angular.forEach(vm.facet, function (f) {
                var p = datasearch.termAggragation(common.$rootScope.index, common.$rootScope.logtype, f.field, vm.size, common.$rootScope.st, common.$rootScope.ft).then(function (resp) {
                    f.data = resp.data.AggData;
                    f.collapse = true;
                    common.$location.search.refresh = false;
                }, function (err) {
                    toastr.info(err.data.Message);
                });
                promise.push(p);
            });
            return promise;
        }

        function getNavRoutes() {
            vm.navRoutes = routes.filter(function (r) {
                return r.config.settings && r.config.settings.nav;
            }).sort(function (r1, r2) {
                return r1.config.settings.nav - r2.config.settings.nav;
            });
        }
        //get nav
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
            vm.facet[x].collapse = !vm.facet[x].collapse;
        }

        //nav to els page
        function sidebarNav(text, f) {
            common.$location.search.field = f;
            common.$location.search.text = "\"" + text.Key.toString() + "\"";
            common.$location.path('/els/');
            //$location.path('/els/' + r.key.toString());
        }
        
        function showSettingBottomSheet($event) {
            vm.alert = '';
            common.$mdBottomSheet.show({
                templateUrl: 'app/component/bottom/setting/facet-Setting-Bottom.html',
                controller: 'facetSettingBottom as facetSettingBottom',
                targetEvent: $event
            }).then(function (clickedItem) {
                vm.alert = clickedItem.name + ' clicked!';
            });
        };
        //#endregion

    };
})();


