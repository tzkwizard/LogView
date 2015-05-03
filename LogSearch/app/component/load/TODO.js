(function () {
    'use strict';

    var controllerId = 'TODO';
    angular.module('app').controller(controllerId,
        ['$cookieStore', 'common', TODO]);

    function TODO($cookieStore, common) {
        var vm = this;
        activate();
        
        function activate() {
            common.activateController([], controllerId).then(function () {
                vm.xx = $cookieStore.get('index');
            });
            
        }

    };
})();
