using gis_backend.Models;
using gis_backend.Models.Enums;

namespace gis_backend.Repositories
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllAsync();
        Task<List<User>> GetByRoleAsync(UserRole role);
        Task<bool> ExistsByUserNameAsync(string userName);
        Task<bool> ExistsByUserNameAsync(string userName, int excludeUserId);
        Task<bool> ExistsByEmailAsync(string email);
        Task<bool> ExistsByEmailAsync(string email, int excludeUserId);
        Task AddAsync(User user);
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByUserNameAsync(string userName);
        Task<bool> SetSuspendedStatusAsync(int id, bool isSuspended);
        Task<bool> UpdateProfileAsync(int id, string userName, string email);
        Task<bool> UpdatePasswordHashAsync(int id, string passwordHash);
    }
}
