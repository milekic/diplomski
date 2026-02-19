using System.ComponentModel.DataAnnotations;

namespace gis_backend.Models
{
    public class EventType
    {
        [Key]
        public int Id { get; set; }

        // npr. "Poplava", Name je jedinstven
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }
        // Jedinica mjerenja (m, °C, Richter, m2...)
        [Required]
        [MaxLength(50)]
        public string Unit { get; set; } = string.Empty;
        [Required]
        public bool IsActive { get; set; } = true;
        public double? MinThreshold { get; set; }
        public double? MaxThreshold { get; set; }

    }
}
