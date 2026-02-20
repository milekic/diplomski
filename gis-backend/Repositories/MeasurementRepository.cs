using gis_backend.Data;
using gis_backend.DTOs.Realtime;
using gis_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace gis_backend.Repositories
{
    public class MeasurementRepository : IMeasurementRepository
    {
        private readonly ApplicationDBContext _context;

        public MeasurementRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Measurement measurement)
        {
            await _context.Measurements.AddAsync(measurement);
        }

        public Task SaveChangesAsync()
            => _context.SaveChangesAsync();

        public async Task<List<MeasurementDto>> GetAllAsync()
        {
            return await _context.Measurements
                .AsNoTracking()
                .Select(m => new MeasurementDto
                {
                    AreaMonitorId = m.AreaMonitorId,
                    AreaId = m.AreaId,
                    EventTypeId = m.EventTypeId,
                    Value = m.Value,
                    MeasuredAt = m.MeasuredAt,
                    IsCritical = m.IsCritical,
                    ThresholdAtThatTime = m.ThresholdAtThatTime,
                    X = m.Location.X,
                    Y = m.Location.Y
                })
                .ToListAsync();
        }

        public async Task<List<MeasurementDto>> GetByAreaIdAsync(int areaId)
        {
            return await _context.Measurements
                .AsNoTracking()
                .Where(m => m.AreaId == areaId)
                .Select(m => new MeasurementDto
                {
                    AreaMonitorId = m.AreaMonitorId,
                    AreaId = m.AreaId,
                    EventTypeId = m.EventTypeId,
                    Value = m.Value,
                    MeasuredAt = m.MeasuredAt,
                    IsCritical = m.IsCritical,
                    ThresholdAtThatTime = m.ThresholdAtThatTime,
                    X = m.Location.X,
                    Y = m.Location.Y
                })
                .ToListAsync();
        }
    }
}
