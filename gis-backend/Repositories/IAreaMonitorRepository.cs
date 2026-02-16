using gis_backend.DTOs.AreaMonitors;
using gis_backend.Models;

namespace gis_backend.Repositories
{
    public interface IAreaMonitorRepository
    {
        Task<AreaMonitor?> GetByIdAsync(int id);

        Task AddAsync(AreaMonitor areaMonitor);

        Task SaveChangesAsync();
        
        Task<List<AreaMonitorActiveForAreaDto>> GetActiveByAreaIdAsync(int areaId);


    }
}
