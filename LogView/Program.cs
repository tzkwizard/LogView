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
        public static Uri Node;
        public static ConnectionSettings Settings;
        public static ElasticClient Client;
        // public static ElasticsearchClient Client;
        public static int Escount;
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
                Start = DateTime.Now.AddDays(-22),
                AggField = "geoip.real_region_name.raw",
                Span = "day",
                SubSize = 5
            };
            

            DataConfig dataConfig=new DataConfig();
            dataConfig.Ping();
            dataConfig.GetField();

            


            var type = "logs";
            var pagecount = 150000;
            var searchText = "london";
            var field = "verb";
            DateTime end = DateTime.Now;
            DateTime start = end.AddDays(-7);
            DataService dataService = new DataService();


            
            // dataService.StringQuery(q);
           // dataService.GetSampledata(q);
            //dataService.TermQuery(q);
           // dataService.TermAggragation(q);
           // dataService.TermAggragationwithQuery(q);
           // dataService.DateHistogramAggregation(q);
           // dataService.TermQueryAggragation(q);
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



            Node = new Uri(elUri);
            var connectionPool = new SniffingConnectionPool(new[] { Node });
            Settings = new ConnectionSettings(Node);
            Client = new ElasticClient(Settings);
            var indexsettings = new IndexSettings();
            indexsettings.NumberOfReplicas = 1;
            indexsettings.NumberOfShards = 5;

            Client.CreateIndex(c => c
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
            Client.Index(newPost);
            Console.WriteLine("inserted data");

        }

        public static void Termquery()
        {
            var result = Client.Search<logs>(s => s
                         .Size(Escount)
                         .Query(p => p.QueryString(q => q.Query("ca")))
                //.Query(p => p.Term("logs.geoip.city_name.raw", "Beijing"))
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
            var res = Client.Search<activitylog>(s => s
                           .Query(q => q.MatchPhrase(m => m.OnField("ipAddress").Query("1"))));
        }

        public void Fillter()
        {
            var res2 = Client.Search<activitylog>(s => s
                .Query(q => q.Term(p => p.Desciption, "azure"))
                .Filter(f => f.Range(r => r.OnField("ipAddress").Greater("0"))));

        }

    }
}
