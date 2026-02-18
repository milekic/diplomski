using gis_backend.Models;

namespace gis_backend.Repositories
{
    public interface IAreaRepository
    {
        Task<List<Area>> GetUserAreasAsync(int userId);
        Task<List<Area>> GetActiveUserAreasAsync(int userId);

        Task<Area?> GetByIdAsync(int id);
        Task<Area?> GetByIdForOwnerAsync(int id, int ownerUserId);
        Task SaveChangesAsync();
        Task AddAsync(Area area);
        Task<List<Area>> GetVisibleAreasAsync(int userId);


    }
}
