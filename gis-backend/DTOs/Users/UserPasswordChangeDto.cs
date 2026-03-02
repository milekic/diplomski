using System.ComponentModel.DataAnnotations;

namespace gis_backend.DTOs.Users
{
    public class UserPasswordChangeDto
    {
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        [Compare(nameof(NewPassword), ErrorMessage = "Potvrda lozinke se ne poklapa.")]
        public string ConfirmNewPassword { get; set; } = string.Empty;
    }
}
