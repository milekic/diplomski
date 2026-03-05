namespace gis_backend.DTOs.Areas
{
    public class AreaMeasurementsSummaryDto
    {
        public int AreaId { get; set; }
        public string AreaName { get; set; } = string.Empty;
        public int CriticalCount { get; set; }
        public int NormalCount { get; set; }
        public int TotalCount => CriticalCount + NormalCount;
    }
}
