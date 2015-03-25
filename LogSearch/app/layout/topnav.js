(function () {
    'use strict';

    var controllerId = 'topnav';
    angular.module('app').controller(controllerId,
        ['$location', '$route', 'config', 'routes', topnav]);

    function topnav($location, $route, config, routes) {
        var vm = this;

        vm.search = search;
        vm.refresh = refresh;
        vm.searchText = '44';
        var keyCodes = config.keyCodes;
        activate();
        vm.path = path;
        function path(n) {

            switch (n) {
                case 1: $location.path("/dashboard"); break;
                case 2: $location.path("/els"); break;
                case 3: $location.path("/aggs"); break;
                default:$location.path("/"); break;
            }
            
        }
       
        function activate() { }

       
        function search($event) {
            if ($event.keyCode === config.keyCodes.esc) {
                vm.searchText = '';

                return;
            }

            if ($event.type === 'click' || $event.keyCode === config.keyCodes.enter) {
                var route = '/els/';
             
                $location.path(route + vm.searchText);
            }
        }
        function refresh($event) {
            if ($event.keyCode === config.keyCodes.esc) {
                vm.searchText = '';

                return;
            }
            $location.search.refresh = true;
            toastr.info("Refresh");
        }


    };
})();

