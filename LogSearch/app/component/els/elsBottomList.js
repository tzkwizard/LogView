(function () {
    'use strict';

    var controllerId = 'elsBottomList';
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