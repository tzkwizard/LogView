﻿(function () {
    'use strict';

    var serviceId = 'datasearch';
    angular.module('app').factory(serviceId, ['common', 'client', datasearch]);

    function datasearch(common, client) {

        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);

        //#region service
        var service = {
            getSampledata: getSampledata,
            stringSearch: stringQuery,
            searchWithoutFilter: termQuery,
            basicSearch: basicSearch,
            stringquery: test,
            termQueryWithBoolFilter: termQueryWithBoolFilter,
            stringQueryWithBoolFilter: stringQueryWithBoolFilter,
            termAggragation: termAggragation,
            termAggragationwithQuery: termAggragationwithQuery,
            dateHistogramAggregation: dateHistogramAggregation
        }
        return service;
        //#endregion


        //#region Aggragation
        function dateHistogramAggregation(index, type, aggfield, span, start, end) {
            return client.search({
                index: index,
                type: type,
                body: ejs.Request()
                    .aggregation(ejs.FilterAggregation("ag").aggregation(ejs.DateHistogramAggregation("agg").field(aggfield).interval(span)).filter(ejs.RangeFilter("@timestamp").lte(end).gte(start)))
                // .aggregation(ejs.DateHistogramAggregation("agg").field(aggfield).interval(span))
                //  .filter(ejs.RangeFilter("@timestamp").lte(end).gte(start))
                //.format("yyyy-MM-dd")

            });
        }

        function termAggragation(indices, type, aggfield, size, start, end) {
            return client.search({
                index: indices,
                type: type,
                body:
                    ejs.Request()
                        .query(ejs.MatchAllQuery())
                         .aggregation(ejs.FilterAggregation("ag").filter(ejs.RangeFilter("@timestamp").lte(end).gte(start)).aggregation(ejs.TermsAggregation("agg").field(aggfield).size(size)))
                //.aggregation(ejs.TermsAggregation("agg").field(aggfield).size(size))
                // .filter(ejs.RangeFilter("@timestamp").lte(end).gte(start))
            });

        }

        function termAggragationwithQuery(indices, type, aggfield, size, searchText, start, end) {
            return client.search({
                index: indices,
                type: type,
                body: ejs.Request()
                    .query(ejs.QueryStringQuery(searchText))
                     .aggregation(ejs.FilterAggregation("ag").filter(ejs.RangeFilter("@timestamp").lte(end).gte(start)).aggregation(ejs.TermsAggregation("agg").field(aggfield).size(size)))

                //  .aggregation(ejs.TermsAggregation("agg").field(aggfield).size(size))
                // .filter(ejs.RangeFilter("@timestamp").lte(end).gte(start))

            });
        }
        //#endregion


        //#region Filter

        function getSampledata(indices, type, pagecount, start, end) {
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
            return client.search({
                index: indices,
                type: type,
                size: pagecount,
                body: ejs.Request()
                    .query(ejs.MatchQuery(field, searchText))
                   .filter(ejs.RangeFilter("@timestamp").lte(end).gte(start))
            });
        }

        function termQueryWithBoolFilter(indices, type, pagecount, field, searchText, filterField, filter, condition, start, end) {

            var m = [];
            var n = [];
            var s = [];
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

            if (m.length < 1) {
                fmust = ejs.MatchAllFilter();
            }
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
                //.filter(ejs.RangeFilter("@timestamp").lte(end).gte(start))
            });
        }

        function stringQueryWithBoolFilter(indices, type, pagecount, field, searchText, filterField, filter, condition, start, end) {

            var m = [];
            var n = [];
            var s = [];
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

            if (m.length < 1) {
                fmust = ejs.MatchAllFilter();
            }
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
                    .query(ejs.QueryStringQuery(searchText))
                    .filter(ejs.BoolFilter().must(fmust).mustNot(fnot).should(fshould))
                //.filter(ejs.RangeFilter("@timestamp").lte(end).gte(start))
            });
        }

        //#endregion


        //#region Main search 
        function basicSearch(indices, type, pagecount, field, searchText, filterField, filter, condition, start, end) {

            if (condition.length < 1) {
                if (field === "" || field === "all" || field === undefined) {
                    return stringQuery(indices, type, pagecount, searchText, start, end);
                } else {
                    return termQuery(indices, type, pagecount, field, searchText, start, end);
                }

            } else {
                if (field === "" || field === "all" || field === undefined) {
                    return stringQueryWithBoolFilter(indices, type, pagecount, field, searchText, filterField, filter, condition, start, end);
                } else {
                    return termQueryWithBoolFilter(indices, type, pagecount, field, searchText, filterField, filter, condition, start, end);
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