using gis_backend.Data;
using gis_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace gis_backend.Repositories
{
    public class EventTypeRepository : IEventTypeRepository
    {
        private readonly ApplicationDBContext _context;

        public EventTypeRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<EventType>> GetAllActiveAsync()
        {
            return await _context.EventTypes
                .Where(e => e.IsActive)
                .ToListAsync();
        }

        public async Task<EventType?> GetByIdAsync(int id)
        {
            return await _context.EventTypes
                .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);
        }
    }
}
