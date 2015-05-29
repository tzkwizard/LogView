(function () {
    'use strict';

    var controllerId = 'Loading';
    angular.module('app').controller(controllerId,
        ['$rootScope', 'common','localStorageService', Loading]);

    function Loading($rootScope, common) {
        var vm = this;   
        
        activate();

        function activate() {
            common.activateController([], controllerId).then(function () {
                vm.xx = $rootScope.index;
                vm.yy = $rootScope.logfield;
                common.$rootScope.spinner = false;
            });
        }

    };
})();
