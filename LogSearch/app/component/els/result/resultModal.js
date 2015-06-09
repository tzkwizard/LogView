(function () {
    'use strict';

    var controllerId = 'resultModal';

    angular.module('app')
        .controller(controllerId, function ($modalInstance, common, item, resultService) {

            var vm = this;

            //#region variable
            vm.title = "Detailed search result";
            var viewData = item.data;
            vm.selected = {
                item: ""
            };
            vm.mySelections = [];
            //#endregion


            //#region Form1
            vm.myData = resultService.getData1(viewData._source);

            vm.gridOptions = {
                columnDefs: [
                    { field: 'Field', displayName: 'Field', width: 120 },
                    { field: 'Value', displayName: 'Value', width: 120 }
                ],
                data: 'searchResult.myData',
                selectedItems: vm.mySelections,
                multiSelect: false,
                jqueryUITheme: true,
                enableColumnResize: true,
                afterSelectionChange: function () {
                    angular.forEach(vm.mySelections, function (item) {
                        vm.selected.item = item["Field"] + " : " + item["Value"];
                    });
                }
            };
            //#endregion


            //#region Form2
            vm.myData2 = resultService.getData2(viewData._source);

            vm.gridOptions2 = {
                columnDefs: [
                        { field: 'Field', displayName: 'Field', width: 120 },
                        { field: 'Value', displayName: 'Value', width: 300 }
                ],
                data: 'searchResult.myData2',
                selectedItems: vm.mySelections,
                // multiSelect: false,
                jqueryUITheme: true,
                enableColumnResize: true,
                afterSelectionChange: function () {
                    angular.forEach(vm.mySelections, function (item) {
                        vm.selected.item = "geoip." + item["Field"].toLowerCase() + " : " + item["Value"];
                    });
                }
            };
            //#endregion


            //#region Form3
            vm.myData3 = resultService.getData3(viewData._source);

            vm.gridOptions3 = {
                columnDefs: [
                     { field: 'Field', displayName: 'Field', width: 120 },
                     { field: 'Value', displayName: 'Value', width: 420 }
                ],
                data: 'searchResult.myData3',
                selectedItems: vm.mySelections,
                //multiSelect: false,
                enableColumnResize: true,
                jqueryUITheme: true,
                afterSelectionChange: function () {
                    angular.forEach(vm.mySelections, function (item) {
                        vm.selected.item = item["Field"].toLowerCase() + " : " + item["Value"];
                    });
                }
            };
            //#endregion


            //#region Button
            vm.ok = function () {
                var res = "";
                res = resultService.getSearchText(vm.mySelections);
                common.$location.search.text = res;
                common.$location.path('/els/');
                $modalInstance.close(vm.selected.item);
            };

            vm.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            //#endregion

        });
})();

