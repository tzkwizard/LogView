/// <reference path="../els/els.html" />
(function () {
    'use strict';

    var controllerId = 'TODO';

    angular.module('app')
      .controller(controllerId, function (common,$scope, $timeout, $mdBottomSheet, $cookieStore) {



        var vm = this;
        activate();
        
        function activate() {
            common.activateController([], controllerId).then(function () {
                vm.xx = $cookieStore.get('index');
            });
            
        }

        $scope.alert = '';
        $scope.showListBottomSheet = function ($event) {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'app/component/load/BottomListSheet.html',
                controller: 'ListBottomSheetCtrl',
                targetEvent: $event
            }).then(function (clickedItem) {
                $scope.alert = clickedItem.name + ' clicked!';
            });
        };


        $scope.showGridBottomSheet = function($event) {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'app/component/load/BottomGridSheet.html',
                controller: 'GridBottomSheetCtrl',
                targetEvent: $event
            }).then(function(clickedItem) {
                $scope.alert = clickedItem.name + ' clicked!';
            });
        };


    });
})();


(function () {
    'use strict';

    var controllerId = 'ListBottomSheetCtrl';

    angular.module('app')
      .controller(controllerId, function ($scope, $mdBottomSheet) {

          $scope.items = [
            { name: 'Share', icon: 'share-arrow' },
    { name: 'Upload', icon: 'upload' },
    { name: 'Copy', icon: 'copy' },
    { name: 'Print this page', icon: 'print' }
          ];
          $scope.listItemClick = function ($index) {
              var clickedItem = $scope.items[$index];
              $mdBottomSheet.hide(clickedItem);
          };
      });
})();




(function () {
    'use strict';

    var controllerId = 'GridBottomSheetCtrl';

    angular.module('app')
      .controller(controllerId, function ($scope, $mdBottomSheet) {
          $scope.items = [
              { name: 'Hangout', icon: 'hangout' },
              { name: 'Mail', icon: 'mail' },
              { name: 'Message', icon: 'message' },
              { name: 'Copy', icon: 'copy2' },
              { name: 'Facebook', icon: 'facebook' },
              { name: 'Twitter', icon: 'twitter' }
          ];
          $scope.listItemClick = function($index) {
              var clickedItem = $scope.items[$index];
              $mdBottomSheet.hide(clickedItem);
          };
      });

})();
