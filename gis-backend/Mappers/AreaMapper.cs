using gis_backend.DTOs.Areas;
using gis_backend.Models;
using NetTopologySuite.IO;



namespace gis_backend.Mappers
{
    public static class AreaMapper
    {
        private static readonly GeoJsonWriter _geoJsonWriter = new GeoJsonWriter();

        public static AreaListItemDto ToListItemDto(this Area area)
        {
            return new AreaListItemDto
            {
                Id = area.Id,
                Name = area.Name,
                Description = area.Description,
                IsGlobal = area.IsGlobal,
                GeomGeoJson = area.Geom != null ? _geoJsonWriter.Write(area.Geom) : ""
            };
        }
    }
}
