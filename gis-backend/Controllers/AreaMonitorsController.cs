using gis_backend.DTOs.AreaMonitors;
using gis_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace gis_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AreaMonitorsController : ControllerBase
    {
        private readonly IAreaMonitorService _service;

        public AreaMonitorsController(IAreaMonitorService service)
        {
            _service = service;
        }

        // POST: api/areamonitors
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AreaMonitorCreateDto request)
        {
            try
            {
                await _service.CreateAsync(request);
                return Ok(new { message = "Nova oblast se uspješno prati." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = "Neispravni podaci za kreiranje praćenja." });
            }
        }

        // PUT: api/areamonitors/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] AreaMonitorUpdateDto request)
        {
            try
            {
                await _service.UpdateAsync(id, request);
                return Ok(new { message = "Praćenje oblasti je uspješno ažurirano." });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Traženo praćenje nije pronađeno." });
            }
            catch (ArgumentException)
            {
                return BadRequest(new { message = "Neispravni podaci za izmjenu praćenja." });
            }
        }
    }
}
