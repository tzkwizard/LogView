(function () {
    'use strict';

    var controllerId = 'resultModal';

    angular.module('app')
        .controller(controllerId, function ($scope, $modalInstance, common, items) {

            //#region variable
            $scope.title = "Detailed search result";
            $scope.items = items.data;
            $scope.field = items.field;

            $scope.selected = {
                item: ""
            };

            $scope.mySelections = [];
            $scope.myData = [];
            //#endregion


            //#region Form1
            //data
            angular.forEach(Object.keys($scope.items._source), function (item) {
                if (item === "geoip") return;
                $scope.myData.push({
                    Field: item, Value: $scope.items._source[item]
                });
            });
            if ($scope.items._source.hasOwnProperty('geoip') && $scope.items._source.geoip !== null) {
                angular.forEach(Object.keys($scope.items._source.geoip), function (item) {
                    $scope.myData.push({
                        Field: "geoip." + item,
                        Value: $scope.items._source.geoip[item]
                    });
                });
            }

            //option
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
                    //var x= $scope.mySelections.pop();
                    //  toastr.info($scope.mySelections.pop());
                    angular.forEach($scope.mySelections, function (item) {
                        // toastr.info(item.Value);
                        $scope.selected.item = item["Field"] + " : " + item["Value"];
                    });
                }
            };
            //#endregion


            //#region Form2
            //data
            $scope.myData2 = [
                { Field: "UserIP", Value: $scope.items._source['clientip'] }
            ];
            var x = $scope.items._source;
            if (x.hasOwnProperty('geoip') && x.geoip !== null) {
                $scope.myData2.push({ Field: "Country_Name", Value: $scope.items._source.geoip['country_name'] });
                $scope.myData2.push({ Field: "City_Name", Value: $scope.items._source['geoip']['city_name'] });
                $scope.myData2.push({ Field: "Real_Region_Name", Value: $scope.items._source['geoip']['real_region_name'] });
                $scope.myData2.push({ Field: "Postal_code", Value: $scope.items._source['geoip']['postal_code'] });
                $scope.myData2.push({ Field: "Coordinates", Value: $scope.items._source['geoip']['coordinates'] });
                $scope.myData2.push({ Field: "Timezone", Value: $scope.items._source['geoip']['timezone'] });

            }

            //option
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
            //data
            $scope.myData3 = [{ Field: "ClientIP", Value: $scope.items._source['clientip'] },
                   { Field: "HTTPmethod", Value: $scope.items._source['verb'] },
                   { Field: "Resquest", Value: $scope.items._source['request'] },
                   { Field: "Response", Value: $scope.items._source['response'] },
                   { Field: "APIresponse", Value: $scope.items._source['APIresponse'] },
                   { Field: "RuquestTime", Value: $scope.items._source['UTCtimestamp'] },
                   { Field: "Referrer", Value: $scope.items._source['referrer'] },
                   { Field: "Action", Value: $scope.items._source['action'] },
                   { Field: "Agent", Value: $scope.items._source['agent'] }

            ];

            //option
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
                        if (item["Field"] === "HTTPmethod")
                        { $scope.selected.item = "verb" + " : " + item["Value"]; }
                        else if (item["Field"] === "RuquestTime") {
                            $scope.selected.item = "timestamp" + " : " + item["Value"];
                        } else {
                            $scope.selected.item = item["Field"].toLowerCase() + " : " + item["Value"];
                        }
                    });
                }
            };
            //#endregion


            //#region Button
            var geo = ["Country_Name", "City_Name", "Real_Region_Name", "Postal_code", "Coordinates", "Timezone"];

            $scope.ok = function () {
                //  $location.search('field', f);
                var flag = true;
                var res = "";
                angular.forEach($scope.mySelections, function (item) {
                    if (flag) {
                        if (geo.indexOf(item["Field"]) !== -1) {
                            res = "geoip." + item["Field"].toLowerCase() + " : " + "\"" + item["Value"] + "\"";
                        } else {
                            res = item["Field"] + " : " + "\"" + item["Value"] + "\"";
                        }
                        flag = false;
                    } else {
                        if (geo.indexOf(item["Field"]) !== -1) {
                            res += " AND " + "geoip." + item["Field"].toLowerCase() + " : " + "\"" + item["Value"] + "\"";
                        } else {
                            res += " AND " + item["Field"] + " : " + "\"" + item["Value"] + "\"";
                        }
                    }
                });

                //common.$location.search.text = $scope.selected.item;
                //toastr.info($location.search.text);
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

