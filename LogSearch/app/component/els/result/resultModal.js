(function () {
    'use strict';

    var controllerId = 'resultModal';

    angular.module('app')
        .controller(controllerId, function ($scope, $modalInstance, common, item, resultService) {

            //#region variable
            $scope.title = "Detailed search result";
            var viewData = item.data;
            $scope.selected = {
                item: ""
            };
            $scope.mySelections = [];
            //#endregion


            //#region Form1
            $scope.myData = resultService.getData1(viewData._source);

            $scope.gridOptions = {
                columnDefs: [
                    { field: 'Field', displayName: 'Field', width: 120 },
                    { field: 'Value', displayName: 'Value', width: 120 }
                ],
                data: 'myData',
                selectedItems: $scope.mySelections,
                //  multiSelect: false,
                jqueryUITheme: true,
                enableColumnResize: true,
                afterSelectionChange: function () {
                    angular.forEach($scope.mySelections, function (item) {
                        $scope.selected.item = item["Field"] + " : " + item["Value"];
                    });
                }
            };
            //#endregion


            //#region Form2
            $scope.myData2 = resultService.getData2(viewData._source);

            $scope.gridOptions2 = {
                columnDefs: [
                        { field: 'Field', displayName: 'Field', width: 120 },
                        { field: 'Value', displayName: 'Value', width: 300 }
                ],
                data: 'myData2',
                selectedItems: $scope.mySelections,
                // multiSelect: false,
                jqueryUITheme: true,
                enableColumnResize: true,
                afterSelectionChange: function () {
                    angular.forEach($scope.mySelections, function (item) {
                        $scope.selected.item = item["Field"].toLowerCase() + " : " + item["Value"];
                    });
                }
            };
            //#endregion


            //#region Form3
            $scope.myData3 = resultService.getData3(viewData._source);

            $scope.gridOptions3 = {
                columnDefs: [
                     { field: 'Field', displayName: 'Field', width: 120 },
                     { field: 'Value', displayName: 'Value', width: 420 }
                ],
                data: 'myData3',
                selectedItems: $scope.mySelections,
                multiSelect: false,
                enableColumnResize: true,
                jqueryUITheme: true,
                afterSelectionChange: function () {
                    angular.forEach($scope.mySelections, function (item) {
                        $scope.selected.item = item["Field"].toLowerCase() + " : " + item["Value"];
                    });
                }
            };
            //#endregion


            //#region Button
            $scope.ok = function () {
                var res = "";
                res = resultService.getSearchText($scope.mySelections);
                common.$location.search.text = res;
                common.$location.path('/els/');
                $modalInstance.close($scope.selected.item);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            //#endregion

        });
})();

