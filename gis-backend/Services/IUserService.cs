using gis_backend.DTOs.Users;

namespace gis_backend.Services
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllAsync();
        Task<List<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetByIdAsync(int id);
        Task<bool> SetSuspendedStatusAsync(int id, bool isSuspended);
        Task<(bool ok, int statusCode, string message)> UpdateProfileAsync(int id, UserProfileUpdateDto request);
        Task<(bool ok, int statusCode, string message)> ChangePasswordAsync(int id, UserPasswordChangeDto request);
    }
}

