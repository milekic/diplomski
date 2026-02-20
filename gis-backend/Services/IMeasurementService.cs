using gis_backend.DTOs.Realtime;

namespace gis_backend.Services
{
    public interface IMeasurementService
    {
        Task CreateAsync(MeasurementDto request);

        Task<List<MeasurementDto>> GetAllAsync();
    }
}
