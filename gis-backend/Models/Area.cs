using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NetTopologySuite.Geometries;

namespace gis_backend.Models
{
    public class Area
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        
        public bool IsGlobal { get; set; } = false;

        
        public bool IsActive { get; set; } = true;

        // id korisnika koji je krairao oblast
        [Required]
        public int OwnerUserId { get; set; }

        //ovo polje se nece cuvati u bazi
        [ForeignKey(nameof(OwnerUserId))]
        public User OwnerUser { get; set; } = null!;

   
        [Required]
        public Polygon Geom { get; set; } = null!;
    }
}
