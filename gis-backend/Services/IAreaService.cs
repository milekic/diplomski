using gis_backend.DTOs.Areas;

namespace gis_backend.Services
{
    public interface IAreaService
    {
        Task<List<AreaListItemDto>> GetMyAreasAsync(int userId);

        Task<AreaDeleteResponseDto> SoftDeleteAsync(int id, int userId);
    }
}
