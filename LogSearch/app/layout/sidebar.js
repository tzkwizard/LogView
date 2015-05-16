(function () {
    'use strict';

    var controllerId = 'sidebar';
    angular.module('app').controller(controllerId,
        ['$rootScope', 'config', 'routes', 'dataconfig', 'datasearch', 'client', 'common', sidebar]);

    function sidebar($rootScope, config, routes, dataconfig, datasearch, client, common) {
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        //#region variable       
        vm.searchText = '';
        var keyCodes = config.keyCodes;
        vm.isCollapsed = false;
        vm.isCollapsed2 = false;
        vm.isCollapsed3 = false;
        vm.isCollapsed4 = false;
        vm.isCollapsed5 = false;
        vm.fieldsName = [];
        vm.size = 10;
        vm.location = "";
        vm.httpmethod = "";
        vm.apiaddress = "";
        vm.user = "";
        vm.useraction = "";
        vm.st = "";
        vm.ft = "";

        vm.content = [];
        vm.content[0] = 4;
        vm.content[1] = 5;
        vm.agg = ["Ace"];
        //#endregion


        //#region function
        vm.isCurrent = isCurrent;
        vm.sidebarNav = sidebarNav;
        //#endregion


        //#region Sidebar Load
        activate();
        function activate() {
            //getFieldName();
            common.activateController([getNavRoutes()], controllerId)
                .then(function () {
                    if ($rootScope.ft !== undefined && $rootScope.st !== undefined) {
                        vm.ft = $rootScope.ft;
                        vm.st = $rootScope.st;
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
        vm.showLocation = function () {
            if (vm.location === "" || vm.location === undefined || common.$location.search.refresh) {
                datasearch.termAggragation($rootScope.index, $rootScope.logtype, "geoip.city_name.raw", vm.size, vm.st, vm.ft).then(function (resp) {
                    //vm.location = resp.aggregations.ag.agg.buckets;
                    vm.location = resp.data.AggData;
                    common.$location.search.refresh = false;
                    // log("re");
                }, function (err) {
                    log(err.data.Message);
                });
            } else {
                vm.isCollapsed = !vm.isCollapsed;
            }
        }

        //get and show api facet
        vm.showRequestAPI = function () {
            if (vm.apiaddress === "" || vm.apiaddress === undefined || common.$location.search.refresh) {
                datasearch.termAggragation($rootScope.index, $rootScope.logtype, "request.raw", vm.size, vm.st, vm.ft).then(function (resp) {
                    //vm.apiaddress = resp.aggregations.ag.agg.buckets;
                    vm.apiaddress = resp.data.AggData;
                    common.$location.search.refresh = false;
                    //log("re");
                }, function (err) {
                    log(err.data.Message);
                });
            } else {
                vm.isCollapsed2 = !vm.isCollapsed2;
            }
        }

        //get and show verb facet
        vm.showRequestMethod = function () {
            if (vm.httpmethod === "" || vm.httpmethod === undefined || common.$location.search.refresh) {
                datasearch.termAggragation($rootScope.index, $rootScope.logtype, "verb.raw", vm.size, vm.st, vm.ft).then(function (resp) {
                    //vm.httpmethod = resp.aggregations.ag.agg.buckets;
                    vm.httpmethod = resp.data.AggData;
                    common.$location.search.refresh = false;
                    //log("re");
                }, function (err) {
                    log(err.data.Message);
                });
            }
            else { vm.isCollapsed3 = !vm.isCollapsed3; }
        }

        //get and show users facet
        vm.showUser = function () {
            if (vm.user === "" || vm.user === undefined || common.$location.search.refresh) {
                datasearch.termAggragation($rootScope.index, $rootScope.logtype, "ident.raw", vm.size, vm.st, vm.ft).then(function (resp) {
                    //vm.user = resp.aggregations.ag.agg.buckets;
                    vm.user = resp.data.AggData;
                    common.$location.search.refresh = false;
                    //  log("re");
                }, function (err) {
                    log(err.data.Message);
                });
            }
            else { vm.isCollapsed4 = !vm.isCollapsed4; }
        }

        //get and show useraction facet
        vm.showUserAction = function () {
            if (vm.useraction === "" || vm.useraction === undefined || common.$location.search.refresh) {
                datasearch.termAggragation($rootScope.index, $rootScope.logtype, "action.raw", vm.size, vm.st, vm.ft).then(function (resp) {
                    //vm.useraction = resp.aggregations.ag.agg.buckets;
                    vm.useraction = resp.data.AggData;
                    common.$location.search.refresh = false;
                    //  log("re");
                }, function (err) {
                    log(err.data.Message);
                });
            }
            else { vm.isCollapsed5 = !vm.isCollapsed5; }
        }

        //nav to els page
        function sidebarNav(r, f) {
            //$location.search();
            common.$location.search.field = f;
            common.$location.search('field', f);
            common.$location.search('text', r.Key.toString());
            common.$location.search.text = "\"" + r.Key.toString() + "\"";
            common.$location.path('/els/');
            //$location.path('/els/' + r.key.toString());
        }
        //#endregion

    };
})();


