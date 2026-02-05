namespace gis_backend.DTOs.Areas
{
    public class AreaListItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public bool IsGlobal { get; set; }
        public string GeomGeoJson { get; set; } = string.Empty;
    }
}
