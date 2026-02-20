using gis_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace gis_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MeasurementsController : ControllerBase
    {
        private readonly IMeasurementService _service;

        public MeasurementsController(IMeasurementService service)
        {
            _service = service;
        }

        // GET: api/measurements
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(list);
        }

        // GET: api/measurements/area/5
        [HttpGet("area/{areaId:int}")]
        public async Task<IActionResult> GetByAreaId(int areaId)
        {
            var list = await _service.GetByAreaIdAsync(areaId);
            return Ok(list);
        }
    }
}
