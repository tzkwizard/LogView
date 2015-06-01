(function () {
    'use strict';

    var controllerId = 'shell';
    angular.module('app').controller(controllerId,
        ['common', 'config', shell]);

    function shell(common, config) {
        var vm = this;
        var events = config.events;

        //#region variable
        vm.spinnerOptions = {
            radius: 60,
            lines: 24,
            length: 0,
            width: 30,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: 'Blue'
        };
        //#endregion

        //#region Shell Load
        activate();
        function activate() {
            // logSuccess('Breezezz Angular loaded!', null, true);
            common.activateController([], controllerId).then(function () {
            });
        }

        common.$rootScope.$on('$routeChangeStart',
            function (event, next, current) {
                common.$rootScope.spinner = true;
            }
        );
        //#endregion 

    }
})();

/*common.$rootScope.$on(events.controllerActivateSuccess,
   function (data) {
   }
);
common.$rootScope.$on(events.spinnerToggle,
   function (data) { toggleSpinner(data.show); }
);
$rootScope.$on('$viewContentLoaded', function readyToTrick() {
   //activate();
   toastr.info("1");
});
$rootScope.$on('$locationChangeStart',
  function (event, current, previous) {
      var answer = $window.confirm('Leave?');
      if (!answer) {
          event.preventDefault();
          return;
      }
  });*/