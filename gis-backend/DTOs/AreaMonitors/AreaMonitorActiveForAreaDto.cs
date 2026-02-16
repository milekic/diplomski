namespace gis_backend.DTOs.AreaMonitors
{
    public class AreaMonitorActiveForAreaDto
    {
        public int Id { get; set; }          // AreaMonitorId
        public int EventTypeId { get; set; } 
        public double? Threshold { get; set; }
    }
}
