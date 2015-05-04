using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Elasticsearch.Net.Connection;
using Elasticsearch.Net.ConnectionPool;
using LogView.model;
using Nest;

namespace LogView
{
    class DataConfig
    {
         private static ElasticClient _client;
         public DataConfig()
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
        public void Ping()
        {
            var pp = _client.RootNodeInfo();
            if (pp.Status == 200)
            {
                Console.WriteLine("haha");
            }            
        }

        public void GetField()
        {

            var y = _client.GetFieldMapping<logs>(m=>m.Fields("*"));
            var z = y.Indices;
            var ss = true;
            foreach (var x in z)
            {               
                if (ss)
                {
                    var mm = x.Value.Mappings["logs"].Values;
                    ss = false;
                    foreach (var f in mm)
                    {
                        Console.WriteLine(f.FullName);
                    }
                }
                Console.WriteLine(x.Key);
            }
           
        }



    }
}
