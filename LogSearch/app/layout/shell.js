(function () {
    'use strict';

    var controllerId = 'shell';
    angular.module('app').controller(controllerId,
        ['$rootScope', '$modal', 'common', 'config', 'client', shell]);

    function shell($rootScope, $modal, common, config, client) {
        var vm = this;
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var events = config.events;

        //#region variable
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.spinnerOptions = {
            radius: 120,
            lines: 24,
            length: 0,
            width: 30,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: 'Blue'
        };
        vm.showSplash = true;
        
        //#endregion


        //#region Login
        vm.items = "";
        vm.open = function () {
            var modalInstance = $modal.open({
                templateUrl: 'loginModal.html',
                controller: 'loginModal',
                size: 'sm',
                keyboard: false,
                resolve: {
                    items: function () {
                        return "";
                    }
                }
            });

        };

       /* vm.login = login;

        function login() {
            return client.ping({
                requestTimeout: 1000,
                hello: "elasticsearch!"
            }, function (error) {
                if (error) {
                    toastr.info("Username or Password Error!");
                    vm.open();
                }
                else {
                    toastr.info('elasticsearch cluster is connected');
                }
            });
        }*/

        //#endregion


        //#region Shell Load
        activate();
        function activate() {
            // logSuccess('Breezezz Angular loaded!', null, true);
            common.activateController([], controllerId).then(function () {
                vm.showSplash = false;
            });
        }
        //#endregion


        //#region spinner
        function toggleSpinner(on)
        { vm.isBusy = on; }

        $rootScope.$on('$routeChangeStart',
            function (event, next, current) { toggleSpinner(true); }
       );

        $rootScope.$on(events.controllerActivateSuccess,
             function (data) { toggleSpinner(false); }
         );

        $rootScope.$on(events.spinnerToggle,
            function (data) { toggleSpinner(data.show); }
        );
    };
    //#endregion

    /*   $rootScope.$on('$locationChangeStart',
    function(event, current, previous)
    {
        var answer = $window.confirm('Leave?');
 
        if(!answer)
        {
           event.preventDefault();
            return;
       }
    });*/

})();


(function () {
    'use strict';

    var controllerId = 'loginModal';

    angular.module('app')
        .controller(controllerId, function ($cookieStore, $rootScope, $scope, $modalInstance, $location, common, items, esFactory) {

            $scope.title = "Elasticsarch Login";      
            $scope.selected = {
                item: ""
            };
            $scope.username = "";
            $scope.password = "";



            $scope.ok = function () {

                var x = sjcl.encrypt("tzk", $scope.username);
                var y = sjcl.encrypt("tzk", $scope.password);
               

                $cookieStore.put('username', x);
                $cookieStore.put('password', y);
                window.location.reload();
               
                $modalInstance.close($scope.selected.item);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });
})();
