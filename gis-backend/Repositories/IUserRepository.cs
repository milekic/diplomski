using gis_backend.Models;

namespace gis_backend.Repositories
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllAsync();
        Task<bool> ExistsByUserNameAsync(string userName);
        Task<bool> ExistsByEmailAsync(string email);
        Task AddAsync(User user);
        Task<User?> GetByUserNameAsync(string userName);


    }
}
