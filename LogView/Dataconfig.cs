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
        public void Ping()
        {
            const string elUri = "http://aotuo:123456@localhost:9200/";
            var Node = new Uri(elUri);
            var connectionPool = new SniffingConnectionPool(new[] { Node });
            var Settings = new ConnectionSettings(Node);

            var Client = new ElasticClient(Settings);

            var pp = Client.RootNodeInfo();
            if (pp.Status == 200)
            {
                Console.WriteLine("haha");
            }            
        }

        public void GetField()
        {
            const string elUri = "http://aotuo:123456@localhost:9200/";
            var Node = new Uri(elUri);
            var connectionPool = new SniffingConnectionPool(new[] { Node });
            var Settings = new ConnectionSettings(Node);

            var Client = new ElasticClient(Settings);
            var y = Client.GetFieldMapping<logs>(m=>m.Fields("*"));
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
