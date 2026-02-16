using gis_backend.DTOs.AreaMonitors;

namespace gis_backend.Services
{
    public interface IAreaMonitorService
    {
        Task CreateAsync(AreaMonitorCreateDto request);

        Task UpdateAsync(int id, AreaMonitorUpdateDto request);
        Task<List<AreaMonitorActiveForAreaDto>> GetActiveByAreaIdAsync(int areaId);

        //sinhronization pattern
        Task SyncForAreaAsync(int areaId, Dictionary<int, double?> selected);


    }
}
