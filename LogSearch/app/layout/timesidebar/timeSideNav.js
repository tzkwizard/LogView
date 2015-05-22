(function () {
    'use strict';

    var controllerId = 'timeSideNav';

    angular.module('app')
        .controller(controllerId, function ($scope, $mdSidenav, common, dataconfig) {
            $scope.time = ["Last 3 months", "Last Month", "Last 4 weeks", "Last 3 weeks", "Last 2 weeks", "Last week",
            "Last 5 days", "Last 3 days", "Last 2 days", "Last day"];

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

