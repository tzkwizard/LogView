(function () {
    'use strict';

    var controllerId = 'timeBottomSheet';
    angular.module('app')
      .controller(controllerId, function ($scope, $mdBottomSheet, config) {

          $scope.ts = config.time.timeSpan.l;
          $scope.listItemClick = function ($index) {
              var clickedItem = $scope.ts[$index];
              $mdBottomSheet.hide(clickedItem);
          };

      });
})();