using gis_backend.Models;

namespace gis_backend.Repositories
{
    public interface IAreaRepository
    {
        Task<List<Area>> GetUserAreasAsync(int userId);
        Task<List<Area>> GetActiveUserAreasAsync(int userId);
    }
}
