using System.ComponentModel.DataAnnotations;

namespace gis_backend.DTOs.Areas
{
    public class AreaUpdateRequestDto
    {
        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public bool IsGlobal { get; set; }
        public bool IsMonitored { get; set; }

        [Required]
        public string GeomGeoJson { get; set; } = string.Empty;
    }
}
