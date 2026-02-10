using gis_backend.DTOs.Areas;
using gis_backend.Mappers;
using gis_backend.Models;
using gis_backend.Repositories;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using System.Text.Json;
using System.Text.Json;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;


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
                .OrderByDescending(a => a.Id)
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
                    Message = "Oblast je već obrisana."
                };
            }

            area.IsActive = false;
            await _repo.SaveChangesAsync();

            return new AreaDeleteResponseDto
            {
                Id = area.Id,
                IsActive = area.IsActive,
                Message = "Oblast je uspješno obrisana"
            };
        }

        // Create
        public async Task<AreaListItemDto> CreateAsync(AreaCreateRequestDto request, int userId)
        {
            
            var polygon = ParsePolygonFromGeoJson(request.GeomGeoJson);

            polygon.SRID = 4326;

            var area = new Area
            {
                Name = request.Name.Trim(),
                Description = request.Description,
                IsGlobal = request.IsGlobal,
                IsMonitored = request.IsMonitored,
                IsActive = true,
                OwnerUserId = userId,
                Geom = polygon
            };

            await _repo.AddAsync(area);
            await _repo.SaveChangesAsync();

            return area.ToListItemDto();
        }

        //UPDATE
        public async Task<AreaListItemDto> UpdateAsync(int id, AreaUpdateRequestDto request, int userId)
        {
            var area = await _repo.GetByIdForOwnerAsync(id, userId);

            if (area == null)
                throw new KeyNotFoundException("Oblast ne postoji ili ne pripada korisniku.");

            

            var polygon = ParsePolygonFromGeoJson(request.GeomGeoJson);
            polygon.SRID = 4326;

            area.Name = request.Name.Trim();
            area.Description = request.Description;
            area.IsGlobal = request.IsGlobal;
            area.IsMonitored = request.IsMonitored;
            area.Geom = polygon;

            await _repo.SaveChangesAsync();

            return area.ToListItemDto();
        }

        //Parsiranje poligona
        private static Polygon ParsePolygonFromGeoJson(string geoJson)
        {
            if (string.IsNullOrWhiteSpace(geoJson))
                throw new ArgumentException("GeomGeoJson je obavezan.");

           
            using var doc = JsonDocument.Parse(geoJson);
            var root = doc.RootElement;

            string geometryJson;

            if (root.TryGetProperty("type", out var typeProp) && typeProp.GetString() == "Feature")
            {
                if (!root.TryGetProperty("geometry", out var geomProp) || geomProp.ValueKind == JsonValueKind.Null)
                    throw new ArgumentException("GeoJSON Feature nema geometry.");

                geometryJson = geomProp.GetRawText();
            }
            else
            {
                
                geometryJson = root.GetRawText();
            }

            var reader = new GeoJsonReader();
            var geom = reader.Read<Geometry>(geometryJson);

            if (geom is not Polygon poly)
                throw new ArgumentException("GeomGeoJson mora biti GeoJSON Polygon.");

            if (poly.IsEmpty)
                throw new ArgumentException("Polygon je prazan.");

            if (!poly.IsValid)
                throw new ArgumentException("Polygon nije validan (samopresijecanje ili pogrešna geometrija).");

            return poly;
        }
    }
}
