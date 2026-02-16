namespace gis_backend.DTOs.AreaMonitors
{
    public class AreaMonitorSimpleDto
    {
        public int Id { get; set; }         

        public DateTime ActiveFrom { get; set; }

        public DateTime? ActiveTo { get; set; }

        public double? Threshold { get; set; }
    }
}
