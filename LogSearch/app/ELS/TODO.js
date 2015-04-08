(function () {
    'use strict';

    var controllerId = 'TODO';
    angular.module('app').controller(controllerId,
        ['$rootScope', 'common', TODO]);

    function TODO($rootScope, common) {
        var vm = this;
        vm.title = 44;
        activate();
        
        function activate() {
            common.activateController([], controllerId).then(function () {
                vm.xx = $rootScope.index;
            });
            
        }

    };
})();
