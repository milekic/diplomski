using System;
using System.ComponentModel.DataAnnotations;

namespace gis_backend.DTOs.AreaMonitors
{
    public class AreaMonitorUpdateDto
    {
        // Vrijeme završetka praćenja (može biti null ako ostaje aktivno)
        public DateTime? ActiveTo { get; set; }

        [Required]
        public double Threshold { get; set; }
    }
}
