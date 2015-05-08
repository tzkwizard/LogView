(function () {
    'use strict';

    var controllerId = 'timeSideNav';

    angular.module('app')
        .controller(controllerId, function ($rootScope, $scope, $timeout, $mdSidenav, common) {
            $scope.time = ["Last three months", "Last Month", "Last four weeks", "Last three weeks", "Last two weeks", "Last week",
                "Last five days", "Last three days", "Last day"];

            $scope.nav = function (x) {
                $rootScope.ft = new Date();
                switch (x) {
                    case "Last three months":
                        $rootScope.st = moment(new Date()).subtract(3, 'month');
                        break;
                    case "Last Month":
                        $rootScope.st = moment(new Date()).subtract(1, 'month');
                        break;
                    case "Last four weeks":
                        $rootScope.st = moment(new Date()).subtract(28, 'days');
                        break;
                    case "Last three weeks":
                        $rootScope.st = moment(new Date()).subtract(21, 'days');
                        break;
                    case "Last two weeks":
                        $rootScope.st = moment(new Date()).subtract(14, 'days');
                        break;
                    case "Last week":
                        $rootScope.st = moment(new Date()).subtract(7, 'days');
                        break;
                    case "Last five days":
                        $rootScope.st = moment(new Date()).subtract(5, 'days');
                        break;
                    case "Last three days":
                        $rootScope.st = moment(new Date()).subtract(3, 'days');
                        break;
                    case "Last day":
                        $rootScope.st = moment(new Date()).subtract(1, 'days');
                        break;
                    default:
                        break;
                }
                $mdSidenav('right').close();
                common.$location.path(common.$location.path() + "/");
            }
            $scope.$on("$destroy", function () {
                document.getElementById("nav").style.height = "10%";
            });
            $scope.close = function () {
                $mdSidenav('right').close()
                  .then(function () {
                      toastr.info("close RIGHT is done");
                  });
            };
        });
})();
