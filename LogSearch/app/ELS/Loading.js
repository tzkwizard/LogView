(function () {
    'use strict';

    var controllerId = 'Loading';
    angular.module('app').controller(controllerId,
        ['common',Loading]);

    function Loading(common) {
        var vm = this;   
        
        activate();

        function activate() {
            common.activateController([], controllerId).then(function () {              
            });
        }

    };
})();
