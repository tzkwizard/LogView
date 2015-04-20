(function () {
    'use strict';

    var controllerId = 'shell';
    angular.module('app').controller(controllerId,
        ['$rootScope', '$modal', 'common', 'config','client', shell]);

    function shell($rootScope,$modal, common, config,client) {
        var vm = this;
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var events = config.events;
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
        activate();


     

      
        vm.items = ['item1', 'item2', 'item3'];

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

        vm.login = login;

            function login () {
            client.ping({
                requestTimeout: 1000,
                hello: "elasticsearch!"
            }, function (error) {
                if (error) {
                    vm.open();
                }
                else {
                    toastr.info('elasticsearch cluster is connected');
                }
            });
        }
      
        
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


        function activate() {
            // logSuccess('Breezezz Angular loaded!', null, true);
            common.activateController([login()], controllerId).then(function () {
                vm.showSplash = false;
            });
        }

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
})();


(function () {
    'use strict';

    var controllerId = 'loginModal';

    angular.module('app')
        .controller(controllerId, function ($cookieStore,$rootScope, $scope, $modalInstance, $location, common, items, esFactory) {

            $scope.title = "Elasticsarch Login";
            $scope.items = items.data;
            $scope.field = items.field;

            $scope.selected = {
                item: ""
            };

            $scope.mySelections = [];
            $scope.myData = [];

            $scope.username = "";
            $scope.password = "";



            $scope.ok = function () {
                $cookieStore.put('username', $scope.username);
                $cookieStore.put('password', $scope.password);
                window.location.reload();
                $modalInstance.close($scope.selected.item);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });
})();
