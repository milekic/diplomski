using gis_backend.Data;
using gis_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace gis_backend.Repositories
{
    public class AreaRepository : IAreaRepository
    {
        private readonly ApplicationDBContext _context;

        public AreaRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Area>> GetUserAreasAsync(int userId)
        {
            return await _context.Areas
                .AsNoTracking()
                .Where(a => a.OwnerUserId == userId)
                .OrderBy(a => a.Name)
                .ToListAsync();
        }

        public async Task<List<Area>> GetActiveUserAreasAsync(int userId)
        {
            return await _context.Areas
                .AsNoTracking()
                .Where(a => a.IsActive && a.OwnerUserId == userId)
                .ToListAsync();
        }

        public async Task<Area?> GetByIdAsync(int id)
        {
            return await _context.Areas
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Area?> GetByIdForOwnerAsync(int id, int ownerUserId)
        {
            return await _context.Areas
                .FirstOrDefaultAsync(a => a.Id == id && a.OwnerUserId == ownerUserId);
        }

        public Task SaveChangesAsync()
            => _context.SaveChangesAsync();
    }
}
