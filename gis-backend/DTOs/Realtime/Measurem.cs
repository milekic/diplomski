namespace gis_backend.DTOs.Realtime
{
    public class Measurem
    {
        public int EventTypeId { get; set; }
        public double Value { get; set; }
        public DateTime MeasuredAtUtc { get; set; }
    }
}
