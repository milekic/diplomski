using System.ComponentModel.DataAnnotations;

namespace gis_backend.DTOs.Areas
{
    public class AreaCreateRequestDto
    {
        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public bool IsGlobal { get; set; } = false;
        public bool IsMonitored { get; set; } = false;

        [Required]
        public string GeomGeoJson { get; set; } = string.Empty;
    }
}
