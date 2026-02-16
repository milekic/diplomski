using gis_backend.DTOs.EventTypes;

namespace gis_backend.Services
{
    public interface IEventTypeService
    {
        Task<List<EventTypeListItemDto>> GetAllActiveAsync();

        Task<EventTypeListItemDto?> GetByIdAsync(int id);
    }
}
