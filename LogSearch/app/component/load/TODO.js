(function () {
    'use strict';

    var controllerId = 'TODO';

    angular.module('app')
      .controller(controllerId, function (common,$scope, $timeout, $mdBottomSheet, $cookieStore) {

        $scope.count = 0;

        var vm = this;
        activate();
        vm.fieldsName = ["3", "4"];
        $scope.fieldsName = ["1","2","3","4"];
        function activate() {
            common.activateController([], controllerId).then(function () {
                vm.xx = $cookieStore.get('index');
                common.$rootScope.spinner = false;
            });
            
        }

        $scope.test=function() {
            var s1 = document.getElementById('jselect1');
            var s2 = document.getElementById('fselect1');
            var s3 = document.getElementById('input1');

            toastr.info(s1.value+" "+s2.value+" "+s3.value);
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
