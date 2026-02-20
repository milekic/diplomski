namespace gis_backend.DTOs.Realtime
{
    public class MeasurementDto
    {
        public int AreaMonitorId { get; set; }
        public int AreaId { get; set; }
        public int EventTypeId { get; set; }

        public double Value { get; set; }
        public DateTime MeasuredAt { get; set; }

        public bool IsCritical { get; set; }
        public double? ThresholdAtThatTime { get; set; }

        public double X { get; set; }
        public double Y { get; set; }
    }
}
