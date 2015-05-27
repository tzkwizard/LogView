(function () {
    'use strict';

    var controllerId = 'timeBottomSheet';
    angular.module('app')
      .controller(controllerId, function ($mdBottomSheet, config) {
          var vm = this;
          vm.ts = config.time.timeSpan.l;
          vm.listItemClick = function ($index) {
              var clickedItem = vm.ts[$index];
              $mdBottomSheet.hide(clickedItem);
          };

      });
})();