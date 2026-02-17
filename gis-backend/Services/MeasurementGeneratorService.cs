using gis_backend.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace gis_backend.Services
{
    public class MeasurementGeneratorService : BackgroundService
    {
        private readonly IHubContext<MonitoringHub> _hub;
        private readonly ILogger<MeasurementGeneratorService> _logger;
        private readonly Random _rnd = new();

        public MeasurementGeneratorService(
            IHubContext<MonitoringHub> hub,
            ILogger<MeasurementGeneratorService> logger)
        {
            _hub = hub;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("MeasurementGeneratorService STARTED.");

            while (!stoppingToken.IsCancellationRequested)
            {
                // Minimalni payload (kasnije: AreaId, EventTypeId, threshold, location, upis u bazu...)
                var payload = new
                {
                    eventType = "Zemljotres",
                    value = Math.Round(_rnd.NextDouble() * 8.0, 2),
                    measuredAt = DateTime.UtcNow
                };

                await _hub.Clients.All.SendAsync("MeasurementUpdated", payload, cancellationToken: stoppingToken);

                await Task.Delay(TimeSpan.FromSeconds(3), stoppingToken);
            }

            _logger.LogInformation("MeasurementGeneratorService STOPPED.");
        }
    }
}
