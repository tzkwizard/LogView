(function () {
    'use strict';
    var serviceId = 'resultService';


    angular.module('app')
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
                    if (item === "geoip") return;
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
                var data = [
                 { Field: "UserIP", Value: source['clientip'] }
                ];
                var x = source;
                if (x.hasOwnProperty('geoip') && x.geoip !== null) {
                    data.push({ Field: "Country_Name", Value: source.geoip['country_name'] });
                    data.push({ Field: "City_Name", Value: source['geoip']['city_name'] });
                    data.push({ Field: "Real_Region_Name", Value: source['geoip']['real_region_name'] });
                    data.push({ Field: "Postal_code", Value: source['geoip']['postal_code'] });
                    data.push({ Field: "Coordinates", Value: source['geoip']['coordinates'] });
                    data.push({ Field: "Timezone", Value: source['geoip']['timezone'] });
                }
                return data;
            }

            function getData3(source) {
                var data = [{ Field: "ClientIP", Value: source['clientip'] },
                   { Field: "Verb", Value: source['verb'] },
                   { Field: "Resquest", Value: source['request'] },
                   { Field: "Response", Value: source['response'] },
                   { Field: "APIresponse", Value: source['APIresponse'] },
                   { Field: "Timestamp", Value: source['UTCtimestamp'] },
                   { Field: "Referrer", Value: source['referrer'] },
                   { Field: "Action", Value: source['action'] },
                   { Field: "Agent", Value: source['agent'] }

                ];
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