using gis_backend.Data;
using gis_backend.DTOs.Realtime;
using gis_backend.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

namespace gis_backend.Services
{
    public class MeasurementGeneratorService : BackgroundService
    {
        private readonly IHubContext<MonitoringHub> _hub;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<MeasurementGeneratorService> _logger;
        private readonly Random _rnd = new();

        public MeasurementGeneratorService(
            IHubContext<MonitoringHub> hub,
            IServiceScopeFactory scopeFactory,
            ILogger<MeasurementGeneratorService> logger)
        {
            _hub = hub;
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        private record MonitorGenItem(
            int AreaMonitorId,
            int AreaId,
            int EventTypeId,
            double? Threshold,
            Polygon AreaGeom,
            int Srid,
            double? MinValue,
            double? MaxValue
        );

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("MeasurementGeneratorService STARTED.");

            List<MonitorGenItem> cached = new();
            var lastRefresh = DateTime.MinValue;

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // refresh cache svakih 15-30s (po želji)
                    if (cached.Count == 0 || (DateTime.UtcNow - lastRefresh) > TimeSpan.FromSeconds(20))
                    {
                        using var scope = _scopeFactory.CreateScope();
                        var db = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();

                        // Uzimamo sve aktivne monitore + pripadajući poligon + min/max iz EventType
                        cached = await db.AreaMonitors
                            .AsNoTracking()
                            .Where(m => m.ActiveTo == null)
                            .Select(m => new MonitorGenItem(
                                m.Id,
                                m.AreaId,
                                m.EventTypeId,
                                m.Threshold,
                                (Polygon)m.Area.Geom,
                                m.Area.Geom.SRID,
                                m.EventType.MinThreshold,
                                m.EventType.MaxThreshold
                            ))
                            .ToListAsync(stoppingToken);

                        lastRefresh = DateTime.UtcNow;
                    }

                    if (cached.Count == 0)
                    {
                        await Task.Delay(TimeSpan.FromSeconds(3), stoppingToken);
                        continue;
                    }

                    // 1) izaberi random aktivni monitor
                    var chosen = cached[_rnd.Next(cached.Count)];

                    // 2) generiši vrijednost u opsegu min/max iz EventType
                    var value = GenerateValue(chosen.MinValue, chosen.MaxValue);

                    // 3) generiši tačku unutar poligona
                    var point = GenerateRandomPointInside(chosen.AreaGeom, chosen.Srid);

                    // 4) pošalji realtime payload
                    var payload = new MeasurementRealtimeDto
                    {
                        AreaMonitorId = chosen.AreaMonitorId,
                        AreaId = chosen.AreaId,
                        EventTypeId = chosen.EventTypeId,
                        Value = value,
                        MeasuredAtUtc = DateTime.UtcNow,
                        X = point.X,
                        Y = point.Y
                    };

                    await _hub.Clients.All.SendAsync("MeasurementUpdated", payload, stoppingToken);

                    await Task.Delay(TimeSpan.FromSeconds(3), stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    // normal shutdown
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Generator error.");
                    await Task.Delay(TimeSpan.FromSeconds(3), stoppingToken);
                }
            }

            _logger.LogInformation("MeasurementGeneratorService STOPPED.");
        }

        private double GenerateValue(double? min, double? max)
        {
            var a = min ?? 0;
            var b = max ?? 100;

            if (b < a) { (a, b) = (b, a); }

            var raw = a + _rnd.NextDouble() * (b - a);
            return Math.Round(raw, 2);
        }

        private Point GenerateRandomPointInside(Polygon polygon, int srid)
        {
            // bounding box
            var env = polygon.EnvelopeInternal;

            // sigurnosno ograničenje da ne zapne u beskonačnoj petlji
            const int maxAttempts = 2000;

            for (int i = 0; i < maxAttempts; i++)
            {
                var x = env.MinX + _rnd.NextDouble() * (env.MaxX - env.MinX);
                var y = env.MinY + _rnd.NextDouble() * (env.MaxY - env.MinY);

                var p = new Point(x, y) { SRID = srid };

                // Covers je često bolji od Contains za tačke na ivici
                if (polygon.Covers(p))
                    return p;
            }

            // fallback (ako je poligon “tanak” ili komplikovan)
            var fallback = polygon.Centroid;
            fallback.SRID = srid;
            return fallback;
        }
    }
}
