using gis_backend.DTOs.Areas;
using gis_backend.Mappers;
using gis_backend.Repositories;

namespace gis_backend.Services
{
    public class AreaService : IAreaService
    {
        private readonly IAreaRepository _repo;

        public AreaService(IAreaRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<AreaListItemDto>> GetMyAreasAsync(int userId)
        {
            var areas = await _repo.GetActiveUserAreasAsync(userId);

            return areas
                .OrderBy(a => a.Name)
                .Select(a => a.ToListItemDto())
                .ToList();
        }

        public async Task<AreaDeleteResponseDto> SoftDeleteAsync(int id, int userId)
        {
            
            var area = await _repo.GetByIdForOwnerAsync(id, userId);

            if (area == null)
                throw new KeyNotFoundException("Oblast ne postoji ili ne pripada korisniku.");

            if (!area.IsActive)
            {
                return new AreaDeleteResponseDto
                {
                    Id = area.Id,
                    IsActive = area.IsActive,
                    Message = "Oblast je već obrisana (neaktivna)."
                };
            }

            area.IsActive = false;
            await _repo.SaveChangesAsync();

            return new AreaDeleteResponseDto
            {
                Id = area.Id,
                IsActive = area.IsActive,
                Message = "Oblast je uspješno obrisana (soft delete)."
            };
        }
    }
}
