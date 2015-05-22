(function () {
    'use strict';

    var controllerId = 'loginModal';
    angular.module('app')
        .controller(controllerId, function ($cookieStore, $scope, $modalInstance, config) {

            $scope.title = "Elasticsarch Login";
            $scope.username = "";
            $scope.password = "";

            //keyboard support
            $scope.try = function ($event) {
                if ($event.keyCode === config.keyCodes.enter) {
                    $scope.ok();
                }
            }

            //validate username and password
            $scope.ok = function () {
                var z = "tzk";
                var x = sjcl.encrypt(z, $scope.username);
                var y = sjcl.encrypt(z, $scope.password);

                $cookieStore.put('username', x);
                $cookieStore.put('password', y);
                $cookieStore.put('key', z);
                window.location.reload();
                //common.$location.path(common.$location.path() + "/");
                $modalInstance.close();
            };

            //close login page
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });
})();
