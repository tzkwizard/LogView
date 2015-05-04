(function () {
    'use strict';

    var serviceId = 'datasearch';
    angular.module('app').factory(serviceId, ['common', 'client', '$http', datasearch]);

    function datasearch(common, client, $http) {

        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);

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
            termQueryAggragation: termQueryAggragation,
            test: test
        }
        return service;
        //#endregion


        //#region Aggragation
        function dashboardPieAggregation(f1, f2, f3, start, end) {
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

            var remote = "https://microsoft-apiapp463245e7d2084cb79dbc3d162e7b94cb.azurewebsites.net/" + "api/ElasticAggragation/DateHistogram";
            var local = "http://localhost:1972/" + "api/ElasticAggragation/DateHistogram";
            return $http.post(local, ii)
              .success(function (resp) {
                  return resp;
              }).error(function (e) {
                  toastr.info(e);
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

            var remote = "https://microsoft-apiapp463245e7d2084cb79dbc3d162e7b94cb.azurewebsites.net/" + "api/ElasticAggragation/Term";
            var local = "http://localhost:1972/" + "api/ElasticAggragation/Term";
            return $http.post(local, ii)
              .success(function (resp) {
                  return resp;
              }).error(function (e) {
                  toastr.info(e);
              });



            ;


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

            var remote = "https://microsoft-apiapp463245e7d2084cb79dbc3d162e7b94cb.azurewebsites.net/" + "api/ElasticAggragation/StringQuery";
            var local = "http://localhost:1972/" + "api/ElasticAggragation/StringQuery";
            return $http.post(local, ii)
              .success(function (resp) {
                  return resp;
              }).error(function (e) {
                  toastr.info(e);
              });



            return client.search({
                index: indices,
                type: type,
                body: ejs.Request()
                    .query(ejs.QueryStringQuery(searchText))
                     .aggregation(ejs.FilterAggregation("ag").filter(ejs.RangeFilter("@timestamp").lte(end).gte(start)).aggregation(ejs.TermsAggregation("agg").field(aggfield).size(size)))


            });
        }

        function termQueryAggragation(indices, type, aggfield, size, start, end) {

            var info =
          {
              SubSize: size,
              Start: start,
              End: end,
              AggField: aggfield
          }

            var ii = angular.toJson(info);

            var remote = "https://microsoft-apiapp463245e7d2084cb79dbc3d162e7b94cb.azurewebsites.net/" + "api/ElasticAggragation/TermQuery";
            var local = "http://localhost:1972/" + "api/ElasticAggragation/TermQuery";
            return $http.post(local, ii)
              .success(function (resp) {
                  return resp;
              }).error(function (e) {
                  toastr.info(e);
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

        function getSampledata(indices, type, pagecount, start, end) {


            var info = {
                Type: type,
                Size: pagecount,
                Start: start,
                End: end
            }

            var remote = "https://microsoft-apiapp463245e7d2084cb79dbc3d162e7b94cb.azurewebsites.net/" + "api/ElasticSearch/SampleData";
            var local = "http://localhost:1972/" + "api/ElasticSearch/SampleData";
            var ii = angular.toJson(info);

            return $http.post(local, ii)
              .success(function (resp) {
                  toastr.info(resp);
                  return resp;
              }).error(function (e) {
                  toastr.info(e);
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


        function stringQuery(indices, type, pagecount, searchText, start, end) {

            var info = {
                Type: type,
                Size: pagecount,
                SearchText: searchText,
                Start: start,
                End: end
            }

            var remote = "https://microsoft-apiapp463245e7d2084cb79dbc3d162e7b94cb.azurewebsites.net/" + "api/ElasticSearch";
            var local = "http://localhost:1972/" + "api/ElasticSearch";
            var ii = angular.toJson(info);

            return $http.post(local, ii)
              .success(function (resp) {
                  toastr.info(resp);
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

        function termQuery(indices, type, pagecount, field, searchText, start, end) {

            var info = {
                Type: type,
                Size: pagecount,
                SearchText: searchText,
                Field: field,
                Start: start,
                End: end
            }

            var remote = "https://microsoft-apiapp463245e7d2084cb79dbc3d162e7b94cb.azurewebsites.net/" + "api/ElasticSearch/Term";
            var local = "http://localhost:1972/" + "api/ElasticSearch/Term";
            var ii = angular.toJson(info);

            return $http.post(local, ii)
              .success(function (resp) {
                  toastr.info(resp);
                  return resp;
              }).error(function (e) {
                  toastr.info(e);
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

        function termQueryWithBoolFilter(indices, type, pagecount, field, searchText, condition, start, end) {

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

        function stringQueryWithBoolFilter(indices, type, pagecount, field, searchText, condition, start, end) {

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
        function basicSearch(indices, type, pagecount, field, searchText, condition, start, end) {

            if (condition.length < 1) {
                if (field === "" || field === "all" || field === undefined) {
                    return stringQuery(indices, type, pagecount, searchText, start, end);
                } else {
                    return termQuery(indices, type, pagecount, field, searchText, start, end);
                }

            } else {
                if (field === "" || field === "all" || field === undefined) {
                    return stringQueryWithBoolFilter(indices, type, pagecount, field, searchText, condition, start, end);
                } else {
                    return termQueryWithBoolFilter(indices, type, pagecount, field, searchText, condition, start, end);
                }

            }
        }

        //#endregion


        //#region Deprecated

        function test(indices, type, pagecount, field, searchText, filterField, filter, condition, choice) {

            var stringQ = ejs.QueryStringQuery(searchText);

            var matchallF = ejs.QueryStringQuery(filter);
            var matchallFfalse = ejs.MatchAllQuery();
            var matchallFfalse2 = ejs.QueryStringQuery("");
            var termF = ejs.TermFilter(filterField, filter);
            var termFfalse = ejs.NotFilter(ejs.TermFilter(filterField, ""));
            var termFfalse2 = ejs.NotFilter(ejs.TermFilter(filterField, filter));
            var qmust = "";
            var qmust2 = "";
            var qmustnot = "";
            var fmust = "";

            switch (choice) {

                case 1:
                    {
                        qmust = stringQ;
                        if (condition === "MUST") {
                            qmust2 = matchallF;
                            qmustnot = matchallFfalse2;
                        } else {
                            qmust2 = matchallFfalse;
                            qmustnot = matchallF;
                        }
                        fmust = termFfalse;
                        break;
                    }

                case 2:
                    {
                        qmust = stringQ;
                        qmust2 = matchallFfalse;
                        if (condition === "MUST") {
                            fmust = termF;
                        } else {
                            fmust = termFfalse2;
                        }
                        qmustnot = matchallFfalse2;
                        break;
                    }


            }

            return client.search({
                index: indices,
                type: type,
                size: pagecount,
                body: ejs.Request()
                    .query(ejs.BoolQuery().must(qmust).must(qmust2).mustNot(qmustnot))
                    .filter(ejs.BoolFilter().must(fmust))
            });
        }
    }
    //#endregion

})();