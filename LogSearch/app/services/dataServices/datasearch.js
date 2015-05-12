(function () {
    'use strict';

    var serviceId = 'datasearch';
    angular.module('app').factory(serviceId, ['$rootScope', 'client', '$http', 'config', datasearch]);

    function datasearch($rootScope, client, $http, config) {

        var vm = this;

        //#region service
        var service = {
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


        //#region Aggragation
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
                    //toastr.info(e);
                });


            return client.search({
                index: vm.indicesName,
                type: vm.type,
                body: ejs.Request()
                    .aggregation(ejs.FilterAggregation("ag1").filter(ejs.RangeFilter("@timestamp").lte(end).gte(start)).agg(ejs.TermsAggregation("agg1").field(f1)))
                    .aggregation(ejs.FilterAggregation("ag2").filter(ejs.RangeFilter("@timestamp").lte(end).gte(start)).agg(ejs.TermsAggregation("agg2").field(f2)))
                    .aggregation(ejs.FilterAggregation("ag3").filter(ejs.RangeFilter("@timestamp").lte(end).gte(start)).agg(ejs.TermsAggregation("agg3").field(f3)))

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
                    //toastr.info(e);
                });


            return client.search({
                index: index,
                type: type,
                body: ejs.Request()
                    .aggregation(ejs.FilterAggregation("ag").aggregation(ejs.DateHistogramAggregation("agg").field(aggfield).interval(span)).filter(ejs.RangeFilter("@timestamp").lte(end).gte(start)))
                //.format("yyyy-MM-dd")

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
                    //toastr.info(e);
                });;


            return client.search({
                index: indices,
                type: type,
                body:
                    ejs.Request()
                        .query(ejs.MatchAllQuery())
                        .aggregation(ejs.FilterAggregation("ag").filter(ejs.RangeFilter("@timestamp").lte(end).gte(start)).aggregation(ejs.TermsAggregation("agg").field(aggfield).size(size)))
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
                    //toastr.info(e);
                });


            return client.search({
                index: indices,
                type: type,
                body: ejs.Request()
                    .query(ejs.QueryStringQuery(searchText))
                    .aggregation(ejs.FilterAggregation("ag").filter(ejs.RangeFilter("@timestamp").lte(end).gte(start)).aggregation(ejs.TermsAggregation("agg").field(aggfield).size(size)))


            });
        }

        function termQueryAggragation(indices, type,field, searchText, aggfield, size, start, end) {

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
                    //toastr.info(e);
                });


            return client.search({
                index: indices,
                type: type,
                body: ejs.Request()
                    .query(ejs.TermQuery("geoip.country_code3.raw", "USA"))
                    .aggregation(ejs.FilterAggregation("ag").filter(ejs.RangeFilter("@timestamp").lte(end).gte(start)).aggregation(ejs.TermsAggregation("agg").field(aggfield).size(size)))

            });
        }

        //#endregion


        //#region Filter

        function getSampledata(indices, type, pagecount, start, end, location, distance) {


            var info = {
                Type: type,
                Size: pagecount,
                Start: start,
                End: end,
                Lat: location.lat,
                Lon: location.lon,
                Location :location,
                GeoDistance: distance
            }

            var remote = config.remoteApiUrl + "api/ElasticSearch/SampleData";
            var local = config.localApiUrl + "api/ElasticSearch/SampleData";
            var ii = angular.toJson(info);

            var r = {
                method: 'POST',
                url: local,
                data: ii,
                params: {
                    token: $rootScope.token,
                    Type: type,
                    Size: pagecount,
                    Start: start,
                    End: end,
                    Lat: location.lat,
                    Lon:location.lon,
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


            return client.search({
                index: indices,
                //type: type,
                size: pagecount,
                body:
                    ejs.Request()
                        .query(ejs.MatchAllQuery())
                        .filter(ejs.RangeFilter("@timestamp").lte(end).gte(start))

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
                    toastr.info(e.Message);
                });


            return $http.post(local, ii)
                .success(function (resp) {
                    return resp;
                }).error(function (e) {
                    toastr.info(e);
                });


            return client.search({
                index: indices,
                type: type,
                size: pagecount,
                body: ejs.Request()
                    .query(ejs.QueryStringQuery(searchText))
                    .filter(ejs.RangeFilter("@timestamp").lte(end).gte(start))
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
                    toastr.info(e.Message);
                });


            return client.search({
                index: indices,
                type: type,
                size: pagecount,
                body: ejs.Request()
                    .query(ejs.MatchQuery(field, searchText))
                    .filter(ejs.RangeFilter("@timestamp").lte(end).gte(start))
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
                    toastr.info(e.Message);
                });


            var m = [];
            var n = [];
            var s = [];
            var time = ejs.RangeFilter("@timestamp").lte(end).gte(start);
            m.push(time);
            angular.forEach(condition, function (cc) {
                if (cc.condition === "MUST") {
                    var x = ejs.TermFilter(cc.field, cc.text);
                    m.push(x);
                }
                if (cc.condition === "MUST_NOT") {
                    var y = ejs.TermFilter(cc.field, cc.text);
                    n.push(y);
                }
                if (cc.condition === "SHOULD") {
                    var z = ejs.TermFilter(cc.field, cc.text);
                    s.push(z);
                }
            });


            var fmust = ejs.AndFilter(m);
            var fnot = ejs.AndFilter(n);
            var fshould = ejs.AndFilter(s);


            if (n.length < 1) {
                fnot = ejs.NotFilter(ejs.MatchAllFilter());
            }
            if (s.length < 1) {
                fshould = ejs.MatchAllFilter();
            }


            return client.search({
                index: indices,
                type: type,
                size: pagecount,
                body: ejs.Request()
                    .query(ejs.MatchQuery(field, searchText))
                    .filter(ejs.BoolFilter().must(fmust).mustNot(fnot).should(fshould))
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
                    toastr.info(e.Message);
                });


            var m = [];
            var n = [];
            var s = [];
            var time = ejs.RangeFilter("@timestamp").lte(end).gte(start);
            m.push(time);
            angular.forEach(condition, function (cc) {
                if (cc.condition === "MUST") {
                    var x = ejs.TermFilter(cc.field, cc.text);
                    m.push(x);
                }
                if (cc.condition === "MUST_NOT") {
                    var y = ejs.TermFilter(cc.field, cc.text);
                    n.push(y);
                }
                if (cc.condition === "SHOULD") {
                    var z = ejs.TermFilter(cc.field, cc.text);
                    s.push(z);
                }
            });


            var fmust = ejs.AndFilter(m);
            var fnot = ejs.AndFilter(n);
            var fshould = ejs.AndFilter(s);

            if (n.length < 1) {
                fnot = ejs.NotFilter(ejs.TermFilter("", ""));
            }
            if (s.length < 1) {
                fshould = ejs.MatchAllFilter();
            }


            return client.search({
                index: indices,
                type: type,
                size: pagecount,
                body: ejs.Request()
                    .query(ejs.QueryStringQuery(searchText))
                    .filter(ejs.BoolFilter().must(fmust).mustNot(fnot).should(fshould))
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