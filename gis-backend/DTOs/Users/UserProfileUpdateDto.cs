using System.ComponentModel.DataAnnotations;

namespace gis_backend.DTOs.Users
{
    public class UserProfileUpdateDto
    {
        [Required]
        [MaxLength(100)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;
    }
}
