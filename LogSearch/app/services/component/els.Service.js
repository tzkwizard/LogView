(function () {
    'use strict';
    var serviceId = 'elsService';


    angular.module('app')
        .factory(serviceId, function (dataconfig, datasearch) {

            //#region service
            var service = {
                data: datasearch,
                config: dataconfig,
                fillSearchText: fillSearchText
            }
            return service;
            //#endregion

          
            //#region els service
            function fillSearchText(n, condition) {
                var searchText = "";
                for (var i = 0; i < condition.length; i++) {
                    var s1 = condition[i].condition;
                    var s2 = condition[i].field;
                    var s3 = condition[i].text;
                    if (s1 === "" || s2 === "")
                        continue;
                    if (s1 === "MUST") {
                        if (s3 !== "") {
                            if (i === 1) {
                                searchText += s2 + " : \"" + s3 + "\"^2";
                            } else {
                                searchText += " AND " + s2 + " : \"" + s3 + "\"^2";
                            }
                        }
                    }
                    else if (s1 === "MUST_NOT") {
                        if (s3 !== "") {
                            if (i === 1) {
                                searchText += " NOT " + s2 + " : \"" + s3 + "\"";
                            } else {
                                searchText += " NOT " + s2 + " : \"" + s3 + "\"";
                            }
                        }
                    } else {
                        if (s3 !== "") {
                            if (i === 1) {
                                searchText += s2 + " : \"" + s3 + "\"";
                            } else {
                                searchText += " AND " + s2 + " : \"" + s3 + "\"";
                            }
                        }
                    }
                }
                return searchText;
            }
            //#endregion
        


        });
})();