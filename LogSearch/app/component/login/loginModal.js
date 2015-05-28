(function () {
    'use strict';

    var controllerId = 'loginModal';
    angular.module('app')
        .controller(controllerId, function ($modalInstance, config, dataconfig) {
            var vm = this;
            vm.title = "Elasticsarch Login";
            vm.username = "";
            vm.password = "";

            //keyboard support
            vm.try = function ($event) {
                if ($event.keyCode === config.keyCodes.enter) {
                    vm.ok();
                }
            }

            //validate username and password
            vm.ok = function () {
                dataconfig.checkIdent(vm.username, vm.password);
                //window.location.reload();
                $modalInstance.close();
            };

            //close login page
            vm.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });
})();
