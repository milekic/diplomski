using gis_backend.DTOs;
using System.Runtime.CompilerServices;
using gis_backend.Models;

namespace gis_backend.Mappers
{
    public static class UserMapper
    {
        public static UserDto ToDto(this User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.userName,
                Email = user.Email,
                Role = user.Role.ToString(),
                IsSuspended = user.IsSuspended,
            };

            return null;
        }
    }
}
