using gis_backend.Models.Enums;
using System.ComponentModel.DataAnnotations;


namespace gis_backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string userName { get; set; }

        [Required]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public UserRole Role { get; set; } = UserRole.USER;

        public bool IsSuspended { get; set; } = false;

    }
}
