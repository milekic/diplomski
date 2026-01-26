using gis_backend.Models;

namespace gis_backend.Repositories
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllAsync();
    }
}
