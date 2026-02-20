using gis_backend.Configuration;
using gis_backend.DTOs.Realtime;
using gis_backend.Models;
using gis_backend.Repositories;
using Microsoft.Extensions.Options;
using NetTopologySuite.Geometries;

namespace gis_backend.Services
{
    public class MeasurementService : IMeasurementService
    {
        private readonly IMeasurementRepository _repo;
        private readonly int _defaultSrid;

        public MeasurementService(
            IMeasurementRepository repo,
            IOptions<SpatialOptions> spatialOptions)
        {
            _repo = repo;
            _defaultSrid = spatialOptions.Value.DefaultSrid;
        }

        public async Task CreateAsync(MeasurementDto request)
        {
            var measurement = new Measurement
            {
                AreaMonitorId = request.AreaMonitorId,
                AreaId = request.AreaId,
                EventTypeId = request.EventTypeId,
                Value = request.Value,
                MeasuredAt = request.MeasuredAt == default ? DateTime.UtcNow : request.MeasuredAt,
                IsCritical = request.IsCritical,
                ThresholdAtThatTime = request.ThresholdAtThatTime,
                Location = new Point(request.X, request.Y) { SRID = _defaultSrid }
            };

            await _repo.AddAsync(measurement);
            await _repo.SaveChangesAsync();
        }

        public Task<List<MeasurementDto>> GetAllAsync()
        {
            return _repo.GetAllAsync();
        }

        public Task<List<MeasurementDto>> GetByAreaIdAsync(int areaId)
        {
            return _repo.GetByAreaIdAsync(areaId);
        }
    }
}
