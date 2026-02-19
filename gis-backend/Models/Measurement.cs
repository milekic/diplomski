using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NetTopologySuite.Geometries;

namespace gis_backend.Models
{
    public class Measurement
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public int AreaMonitorId { get; set; }

        [ForeignKey(nameof(AreaMonitorId))]
        public AreaMonitor AreaMonitor { get; set; } = null!;

        [Required]
        public int AreaId { get; set; }

        [Required]
        public int EventTypeId { get; set; }

        [Required]
        public double Value { get; set; }

        [Required]
        public DateTime MeasuredAt { get; set; } = DateTime.UtcNow;

        [Required]
        public bool IsCritical { get; set; }

        public double? ThresholdAtThatTime { get; set; }
        
        [Required]
        public Point Location { get; set; } = null!;
    }
}
