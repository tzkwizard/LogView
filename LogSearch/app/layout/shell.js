(function () {
    'use strict';
    angular.module('app.layout', []);
    
    var controllerId = 'shell';
    angular.module('layout').controller(controllerId,
        ['common', shell]);

    function shell(common) {
        var vm = this;
        //var events = config.events;

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

        //#region test
        vm.strength = "";
        vm.password = '';
        vm.grade = function () {
            var size = vm.password.length;
            if (size > 8) {
                vm.strength = 'strong';
            } else if (size > 3) {
                vm.strength = 'medium';
            } else {
                vm.strength = 'weak';
            }
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
(function () {
    'use strict';
    angular.module('layout').controller('test',
        [test]);

    function test() {
        var vm = this;
        vm.strength = "";
        vm.password = '123';
        vm.grade = function () {
            var size = vm.password.length;
            if (size > 8) {
                vm.strength = 'strong';
            } else if (size > 3) {
                vm.strength = 'medium';
            } else {
                vm.strength = 'weak';
            }
        };


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