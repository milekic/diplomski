using gis_backend.Models;
using gis_backend.Models.Enums;

namespace gis_backend.Repositories
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllAsync();
        Task<List<User>> GetByRoleAsync(UserRole role);
        Task<bool> ExistsByUserNameAsync(string userName);
        Task<bool> ExistsByEmailAsync(string email);
        Task AddAsync(User user);
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByUserNameAsync(string userName);
        Task<bool> SetSuspendedStatusAsync(int id, bool isSuspended);


    }
}
