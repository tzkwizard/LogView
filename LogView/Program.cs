using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Elasticsearch.Net.Connection;
using Elasticsearch.Net.ConnectionPool;
using ElasticSearch;
using LogView.model;
using Nest;

namespace LogView
{
    class Program
    {
        private static Uri _node;
        private static ConnectionSettings _settings;
        private static ElasticClient _client;
        static void Main(string[] args)
        {

            Program p = new Program();

            /* const string elUri = "http://aotuo:123456@localhost:9200/";
             Node = new Uri(elUri);
             var connectionPool = new SniffingConnectionPool(new[] { Node });
             Settings = new ConnectionSettings(Node);
             var config = new ConnectionConfiguration(connectionPool)
                 .EnableTrace()
                 .ExposeRawResponse()
                 .SetBasicAuthentication("aotuo", "123456")
                 .SetTimeout(4000);

             Client = new ElasticClient(Settings);*/

            #region Test

            QueryInfo q = new QueryInfo
            {
                Type = "logs",
                Size = 150,
                SearchText = "london",
                Field = "geoip.city_name",
                End = DateTime.Now,
                Start = DateTime.Now.AddDays(-32),
                AggField = "geoip.real_region_name.raw",
                Span = "day",
                SubSize = 5,
                MultiField = new string[] { "verb", "geoip.city_name.raw", "request.raw" }
            };

          


            DataConfig dataConfig=new DataConfig();
            dataConfig.Ping();
            dataConfig.GetField();

         
            DataService dataService = new DataService();


            
//dataService.StringQuery(q);
           // dataService.GetSampledata(q);
            //dataService.TermQuery(q);
           // dataService.TermAggragation(q);
           // dataService.TermAggragationwithQuery(q);
           // dataService.DateHistogramAggregation(q);
           // dataService.TermQueryAggragation(q);
            //dataService.DashboardPieAggregation(q);
            dataService.GeoDistanceAggragation(q);
            #endregion




            #region Deprecated
            /*
            var newPost = new activitylog
            {
                IpAddress = "21",
                Time = DateTime.Now.ToString(CultureInfo.CurrentCulture),
                Desciption = "azure"
            };
              Client.Index(newPost, i => i
                 .Index("azure")
                  .Type("activitylog")
            );
           
            var indexsettings = new IndexSettings();*/

            /* try
             {
                 var res = Client.Count(c=>c.AllIndices().Type("logs"));
                 var res2 =Client.Search<object>(s => s.AllIndices()
                 .From(0)
                 .Size(50)
                 .Query(q =>q.Term("ident","BingLi"))      
                 );

                 Console.WriteLine(res.Count);
                 Escount = (int)res.Count;
             }
             catch (Exception)
             {
                 Console.WriteLine("error");
             }
             Termquery();*/
            #endregion



            Console.ReadLine();

        }

        public void CreateIndex(string name, string elUri)
        {



            _node = new Uri(elUri);
            var connectionPool = new SniffingConnectionPool(new[] { _node });
            _settings = new ConnectionSettings(_node);
            _client = new ElasticClient(_settings);
            var indexsettings = new IndexSettings();
            indexsettings.NumberOfReplicas = 1;
            indexsettings.NumberOfShards = 5;

            _client.CreateIndex(c => c
                .Index(name)
                .InitializeUsing(indexsettings)
                .AddMapping<activitylog>(m => m.MapFromAttributes()));
        }

        public static void InsertData()
        {
            var newPost = new activitylog
            {
                IpAddress = "21",
                Time = DateTime.Now.ToString(CultureInfo.CurrentCulture),
                Desciption = "azure elastic 1"
            };
            _client.Index(newPost);
            Console.WriteLine("inserted data");

        }

        public static void Termquery()
        {
            var result = _client.Search<logs>(s => s
                         .Query(p => p.QueryString(q => q.Query("ca")))
                         .Filter(f => f.Range(t => t.OnField("@timestamp").Greater("2015-4-23")))
                         );

            var n = 1;
            foreach (var x in result.Documents)
            {
                n++;
                Console.WriteLine(x.clientip + n);
            }

        }

        public void MathPhrase()
        {
            var res = _client.Search<activitylog>(s => s
                           .Query(q => q.MatchPhrase(m => m.OnField("ipAddress").Query("1"))));
        }

        public void Fillter()
        {
            var res2 = _client.Search<activitylog>(s => s
                .Query(q => q.Term(p => p.Desciption, "azure"))
                .Filter(f => f.Range(r => r.OnField("ipAddress").Greater("0"))));

        }

    }
}
