using gis_backend.DTOs.Areas;

namespace gis_backend.Services
{
    public interface IAreaService
    {
        Task<List<AreaListItemDto>> GetMyAreasAsync(int userId);

        Task<AreaDeleteResponseDto> SoftDeleteAsync(int id, int userId);
        Task<AreaListItemDto> CreateAsync(AreaCreateRequestDto request, int userId);
        Task<AreaListItemDto> UpdateAsync(int id, AreaUpdateRequestDto request, int userId);
        Task<List<AreaListItemDto>> GetVisibleAreasAsync(int userId);
    }
}
