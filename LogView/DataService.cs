using System;
using System.Collections;
using System.Collections.Generic;
using Elasticsearch.Net.Connection;
using Elasticsearch.Net.ConnectionPool;
using LogView.model;
using Nest;

namespace LogView
{
    class DataService
    {
        private static ElasticClient _client;
        public DataService()
        {
            if (_client == null || _client.RootNodeInfo().Status != 200)
            {
                const string elUri = "http://localhost:9200/";
                var node = new Uri(elUri);
                var connectionPool = new SniffingConnectionPool(new[] {node});
                var settings = new ConnectionSettings(node).SetBasicAuthentication("aotuo", "123456");
                _client = new ElasticClient(settings);
            }
        }

        #region Filter
        public void StringQuery(QueryInfo q)
        {
            var result = _client.Search<logs>(s => s
                          //.Indices(new [] {"1","2"})
                          .From(0)
                          .Size(20)
                         .Query(p => p.QueryString(qs => qs.Query(q.SearchText)))
                //.Query(p => p.Term("logs.geoip.city_name.raw", "Beijing"))
                         .Filter(f => f.Range(t => t.OnField("@timestamp").Greater(q.Start).Lower(q.End)))
                         );

            //var n = 1;
            Console.WriteLine(result.HitsMetaData.Total + "-----" + result.ElapsedMilliseconds);
            foreach (var x in result.Documents)
            {
                /*n++;
                Console.WriteLine(x.clientip+"------" + n);*/
            }
        }

        public void GetSampledata(QueryInfo q)
        {
            var result = _client.Search<logs>(s => s
                         .Size(q.Size)
                         .Query(qq => qq.MatchAll())
                         .Filter(f => f.Range(t => t.OnField("@timestamp").Greater(q.Start).Lower(q.End)))
                         );
            Console.WriteLine(result.HitsMetaData.Total + "-----" + result.ElapsedMilliseconds);
            var n = 1;
            foreach (var x in result.Documents)
            {
                n++;
                Console.WriteLine(x.clientip+"------" + n);
            }
        }

        public void TermQuery(QueryInfo q)
        {


            var result = _client.Search<logs>(s => s
                         .Size(q.Size)
                         .Query(qt => qt.Term(q.Field, q.SearchText))
                //.Filter(f=>f.Bool(b=>b.Must().MustNot().Should()))
                         .Filter(f => f.Range(t => t.OnField("@timestamp").Greater(q.Start).Lower(q.End)))
                         );
            Console.WriteLine(result.HitsMetaData.Total + "-----" + result.ElapsedMilliseconds);

        }
        #endregion



        #region Aggragation
        public void TermAggragation(QueryInfo q)
        {
            var result = _client.Search<logs>(s => s
                        .Size(q.Size)
                        .Aggregations(fa => fa
                            .Filter("ff", f => f
                                .Filter(fd => fd
                                    .Range(t => t
                                        .OnField("@timestamp").Greater(q.Start).Lower(q.End)))
                                        .Aggregations(a => a.Terms("agg", ag => ag.Field(q.AggField)))

                                         )
                                        )

                        );
            var ff=result.Aggs.Filter("ff");
            var fagg = ff.Terms("agg");
            Console.WriteLine(result.HitsMetaData.Total + "-----" + result.ElapsedMilliseconds);
            foreach (var x in fagg.Items)
            {
                
                Console.WriteLine(x.Key+"------" + x.DocCount);
            }

        }

        public void TermAggragationwithQuery(QueryInfo q)
        {
            var result = _client.Search<logs>(s => s
                       .Size(q.Size)
                       .Query(p => p.QueryString(qs => qs.Query(q.SearchText)))
                       .Aggregations(fa => fa
                           .Filter("ff", f => f
                               .Filter(fd => fd
                                   .Range(t => t
                                       .OnField("@timestamp").Greater(q.Start).Lower(q.End)))
                                       .Aggregations(a => a.Terms("agg", ag => ag.Field(q.AggField)))

                                        )
                                       )

                       );
            var ff = result.Aggs.Filter("ff");
            var fagg = ff.Terms("agg");
            Console.WriteLine(result.HitsMetaData.Total + "-----" + result.ElapsedMilliseconds);
            foreach (var x in fagg.Items)
            {

                Console.WriteLine(x.Key + "------" + x.DocCount);
            }
        }


