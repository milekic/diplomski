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

        [Required]
        public bool IsActive { get; set; } = true;
    }
}
