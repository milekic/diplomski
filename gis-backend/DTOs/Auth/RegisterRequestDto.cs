using System.ComponentModel.DataAnnotations;

namespace gis_backend.DTOs.Auth
{
    public class RegisterRequestDto
    {
        [Required]
        [MaxLength(100)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(3)]
        public string Password { get; set; } = string.Empty;
    }
}
