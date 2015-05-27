(function () {
    'use strict';
    var serviceId = 'elsService';


    angular.module('app')
        .factory(serviceId, function (dataconfig, datasearch, $modal, $mdBottomSheet) {

            //#region service
            var service = {
                data: datasearch,
                config: dataconfig,
                fillSearchText: fillSearchText,
                openResult: openResult,
                showListBottomSheet: showListBottomSheet
            }
            return service;
            //#endregion

          
            //#region els service
            function fillSearchText(condition) {
                var searchText = "";
                for (var i = 0; i < condition.length; i++) {
                    var s1 = condition[i].condition;
                    var s2 = condition[i].field;
                    var s3 = condition[i].text;
                    if (s1 === "" || s2 === "")
                        continue;
                    if (s1 === "MUST") {
                        if (s3 !== "") {
                            if (i === 0) {
                                searchText += s2 + " : \"" + s3 + "\"^2";
                            } else {
                                searchText += " AND " + s2 + " : \"" + s3 + "\"^2";
                            }
                        }
                    }
                    else if (s1 === "MUST_NOT") {
                        if (s3 !== "") {
                            if (i === 0) {
                                searchText += " NOT " + s2 + " : \"" + s3 + "\"";
                            } else {
                                searchText += " NOT " + s2 + " : \"" + s3 + "\"";
                            }
                        }
                    } else {
                        if (s3 !== "") {
                            if (i === 0) {
                                searchText += s2 + " : \"" + s3 + "\"";
                            } else {
                                searchText += " AND " + s2 + " : \"" + s3 + "\"";
                            }
                        }
                    }
                }
                return searchText;
            }


            function openResult(doc) {
                this.item = "";          
                var popdata = {
                    data: doc
                };
                var modalInstance = $modal.open({
                    templateUrl: 'app/component/els/result/resultModal.html',
                    controller: 'resultModal as searchResult',
                    //size: 'lg',
                    resolve: {
                        item: function () {
                            return popdata;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    var selected = selectedItem;
                    return selected;
                }, function () {
                    //log('Modal dismissed at: ' + new Date());
                });
            }



            function showListBottomSheet() {
               return $mdBottomSheet.show({
                    templateUrl: 'app/component/bottom/time/time-Bottom-Sheet.html',
                    controller: 'timeBottomSheet as timeBottomSheet'
                }).then(function (clickedItem) {
                    return clickedItem;
                });
            }
            //#endregion
        


        });
})();