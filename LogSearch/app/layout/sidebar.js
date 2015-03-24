(function () { 
    'use strict';
    
    var controllerId = 'sidebar';
    angular.module('app').controller(controllerId,
        ['$location','$route', 'config', 'routes','dataconfig', sidebar]);

    function sidebar($location, $route, config, routes, dataconfig) {
        var vm = this;

        vm.isCurrent = isCurrent;
        vm.search = search;
        vm.searchText = '';
        var keyCodes = config.keyCodes;
        vm.isCollapsed = false;
        activate();
        vm.fieldsName = [];
        vm.content = [];
        vm.content[0] = 4;
        vm.content[1] = 5;
        vm.getFieldName = getFieldName;
        vm.test = test;
        function activate() {
            getNavRoutes();
            
        }
        function test(r) {
            toastr.info(r);
        }


        function getFieldName() {
            if (vm.fieldsName.length === 0) {
                vm.fieldsName = dataconfig.getFieldName("logstash-2015.02.10", "logs");
                vm.isCollapsed = true;
            }
            vm.isCollapsed = !vm.isCollapsed;
        }

        
        function getNavRoutes() {
            vm.navRoutes = routes.filter(function(r) {
                return r.config.settings && r.config.settings.nav;
            }).sort(function(r1, r2) {
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
