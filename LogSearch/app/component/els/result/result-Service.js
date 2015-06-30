(function () {
    'use strict';
    var serviceId = 'resultService';


    angular.module('els')
        .factory(serviceId, function () {

            //#region service
            var service = {
                getData1: getData1,
                getData2: getData2,
                getData3: getData3,
                getSearchText: getSearchText
            }
            return service;
            //#endregion

            //#region result service
            function getData1(source) {
                var data = [];
                angular.forEach(Object.keys(source), function (item) {
                    if (item === "geoip"||item==="message") return;
                    data.push({
                        Field: item, Value: source[item]
                    });
                });
                if (source.hasOwnProperty('geoip') && source.geoip !== null) {
                    angular.forEach(Object.keys(source.geoip), function (item) {
                        data.push({
                            Field: "geoip." + item,
                            Value: source.geoip[item]
                        });
                    });
                }
                return data;
            }

            function getData2(source) {
                var data = [];
                var x = source;
                if (x.hasOwnProperty('geoip') && x.geoip !== null) {
                    angular.forEach(Object.keys(source.geoip), function (item) {
                        if (source.geoip[item]!==null&&source.geoip[item]!==0) {
                            data.push({
                                Field: item.charAt(0).toUpperCase() + item.substring(1),
                                Value: source.geoip[item]
                            });
                        }
                    });
                }
                return data;
            }

            function getData3(source) {
                var data = [];
                angular.forEach(Object.keys(source), function (item) {
                    if (item === "geoip" || item === "message") return;
                    if (source[item]!==null) {
                        data.push({
                            Field: item.charAt(0).toUpperCase() + item.substring(1),
                            Value: source[item]
                        });
                    }
                });
                return data;
            }

            function getSearchText(selections) {
                var geo = ["Country_Name", "City_Name", "Real_Region_Name", "Postal_code", "Coordinates", "Timezone"];
                var res = "";
                var flag = true;
                angular.forEach(selections, function (item) {
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
                return res;
            }
            //#endregion

        });
})();