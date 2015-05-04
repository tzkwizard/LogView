(function () {
    'use strict';

    var controllerId = 'sidebar';
    angular.module('app').controller(controllerId,
        ['$rootScope', '$location', '$route', 'config', 'routes', 'dataconfig', 'datasearch', 'client', 'common', sidebar]);

    function sidebar($rootScope, $location, $route, config, routes, dataconfig, datasearch, client, common) {
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        //#region variable
        vm.isCurrent = isCurrent;
        vm.search = search;
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
        vm.getFieldName = getFieldName;
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

        //Load field
        function getFieldName() {
            if (vm.fieldsName.length === 0) {
                vm.fieldsName = dataconfig.getFieldName("logstash-2015.04.01", "logs");
                vm.isCollapsed = true;
            }
            vm.isCollapsed = !vm.isCollapsed;
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
            if (!route.config.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.config.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }

        //#endregion


        //#region Siderbar Facet
        //get and show location facet
        vm.showLocation = function () {
            if (vm.location === "" || vm.location === undefined || $location.search.refresh) {

                datasearch.termAggragation($rootScope.index, $rootScope.logtype, "geoip.city_name.raw", vm.size, vm.st, vm.ft).then(function (resp) {
                    //vm.location = resp.aggregations.ag.agg.buckets;
                    vm.location = resp.data.AggData;
                    $location.search.refresh = false;
                    // log("re");
                }, function (err) {
                    log(err.message);
                });
            } else {
                vm.isCollapsed = !vm.isCollapsed;
            }
        }

        //get and show api facet
        vm.showRequestAPI = function () {
            if (vm.apiaddress === "" || vm.apiaddress === undefined || $location.search.refresh) {
                datasearch.termAggragation($rootScope.index, $rootScope.logtype, "request.raw", vm.size, vm.st, vm.ft).then(function (resp) {
                    //vm.apiaddress = resp.aggregations.ag.agg.buckets;
                    vm.apiaddress = resp.data.AggData;
                    $location.search.refresh = false;
                    //log("re");
                }, function (err) {
                    log(err.message);
                });
            } else {
                vm.isCollapsed2 = !vm.isCollapsed2;
            }
        }

        //get and show verb facet
        vm.showRequestMethod = function () {
            if (vm.httpmethod === "" || vm.httpmethod === undefined || $location.search.refresh) {
                datasearch.termAggragation($rootScope.index, $rootScope.logtype, "verb.raw", vm.size, vm.st, vm.ft).then(function (resp) {
                    //vm.httpmethod = resp.aggregations.ag.agg.buckets;
                    vm.httpmethod = resp.data.AggData;
                    $location.search.refresh = false;
                    //log("re");
                }, function (err) {
                    log(err.message);
                });
            }
            else { vm.isCollapsed3 = !vm.isCollapsed3; }
        }

        //get and show users facet
        vm.showUser = function () {
            if (vm.user === "" || vm.user === undefined || $location.search.refresh) {
                datasearch.termAggragation($rootScope.index, $rootScope.logtype, "ident.raw", vm.size, vm.st, vm.ft).then(function (resp) {
                    //vm.user = resp.aggregations.ag.agg.buckets;
                    vm.user = resp.data.AggData;
                    $location.search.refresh = false;
                    //  log("re");
                }, function (err) {
                    log(err.message);
                });
            }
            else { vm.isCollapsed4 = !vm.isCollapsed4; }
        }

        //get and show useraction facet
        vm.showUserAction = function () {
            if (vm.useraction === "" || vm.useraction === undefined || $location.search.refresh) {
                datasearch.termAggragation($rootScope.index, $rootScope.logtype, "action.raw", vm.size, vm.st, vm.ft).then(function (resp) {
                    //vm.useraction = resp.aggregations.ag.agg.buckets;
                    vm.useraction = resp.data.AggData;
                    $location.search.refresh = false;
                    //  log("re");
                }, function (err) {
                    log(err.message);
                });
            }
            else { vm.isCollapsed5 = !vm.isCollapsed5; }
        }

        //nav to els page
        function sidebarNav(r, f) {
            //$location.search();
            $location.search.field = f;
            $location.search('field', f);
            //$location.search('text', r.key.toString());
            //$location.search.text = "\"" + r.key.toString() + "\"";
            $location.search('text', r.Key.toString());
            $location.search.text = "\"" + r.Key.toString() + "\"";
            $location.path('/els/')
            //$location.path('/els/' + r.key.toString());
        }
        //#endregion


        //#region deprecated
        function search($event) {
            if ($event.keyCode === config.keyCodes.esc) {
                vm.searchText = '';

                return;
            }

            if ($event.type === 'click' || $event.keyCode === config.keyCodes.enter) {
                var route = '/sessions/search/';

                $location.path(route + vm.searchText);
            }
        }

        //#endregion

    };
})();
