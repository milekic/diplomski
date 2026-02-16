using gis_backend.DTOs.AreaMonitors;
using gis_backend.Models;
using gis_backend.Repositories;

namespace gis_backend.Services
{
    public class AreaMonitorService : IAreaMonitorService
    {
        private readonly IAreaMonitorRepository _repo;

        public AreaMonitorService(IAreaMonitorRepository repo)
        {
            _repo = repo;
        }

        //GET - samo aktivna pracenja
        public Task<List<AreaMonitorActiveForAreaDto>> GetActiveByAreaIdAsync(int areaId)
        {
            return _repo.GetActiveByAreaIdAsync(areaId);
        }


        // CREATE
        public async Task CreateAsync(AreaMonitorCreateDto request)
        {
            var areaMonitor = new AreaMonitor
            {
                AreaId = request.AreaId,
                EventTypeId = request.EventTypeId,
                Threshold = request.Threshold,
                ActiveFrom = DateTime.UtcNow,
                ActiveTo = null
            };

            await _repo.AddAsync(areaMonitor);
            await _repo.SaveChangesAsync();
        }

        // UPDATE (mijenja ActiveTo i Threshold)
        public async Task UpdateAsync(int id, AreaMonitorUpdateDto request)
        {
            var areaMonitor = await _repo.GetByIdAsync(id);

            if (areaMonitor == null)
                throw new KeyNotFoundException("AreaMonitor ne postoji.");

            areaMonitor.ActiveTo = request.ActiveTo;
            areaMonitor.Threshold = request.Threshold;

            await _repo.SaveChangesAsync();
        }
    }
}
