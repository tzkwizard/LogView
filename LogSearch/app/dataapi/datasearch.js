(function () {
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
            stringSearch: stringSearch,
            searchWithoutFilter: searchWithoutFilter,
            basicSearch: basicSearch,
            stringquery: stringquery,
            termqueryandfilter: termqueryandfilter,
            getFieldsample: getFieldsample,
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
        function stringquery(indices, type, pagecount, field, searchText, filterField, filter, condition, choice) {

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

        function getFieldsample() {

            return client.search({
                index: indices,
                //type: type,
                size: pagecount,
                body:
                    ejs.Request()
                        .query(ejs.MatchAllQuery())

            });
        }

        function stringSearch(indices, type, pagecount, searchText, start, end) {

            return client.search({
                index: indices,
                type: type,
                size: pagecount,
                body: ejs.Request()
                    .query(ejs.QueryStringQuery(searchText))
                   .filter(ejs.RangeFilter("@timestamp").lte(end).gte(start))
            });
        }

        function searchWithoutFilter(indices, type, pagecount, field, searchText, start, end) {
            return client.search({
                index: indices,
                type: type,
                size: pagecount,
                body: ejs.Request()
                    .query(ejs.MatchQuery(field, searchText))
                   .filter(ejs.RangeFilter("@timestamp").lte(end).gte(start))
            });
        }

        function termqueryandfilter(indices, type, pagecount, field, searchText, filterField, filter, condition, start, end) {
            /*  if (field === "" || field === "all") {
                // mSearch(searchText); 
                return stringSearch(indices, type, pagecount, searchText);
                
            }
            if (filter === "" || filterField === "" || filterField === "all") {
                return searchWithoutFilter(indices, type, pagecount, field, searchText);
            }
            */
            var fmust;
            var ftrue = ejs.TermFilter(filterField, filter);
            var fmustfalse = ejs.NotFilter(ejs.TermFilter(filterField, ""));
            var fnotmust;

            var fnotmustfalse = ejs.TermFilter(filterField, "");
            var fshould;

            var fshouldfalse = ejs.NotFilter(ejs.TermFilter(filterField, ""));

            if (condition === "MUST") {
                fmust = ftrue;
                fnotmust = fnotmustfalse;
                fshould = fshouldfalse;
            } else if (condition === "MUST_NOT") {
                fmust = fmustfalse;
                fnotmust = ftrue;
                fshould = fshouldfalse;
            } else {
                fmust = fmustfalse;
                fnotmust = fnotmustfalse;
                fshould = ftrue;
            }

            return client.search({
                index: indices,
                type: type,
                size: pagecount,
                body: ejs.Request()
                    .query(ejs.MatchQuery(field, searchText))
                    //.filter(ejs.TermFilter(filterField, filter))
                    //.filter(ejs.BoolFilter().mustNot(mmm))
                    .filter(ejs.BoolFilter().must(fmust).mustNot(fnotmust).should(fshould))
                    .filter(ejs.RangeFilter("@timestamp").lte(end).gte(start))
            });
        }
        //#endregion


        //#region Main search 
        function basicSearch(indices, type, pagecount, field, searchText, filterField, filter, condition, start, end) {

            if (filter === "" || filter === undefined) {
                if (field === "" || field === "all" || field === undefined) {
                    return stringSearch(indices, type, pagecount, searchText, start, end);
                } else {
                    return searchWithoutFilter(indices, type, pagecount, field, searchText, start, end);
                }

            } else {
                if (searchText === "" || searchText === undefined) {
                    if (filterField === "" || filterField === "all" || filterField === undefined) {
                        return stringSearch(indices, type, pagecount, searchText, start, end);
                    } else {
                        return termqueryandfilter(indices, type, pagecount, field, searchText, filterField, filter, condition, 1, start, end);
                    }
                } else {
                    if (field === "" || field === "all" || field === undefined) {
                        if (filterField === "" || filterField === "all" || filterField === undefined) {
                            return stringquery(indices, type, pagecount, field, searchText, filterField, filter, condition, 1, start, end);
                        } else {
                            return stringquery(indices, type, pagecount, field, searchText, filterField, filter, condition, 2, start, end);
                        }
                    } else {
                        if (filterField === "" || filterField === "all" || filterField === undefined) {
                            return termqueryandfilter(indices, type, pagecount, field, searchText, filterField, filter, condition, 2, start, end);
                        } else {
                            return termqueryandfilter(indices, type, pagecount, field, searchText, filterField, filter, condition, 3, start, end);
                        }
                    }

                }

            }
        }

        //#endregion
    }

})();