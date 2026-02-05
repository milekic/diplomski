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

        //metoda vraca sve aktivne oblasti za odabranog korisnika
        //u ovom sloju se vrsi mapiranje
        public async Task<List<AreaListItemDto>> GetMyAreasAsync(int userId)
        {
            var areas = await _repo.GetActiveUserAreasAsync(userId);

            return areas
                .OrderBy(a => a.Name) 
                .Select(a => a.ToListItemDto())
                .ToList();
        }

    }
}
