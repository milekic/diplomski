using gis_backend.DTOs.EventTypes;
using gis_backend.Mappers;
using gis_backend.Repositories;

namespace gis_backend.Services
{
    public class EventTypeService : IEventTypeService
    {
        private readonly IEventTypeRepository _repo;

        public EventTypeService(IEventTypeRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<EventTypeListItemDto>> GetAllActiveAsync()
        {
            var eventTypes = await _repo.GetAllActiveAsync();

            return eventTypes
                .Select(e => e.ToListItemDto())
                .ToList();
        }

        public async Task<EventTypeListItemDto?> GetByIdAsync(int id)
        {
            var eventType = await _repo.GetByIdAsync(id);

            if (eventType == null)
                return null;

            return eventType.ToListItemDto();
        }
    }
}
