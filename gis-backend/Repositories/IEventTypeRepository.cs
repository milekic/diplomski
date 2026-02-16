using gis_backend.Models;

namespace gis_backend.Repositories
{
    public interface IEventTypeRepository
    {
        Task<List<EventType>> GetAllActiveAsync();

        Task<EventType?> GetByIdAsync(int id);
    }
}
