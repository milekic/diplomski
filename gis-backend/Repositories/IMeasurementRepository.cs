using gis_backend.DTOs.Realtime;
using gis_backend.Models;

namespace gis_backend.Repositories
{
    public interface IMeasurementRepository
    {
        Task AddAsync(Measurement measurement);

        Task SaveChangesAsync();

        Task<List<MeasurementDto>> GetAllAsync();

        Task<List<MeasurementDto>> GetByAreaIdAsync(int areaId);
    }
}
