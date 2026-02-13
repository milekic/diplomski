using gis_backend.DTOs.EventTypes;
using gis_backend.Models;

namespace gis_backend.Mappers
{
    public static class EventTypeMapper
    {
        public static EventTypeListItemDto ToListItemDto(this EventType eventType)
        {
            return new EventTypeListItemDto
            {
                Id = eventType.Id,
                Name = eventType.Name,
                Unit = eventType.Unit,
                Description= eventType.Description
            };
        }
    }
}
