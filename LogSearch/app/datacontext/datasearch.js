(function () {
    'use strict';

    var serviceId = 'datasearch';
    angular.module('datacontext', []).factory(serviceId, ['$rootScope', '$http', 'config', datasearch]);

    function datasearch($rootScope, $http, config) {


        //#region service
        var service = {
            getMap: getMap,
            autoFill: autoFill,
            checkID: checkID,
            getLocation: getLocation,
            transferLocation: transferLocation,
            basicSearch: basicSearch,
            getSampledata: getSampledata,
            stringSearch: stringQuery,
            searchWithoutFilter: termQuery,
            termQueryWithBoolFilter: termQueryWithBoolFilter,
            stringQueryWithBoolFilter: stringQueryWithBoolFilter,
            termAggragation: termAggragation,
            termAggragationwithQuery: termAggragationwithQuery,
            dateHistogramAggregation: dateHistogramAggregation,
            dashboardPieAggregation: dashboardPieAggregation,
            termQueryAggragation: termQueryAggragation
        }
        return service;

        //#endregion


        //#region map
        function getMap() {
            var remote = config.remoteApiUrl + "api/ElasticMapping/LogstashMap";
            var local = config.localApiUrl + "api/ElasticMapping/LogstashMap";
            var r = {
                method: 'GET',
                url: local,
                params: {
                    token: $rootScope.token
                }
            }
            return $http(r).success(function (resp) {
                return resp;
            }).error(function (e) {
                // toastr.info(e);
            });
        }

        // get auto fill data
        function autoFill(text) {
            var info = {
                SearchText: text,
                Start: $rootScope.st,
                End: $rootScope.ft
            }
            var remote = config.remoteApiUrl + "api/ElasticMapping/AutoFill";
            var local = config.localApiUrl + "api/ElasticMapping/AutoFill";
            var ii = angular.toJson(info);

            var r = {
                method: 'POST',
                url: local,
                data: ii,
                params: {
                    token: $rootScope.token
                }
            }

            return $http(r)
              .success(function (resp) {
                  return resp;
              }).error(function (e) {
                  toastr.info("auto-fill " + e.Message);
              });
        }


        function checkID(username, password) {
            var remote = config.remoteApiUrl + "api/ElasticMapping/Login/" + username + "/" + password;
            var local = config.localApiUrl + "api/ElasticMapping/Login/" + username + "/" + password;

            return $http.get(local)
              .success(function (resp) {
                  return resp;
              }).error(function (e) {
                  return e;
              });
        }

        //#endregion


        //#region Location service
        function getLocation(val) {
            return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: val,
                    sensor: false
                }
            }).then(function (response) {
                return response.data.results.map(function (item) {
                    return item.formatted_address;
                });
            });
        }

        function transferLocation(add) {
            return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: add,
                    sensor: false
                }
            });
        }
        //#endregion


        //#region Aggragation search
        function dashboardPieAggregation(f1, f2, f3, start, end) {
            var info =
            {
                MultiField: [f1, f2, f3],
                Start: start,
                End: end,
                SubSize: 10
            }

            var ii = angular.toJson(info);

            var remote = config.remoteApiUrl + "api/ElasticAggragation/DashBoardPie";
            var local = config.localApiUrl + "api/ElasticAggragation/DashBoardPie";
            return $http.post(local, ii)
                .success(function (resp) {
                    return resp;
                }).error(function (e) {
                    return e;
                });
        }

        function dateHistogramAggregation(index, type, aggfield, span, start, end) {
            var info =
            {
                Span: span,
                Start: start,
                End: end,
                AggField: aggfield
            }

            var ii = angular.toJson(info);

            var remote = config.remoteApiUrl + "api/ElasticAggragation/DateHistogram";
            var local = config.localApiUrl + "api/ElasticAggragation/DateHistogram";
            return $http.post(local, ii)
                .success(function (resp) {
                    return resp;
                }).error(function (e) {
                    return e;
                });
        }

        function termAggragation(indices, type, aggfield, size, start, end) {
            var info =
            {
                SubSize: size,
                Start: start,
                End: end,
                AggField: aggfield
            }

            var ii = angular.toJson(info);

            var remote = config.remoteApiUrl + "api/ElasticAggragation/Term";
            var local = config.localApiUrl + "api/ElasticAggragation/Term";
            return $http.post(local, ii)
                .success(function (resp) {
                    return resp;
                }).error(function (e) {
                    return e;
                });
        }

        function termAggragationwithQuery(indices, type, aggfield, size, searchText, start, end) {
            var info =
            {
                SearchText: searchText,
                SubSize: size,
                Start: start,
                End: end,
                AggField: aggfield
            }

            var ii = angular.toJson(info);

            var remote = config.remoteApiUrl + "api/ElasticAggragation/StringQuery";
            var local = config.localApiUrl + "api/ElasticAggragation/StringQuery";
            return $http.post(local, ii)
                .success(function (resp) {
                    return resp;
                }).error(function (e) {
                    return e;
                });
        }

        function termQueryAggragation(indices, type, field, searchText, aggfield, size, start, end) {

            var info =
            {
                SearchText: searchText,
                Field: field,
                SubSize: size,
                Start: start,
                End: end,
                AggField: aggfield
            }

            var ii = angular.toJson(info);

            var remote = config.remoteApiUrl + "api/ElasticAggragation/TermQuery";
            var local = config.localApiUrl + "api/ElasticAggragation/TermQuery";
            return $http.post(local, ii)
                .success(function (resp) {
                    return resp;
                }).error(function (e) {
                    return e;
                });
        }

        //#endregion


        //#region Filter search

        function getSampledata(indices, type, pagecount, start, end, location, distance) {
            var info = {
                Type: type,
                Size: pagecount,
                Start: start,
                End: end,
                Lat: location.lat,
                Lon: location.lon,
                Location: location,
                GeoDistance: distance
            }

            var remote = config.remoteApiUrl + "api/ElasticSearch/SampleData";
            var local = config.localApiUrl + "api/ElasticSearch/SampleData";
            var ii = angular.toJson(info);

            var r = {
                method: 'POST',
                url: local,
                data: info,
                /* headers: {
                     'Content-Type': 'application/x-www-form-urlencoded'
                 },*/
                params: {
                    token: $rootScope.token,
                    Type: type,
                    Size: pagecount,
                    Start: start,
                    End: end,
                    Lat: location.lat,
                    Lon: location.lon,
                    GeoDistance: distance,
                    Location: [location.lat, location.lat]
                }
            }


            return $http(r)
                .success(function (resp) {
                    return resp;
                }).error(function (e) {
                    toastr.info(e.Message);
                });
        }

        function stringQuery(indices, type, pagecount, searchText, start, end, location, distance) {
            var info = {
                Type: type,
                Size: pagecount,
                SearchText: searchText,
                Start: start,
                End: end,
                Lat: location.lat,
                Lon: location.lon,
                GeoDistance: distance
            }

            var remote = config.remoteApiUrl + "api/ElasticSearch";
            var local = config.localApiUrl + "api/ElasticSearch";
            var ii = angular.toJson(info);

            var r = {
                method: 'POST',
                url: local,
                data: ii,
                params: {
                    token: $rootScope.token
                }
            }


            return $http(r)
                .success(function (resp) {
                    return resp;
                }).error(function (e) {
                    return e;
                });
        }

        function termQuery(indices, type, pagecount, field, searchText, start, end, location, distance) {
            var info = {
                Type: type,
                Size: pagecount,
                SearchText: searchText,
                Field: field,
                Start: start,
                End: end,
                Lat: location.lat,
                Lon: location.lon,
                GeoDistance: distance
            }

            var remote = config.remoteApiUrl + "api/ElasticSearch/Term";
            var local = config.localApiUrl + "api/ElasticSearch/Term";
            var ii = angular.toJson(info);

            var r = {
                method: 'POST',
                url: local,
                data: ii,
                params: {
                    token: $rootScope.token
                }
            }


            return $http(r)
                .success(function (resp) {
                    return resp;
                }).error(function (e) {
                    return e;
                });
        }

        function termQueryWithBoolFilter(indices, type, pagecount, field, searchText, condition, start, end, location, distance) {
            var info = {
                Type: type,
                Size: pagecount,
                SearchText: searchText,
                Field: field,
                Start: start,
                End: end,
                Lat: location.lat,
                Lon: location.lon,
                GeoDistance: distance,
                Filterdata: condition
            }

            var remote = config.remoteApiUrl + "api/ElasticSearch/TermBool";
            var local = config.localApiUrl + "api/ElasticSearch/TermBool";
            var ii = angular.toJson(info);

            var r = {
                method: 'POST',
                url: local,
                data: ii,
                params: {
                    token: $rootScope.token
                }
            }

            return $http(r)
                .success(function (resp) {
                    return resp;
                }).error(function (e) {
                    return e;
                });
        }

        function stringQueryWithBoolFilter(indices, type, pagecount, field, searchText, condition, start, end, location, distance) {
            var info = {
                Type: type,
                Size: pagecount,
                SearchText: searchText,
                Field: field,
                Start: start,
                End: end,
                Lat: location.lat,
                Lon: location.lon,
                GeoDistance: distance,
                Filterdata: condition
            }

            var remote = config.remoteApiUrl + "api/ElasticSearch/StringBool";
            var local = config.localApiUrl + "api/ElasticSearch/StringBool";
            var ii = angular.toJson(info);

            var r = {
                method: 'POST',
                url: local,
                data: ii,
                params: {
                    token: $rootScope.token
                }
            }

            return $http(r)
                .success(function (resp) {
                    return resp;
                }).error(function (e) {
                    return e;
                });
        }

        //#endregion


        //#region Main search 
        function basicSearch(indices, type, pagecount, field, searchText, condition, start, end, location, distance) {

            if (condition.length < 1) {
                if (field === "" || field === "all" || field === undefined) {
                    return stringQuery(indices, type, pagecount, searchText, start, end, location, distance);
                } else {
                    return termQuery(indices, type, pagecount, field, searchText, start, end, location, distance);
                }

            } else {
                if (field === "" || field === "all" || field === undefined) {
                    return stringQueryWithBoolFilter(indices, type, pagecount, field, searchText, condition, start, end, location, distance);
                } else {
                    return termQueryWithBoolFilter(indices, type, pagecount, field, searchText, condition, start, end, location, distance);
                }

            }
        }

        //#endregion


    }

})();