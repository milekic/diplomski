namespace gis_backend.DTOs.Realtime
{
    public class MeasurementRealtimeDto
    {
        public int AreaMonitorId { get; set; }
        public int AreaId { get; set; }
        public int EventTypeId { get; set; }

        public double Value { get; set; }
        public DateTime MeasuredAtUtc { get; set; }

        public double X { get; set; }
        public double Y { get; set; }
    }
}
