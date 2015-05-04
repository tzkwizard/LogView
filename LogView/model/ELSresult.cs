using System.Collections.Generic;
using Nest;

namespace LogView.model
{
    public class ELSresult
    {
        public int Total { set; get; }
        public IEnumerable<IHit<logs>> Data { set; get; }
        public IList<KeyItem> AggData { get; set; }
        public IList<HistogramItem> DateHistData { get; set; }
    }
}
