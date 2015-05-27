(function () {
    'use strict';

    var controllerId = 'loginModal';
    angular.module('app')
        .controller(controllerId, function ($modalInstance, config, localStorageService) {
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
                var z = "tzk";
                var x = sjcl.encrypt(z, vm.username);
                var y = sjcl.encrypt(z, vm.password);

                /* $cookieStore.put('username', x);
                 $cookieStore.put('password', y);
                 $cookieStore.put('key', z);*/

                localStorageService.set('username', x);
                localStorageService.set('password', y);
                localStorageService.set('key', z);
                window.location.reload();
                //common.$location.path(common.$location.path() + "/");
                $modalInstance.close();
            };

            //close login page
            vm.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });
})();
