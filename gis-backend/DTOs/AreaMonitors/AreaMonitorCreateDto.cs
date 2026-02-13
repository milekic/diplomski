using System.ComponentModel.DataAnnotations;

namespace gis_backend.DTOs.AreaMonitors
{
    public class AreaMonitorCreateDto
    {
        [Required]
        public int AreaId { get; set; }


        [Required]
        public int EventTypeId { get; set; }

        [Required]
        public double Threshold { get; set; }
    }
}
