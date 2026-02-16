using gis_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace gis_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EventTypesController : ControllerBase
    {
        private readonly IEventTypeService _service;

        public EventTypesController(IEventTypeService service)
        {
            _service = service;
        }

        // GET: api/eventtypes
        [HttpGet]
        public async Task<IActionResult> GetAllActive()
        {
            var list = await _service.GetAllActiveAsync();
            return Ok(list);
        }

        // GET: api/eventtypes/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);

            if (item == null)
                return NotFound(new { message = "Traženi tip događaja nije pronađen." });

            return Ok(item);
        }
    }
}
