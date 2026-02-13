using gis_backend.Models;

namespace gis_backend.Repositories
{
    public interface IAreaMonitorRepository
    {
        Task<AreaMonitor?> GetByIdAsync(int id);

        Task AddAsync(AreaMonitor areaMonitor);

        Task SaveChangesAsync();
    }
}