        public void DateHistogramAggregation(QueryInfo q)
        {
            var result = _client.Search<logs>(s => s
                      .Size(q.Size)
                      .Aggregations(fa => fa
                          .Filter("ff", f => f
                                  .Filter(fd => fd.Range(t => t.OnField("@timestamp").Greater(q.Start).Lower(q.End)))
                                  .Aggregations(a => a.DateHistogram("agg", ag => ag.Field("@timestamp").Interval(q.Span)))
                                       )));
            var ff = result.Aggs.Filter("ff");
            var fagg = ff.DateHistogram("agg");
            Console.WriteLine(result.HitsMetaData.Total + "-----" + result.ElapsedMilliseconds);
            foreach (var x in fagg.Items)
            {
               
                Console.WriteLine(x.Date + "------" + x.DocCount);
            }
        }



        public void TermQueryAggragation(QueryInfo q)
        {
            var result = _client.Search<logs>(s => s
                       .Size(q.Size)
                       .Query(p => p.Term("geoip.country_code3.raw", "USA"))
                       .Aggregations(fa => fa
                           .Filter("ff", f => f
                               .Filter(fd => fd
                                   .Range(t => t
                                       .OnField("@timestamp").Greater(q.Start).Lower(q.End)))
                                       .Aggregations(a => a.Terms("agg", ag => ag.Field(q.AggField).Size(3)))

                                        )
                                       )

                       );
            var ff = result.Aggs.Filter("ff");
            var fagg = ff.Terms("agg");
            Console.WriteLine(result.HitsMetaData.Total + "-----" + result.ElapsedMilliseconds);
            foreach (var x in fagg.Items)
            {

                Console.WriteLine(x.Key + "------" + x.DocCount);
            }
        }


        public void DashboardPieAggregation(QueryInfo q)
        {


            foreach (var agg in q.MultiField)
            {
                var result = _client.Search<logs>(s => s
                    .Size(q.Size)
                    .Aggregations(fa => fa
                        .Filter("ff", f => f
                            .Filter(fd => fd
                                .Range(t => t
                                    .OnField("@timestamp").Greater(q.Start).Lower(q.End)))
                            .Aggregations(a => a.Terms("agg", ag => ag.Field(agg)))

                        )
                    ));
                var ff = result.Aggs.Filter("ff");
                var fagg = ff.Terms("agg");
               


            }

            

        }

         

        #endregion

        public void TermQueryWithBoolFilter(QueryInfo q)
        {
            /*var condition = new string[] {"4", "3", "2"};
            var m= new List<object>();

            var yy;

            FilterDescriptor<logs> d=new FilterDescriptor<logs>();
            yy = d.Term("", "");
            FilterDescriptor<logs> dd = new FilterDescriptor<logs>();
            foreach (var x in condition)
            {
                yy = d.Term("", "");
                d = d.And(yy);
                d = (FilterDescriptor<logs>) d.And(dd);
            }*/
            /*   var fmust = _client.Search<logs>(s => s.Filter(f =>f.And(d)
               ));

               var result = _client.Search<logs>(s => s
                           .Size(q.Size)
                           .Query(qt => qt.Term(q.Field, q.SearchText))
                           .Filter(f => f.Bool(b => b.Must(fm => fm.Range(t => t.OnField("@timestamp").Greater(q.Start).Lower(q.End))).MustNot().Should()))
                       
                           );
               Console.WriteLine(result.HitsMetaData.Total + "-----" + result.ElapsedMilliseconds);*/
        }

         /*var m = [];
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
            });*/
    }
}
