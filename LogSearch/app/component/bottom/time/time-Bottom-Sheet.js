(function () {
    'use strict';

    var controllerId = 'timeBottomSheet';
    angular.module('bottomsetting')
      .controller(controllerId, function (common, config) {
          var vm = this;
          vm.ts = config.time.timeSpan.l;
          vm.listItemClick = function ($index) {
              var clickedItem = vm.ts[$index];
              common.$mdBottomSheet.hide(clickedItem);
          };

      });
})();