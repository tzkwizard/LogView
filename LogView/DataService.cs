using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LogView.model;
using Nest;

namespace LogView
{
    class DataService
    {
        #region Filter
        public void StringQuery(ElasticClient client, string indices, string type, int pagecount, string searchText, DateTime start, DateTime end)
        {
            var result = client.Search<logs>(s => s
                          //.Indices(new [] {"1","2"})
                         .Size(pagecount)
                         .Query(p => p.QueryString(q => q.Query(searchText)))
                //.Query(p => p.Term("logs.geoip.city_name.raw", "Beijing"))
                         .Filter(f => f.Range(t => t.OnField("@timestamp").Greater(start).Lower(end)))
                         );

            var n = 1;
            Console.WriteLine(result.HitsMetaData.Total + "-----" + result.ElapsedMilliseconds);
            foreach (var x in result.Documents)
            {
                /*n++;
                Console.WriteLine(x.clientip+"------" + n);*/
            }
        }

        public void GetSampledata(ElasticClient client, string indices, string type, int pagecount,
            DateTime start, DateTime end)
        {
            var result = client.Search<logs>(s => s
                         .Size(pagecount)
                         .Query(q => q.MatchAll())
                         .Filter(f => f.Range(t => t.OnField("@timestamp").Greater(start).Lower(end)))
                         );
            Console.WriteLine(result.HitsMetaData.Total + "-----" + result.ElapsedMilliseconds);

        }

        public void TermQuery(ElasticClient client, string indices, string type, int pagecount, string searchText, string field,
           DateTime start, DateTime end)
        {


            var result = client.Search<logs>(s => s
                         .Size(pagecount)
                         .Query(q => q.Term(field, searchText))
                //.Filter(f=>f.Bool(b=>b.Must().MustNot().Should()))
                         .Filter(f => f.Range(t => t.OnField("@timestamp").Greater(start).Lower(end)))
                         );
            Console.WriteLine(result.HitsMetaData.Total + "-----" + result.ElapsedMilliseconds);

        }
        #endregion

        #region Aggragation
        public void TermAggragation(ElasticClient client, string indices, string type, string aggfield, int size,
            DateTime start, DateTime end)
        {
            var result = client.Search<logs>(s => s
                        .Size(size)
                        .Query(q => q.MatchAll())
                        .Aggregations(fa => fa
                            .Filter("ff", f => f
                                .Filter(fd => fd
                                    .Range(t => t
                                        .OnField("@timestamp").Greater(start).Lower(end)))
                                        .Aggregations(a => a.Terms("agg", ag => ag.Field(aggfield)))

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

        public void TermAggragationwithQuery(ElasticClient client, string indices, string type, string aggfield, int size, string searchText,
            DateTime start, DateTime end)
        {
            var result = client.Search<logs>(s => s
                       .Size(size)
                       .Query(p => p.QueryString(q => q.Query(searchText)))
                       .Aggregations(fa => fa
                           .Filter("ff", f => f
                               .Filter(fd => fd
                                   .Range(t => t
                                       .OnField("@timestamp").Greater(start).Lower(end)))
                                       .Aggregations(a => a.Terms("agg", ag => ag.Field(aggfield)))

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
      
        
        public void DateHistogramAggregation(ElasticClient client, string indices, string type, string aggfield,
            string span, DateTime start, DateTime end)
        {
            var result = client.Search<logs>(s => s
                      .Size(150000)
                      .Aggregations(fa => fa
                          .Filter("ff", f => f
                                  .Filter(fd => fd.Range(t => t.OnField("@timestamp").Greater(start).Lower(end)))
                                  .Aggregations(a => a.DateHistogram("agg", ag => ag.Field("@timestamp").Interval("day")))
                                       )));
            var ff = result.Aggs.Filter("ff");
            var fagg = ff.DateHistogram("agg");
            Console.WriteLine(result.HitsMetaData.Total + "-----" + result.ElapsedMilliseconds);
            foreach (var x in fagg.Items)
            {
               
                Console.WriteLine(x.Date + "------" + x.DocCount);
            }
        }
        #endregion



    }
}
