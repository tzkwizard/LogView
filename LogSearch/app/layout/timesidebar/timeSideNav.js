(function () {
    'use strict';

    var controllerId = 'timeSideNav';

    angular.module('app')
        .controller(controllerId, function ($scope, $mdSidenav, common, dataconfig, config) {
            $scope.time = config.time.timeSpan.m;
            $scope.nav = function (span) {
                common.$rootScope.ft = new Date();
                common.$rootScope.st = dataconfig.changeTimeSpan(span);
                $mdSidenav('right').close();
                common.$location.path(common.$location.path() + "/");
            }

            $scope.$on("$destroy", function () {
                document.getElementById("nav").style.height = "10%";
            });
            $scope.close = function () {
                $mdSidenav('right').close()
                  .then(function () {
                      //toastr.info("close RIGHT is done");
                  });
            };
        });
})();

