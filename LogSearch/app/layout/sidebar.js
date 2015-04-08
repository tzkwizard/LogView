(function () {
    'use strict';

    var controllerId = 'sidebar';
    angular.module('app').controller(controllerId,
        ['$rootScope', '$location', '$route', 'config', 'routes', 'dataconfig', 'datasearch', 'client', 'common', sidebar]);

    function sidebar($rootScope, $location, $route, config, routes, dataconfig, datasearch, client, common) {
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var log = getLogFn(controllerId);

        vm.isCurrent = isCurrent;
        vm.search = search;
        vm.searchText = '';
        var keyCodes = config.keyCodes;
        vm.isCollapsed = false;
        vm.isCollapsed2 = false;
        vm.isCollapsed3 = false;
        vm.isCollapsed4 = false;
        vm.isCollapsed5 = false;
        activate();
        vm.fieldsName = [];
        vm.size = 10;

        vm.location = "";
        vm.httpmethod = "";
        vm.apiaddress = "";
        vm.user = "";
        vm.useraction = "";

        vm.content = [];
        vm.content[0] = 4;
        vm.content[1] = 5;
        vm.getFieldName = getFieldName;

        vm.agg = ["Ace", "Luffy", "Sabo"];

        vm.test = test;

        function activate() {
            //getFieldName();

            common.activateController([getNavRoutes()], controllerId)
                .then(function () {
                });
        }

        function test(r, f) {
            toastr.info(r.key.toString());
            //$location.search();
            $location.search.field = "";
            $location.search('field', f);
            $location.search.text = r.key.toString();
            $location.path('/els/')
            //$location.path('/els/' + r.key.toString());
        }


        function getFieldName() {
            if (vm.fieldsName.length === 0) {
                vm.fieldsName = dataconfig.getFieldName("logstash-2015.04.01", "logs");
                vm.isCollapsed = true;
            }
            vm.isCollapsed = !vm.isCollapsed;
        }



        vm.showLocation = function () {
            if (vm.location === "" || vm.location === undefined || $location.search.refresh) {

                datasearch.termAggragation($rootScope.index, 'logs', "clientip.raw", vm.size, $rootScope.st, $rootScope.ft).then(function (resp) {
                    vm.location = resp.aggregations.ag.agg.buckets;
                    $location.search.refresh = false;
                    log("re");
                }, function (err) {
                    log(err.message);
                });
            } else {
                vm.isCollapsed = !vm.isCollapsed;
            }
        }

        vm.showRequestAPI = function () {
            if (vm.apiaddress === "" || vm.apiaddress === undefined || $location.search.refresh) {
                datasearch.termAggragation($rootScope.index, 'logs', "request.raw", vm.size, $rootScope.st, $rootScope.ft).then(function (resp) {
                    vm.apiaddress = resp.aggregations.ag.agg.buckets;
                    $location.search.refresh = false;
                    log("re");
                }, function (err) {
                    log(err.message);
                });
            } else {
                vm.isCollapsed2 = !vm.isCollapsed2;
            }
        }


        vm.showRequestMethod = function () {
            if (vm.httpmethod === "" || vm.httpmethod === undefined || $location.search.refresh) {
                datasearch.termAggragation($rootScope.index, 'logs', "verb.raw", vm.size, $rootScope.st, $rootScope.ft).then(function (resp) {
                    vm.httpmethod = resp.aggregations.ag.agg.buckets;
                    $location.search.refresh = false;
                    log("re");
                }, function (err) {
                    log(err.message);
                });
            }
            else { vm.isCollapsed3 = !vm.isCollapsed3; }
        }


        vm.showUser = function () {
            if (vm.user === "" || vm.user === undefined || $location.search.refresh) {
                datasearch.termAggragation($rootScope.index, 'logs', "ident.raw", vm.size, $rootScope.st, $rootScope.ft).then(function (resp) {
                    vm.user = resp.aggregations.ag.agg.buckets;
                    $location.search.refresh = false;
                    log("re");
                }, function (err) {
                    log(err.message);
                });
            }
            else { vm.isCollapsed4 = !vm.isCollapsed4; }
        }

        vm.showUserAction = function () {
            if (vm.useraction === "" || vm.useraction === undefined || $location.search.refresh) {
                datasearch.termAggragation($rootScope.index, 'logs', "action.raw", vm.size, $rootScope.st, $rootScope.ft).then(function (resp) {
                    vm.useraction = resp.aggregations.ag.agg.buckets;
                    $location.search.refresh = false;
                    log("re");
                }, function (err) {
                    log(err.message);
                });
            }
            else { vm.isCollapsed5 = !vm.isCollapsed5; }
        }




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

    };
})();
