(function () {
    'use strict';

    var controllerId = 'topnav';
    angular.module('app').controller(controllerId,
        ['$location', '$route', 'config', 'routes', topnav]);

    function topnav($location, $route, config, routes) {
        var vm = this;

        vm.search = search;
        vm.searchText = '44';
        var keyCodes = config.keyCodes;
        activate();

       
        function activate() { }

       
        function search($event) {
            if ($event.keyCode === config.keyCodes.esc) {
                vm.searchText = '';

                return;
            }

            if ($event.type === 'click' || $event.keyCode === config.keyCodes.enter) {
                var route = '/els/';
                $location.search('logs', "logs");
                $location.search('log', "log");
                $location.search('field', "message");
                $location.path(route + vm.searchText);
            }
        }

    };
})();

