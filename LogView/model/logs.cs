﻿using System.Collections.Generic;

namespace LogView.model
{   
        public class logs
        {
            public string APIresponse { get; set; }

            public string action { get; set; }
            public string agent { get; set; }
            public string auth { get; set; }
            public string edata { get; set; }
            public string host { get; set; }
            public string message { get; set; }
            public string referrer { get; set; }
            public string request { get; set; }
            public string response { get; set; }

            public Geoip geoip { get; set; }
            public string tags { get; set; }
            public string timestamp { get; set; }
            public string verb { get; set; }
            public string ident { get; set; }
            public string clientip { get; set; }
            public string bytes { get; set; }
        }

    public class Geoip
    {
        public double area_code { get; set; }
        public string city_name { get; set; }
        public string continent_code { get; set; }
        public List<double> coordinates { get; set; }
        public string country_code2 { get; set; }
        public string country_code3 { get; set; }
        public string country_name { get; set; }

        public double dma_code { get; set; }
        public double latitude { get; set; }
        public double longitude { get; set; }
        public string postal_code { get; set; }
        public string region_name { get; set; }
        public string real_region_name { get; set; }
        public string timezone { get; set; }





        
    }
    
}
