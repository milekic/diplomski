namespace gis_backend.DTOs.AreaMonitors
{
    public class AreaMonitorSyncRequestDto
    {
        // eventTypeId -> threshold 
        public Dictionary<int, double?> Selected { get; set; } = new();
    }
}
