﻿namespace ElasticSearch
{
    public class activitylog
    {
       /* public ActivityLog(string ipAddress,string time,string desciption)
        {
            this.Desciption = desciption;
            this.Time = time;
            this.IpAddress = ipAddress;
        }*/

        public string IpAddress { get; set; }
        public string Time { get; set; }
        public string Desciption { get; set; } 
    }
 
}