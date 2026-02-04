using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gis_backend.Models
{
  //ova klasa predstavlja vezu  vise : vise  izmedju Area i EventType
    public class AreaMonitor
    {
        [Key]
        public int Id { get; set; }

        
        [Required]
        public int AreaId { get; set; }

        [ForeignKey(nameof(AreaId))]
        public Area Area { get; set; } = null!;

       
        [Required]
        public int EventTypeId { get; set; }

        [ForeignKey(nameof(EventTypeId))]
        public EventType EventType { get; set; } = null!;

        // omogucava da korisnik npr. ne prati dogadjaj Poplava u Krajini
        //omogucava da odredimo da li se ovaj dogadjaj prati za ovu oblast
        [Required]
        public bool IsActive { get; set; } = true;

       
    }
}
