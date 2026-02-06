using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gis_backend.Models
{
  //ova klasa predstavlja vezu  vise : vise  izmedju Area i EventType
    public class AreaMonitor
    {
        [Key]
        public int Id { get; set; }

        //ogranicenje - u dbContext-u
        [Required]
        public int AreaId { get; set; }

        [ForeignKey(nameof(AreaId))]
        public Area Area { get; set; } = null!;

       
        [Required]
        public int EventTypeId { get; set; }

        [ForeignKey(nameof(EventTypeId))]
        public EventType EventType { get; set; } = null!;

        // Vrijeme kada je pracenje pocelo
        [Required]
        public DateTime ActiveFrom { get; set; } = DateTime.UtcNow;

        // Vrijeme kada je pracenje zavrsilo (ako je null => jos uvijek aktivno)
        public DateTime? ActiveTo { get; set; }

        // Kritični prag (npr 40°C, 3m, 6 Richter...) - alarm se aktivira kad se taj prag prekoraci
        public double? Threshold { get; set; }


    }
}
