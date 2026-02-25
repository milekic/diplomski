using gis_backend.DTOs;

namespace gis_backend.Services
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllAsync();
        Task<List<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetByIdAsync(int id);
        Task<bool> SetSuspendedStatusAsync(int id, bool isSuspended);
    }
}
