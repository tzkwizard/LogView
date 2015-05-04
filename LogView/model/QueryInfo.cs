
using System;

namespace LogView.model
{
    public class QueryInfo
    {
        public string[] Index { get; set; }
        public string Type { get; set; }
        public int Size { get; set; }
        public string SearchText { get; set; }
        public string Field { get; set; }
        public string AggField { get; set; }
        public int SubSize { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Span { get; set; }
        public FilterInfo[] Filterdata { get; set; }
    }

    public class FilterInfo
    {
        public string Text { get; set; }
        public string Field { get; set; }
        public string Condition { get; set; }
    }
}
