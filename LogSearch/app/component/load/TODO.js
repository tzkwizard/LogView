(function () {
    'use strict';

    var controllerId = 'TODO';

    angular.module('app')
      .controller(controllerId, function (common,$scope, $timeout, $mdBottomSheet) {

        $scope.count = 0;

        var vm = this;
        activate();
        vm.fieldsName = ["3", "4"];
        $scope.fieldsName = ["1","2","3","4"];
        function activate() {
            common.activateController([], controllerId).then(function () {
                common.$rootScope.spinner = false;
            });
            
        }

        $scope.test=function() {
            var z = tt();

            z.then(function(d) {
                var z = d;
            });
            toastr.info(z);
        }
          function tt() {
              return common.$q.when("44").then(function() {
                  return "442";
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
