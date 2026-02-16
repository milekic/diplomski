using gis_backend.Data;
using gis_backend.DTOs.AreaMonitors;
using gis_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace gis_backend.Repositories
{
    public class AreaMonitorRepository : IAreaMonitorRepository
    {
        private readonly ApplicationDBContext _context;

        public AreaMonitorRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<AreaMonitor?> GetByIdAsync(int id)
        {
            return await _context.AreaMonitors
                .FirstOrDefaultAsync(am => am.Id == id);
        }

        public async Task AddAsync(AreaMonitor areaMonitor)
        {
            await _context.AreaMonitors.AddAsync(areaMonitor);
        }

        public Task SaveChangesAsync()
            => _context.SaveChangesAsync();


        public async Task<List<AreaMonitorActiveForAreaDto>> GetActiveByAreaIdAsync(int areaId)
        {
            return await _context.AreaMonitors
                .AsNoTracking()
                .Where(am => am.AreaId == areaId && am.ActiveTo == null)
                .Select(am => new AreaMonitorActiveForAreaDto
                {
                    Id = am.Id,
                    EventTypeId = am.EventTypeId,
                    Threshold = am.Threshold
                })
                .ToListAsync();
        }

        public Task<List<AreaMonitor>> GetActiveEntitiesByAreaIdAsync(int areaId)
        {
            return _context.AreaMonitors
                .Where(x => x.AreaId == areaId && x.ActiveTo == null)
                .ToListAsync();
        }


    }
}
