using gis_backend.Data;
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
    }
}
