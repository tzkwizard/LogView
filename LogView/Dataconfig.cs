using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Elasticsearch.Net.Connection;
using Elasticsearch.Net.ConnectionPool;
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



    }
}
