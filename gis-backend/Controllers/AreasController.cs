using System.Security.Claims;
using gis_backend.DTOs.Areas;
using gis_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace gis_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AreasController : ControllerBase
    {
        private readonly IAreaService _service;

        public AreasController(IAreaService service)
        {
            _service = service;
        }

        private int GetCurrentUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                       ?? User.FindFirst("id")?.Value;

            if (!int.TryParse(idClaim, out var userId))
                throw new UnauthorizedAccessException();

            return userId;
        }

        // GET: api/areas/my
        [HttpGet("my")]
        public async Task<ActionResult<List<AreaListItemDto>>> GetMyAreas()
        {
            var userId = GetCurrentUserId();
            var list = await _service.GetMyAreasAsync(userId);
            return Ok(list);
        }

        //vracaju se sve korisnikove aktivne oblasti + globalne oblasti drugih korisnika (upotreba u LayersTree)
        // GET: api/areas/visible
        [HttpGet("visible")]
        public async Task<ActionResult<List<AreaListItemDto>>> GetVisibleAreas()
        {
            var userId = GetCurrentUserId();
            var list = await _service.GetVisibleAreasAsync(userId);
            return Ok(list);
        }


        // DELETE: api/areas/5
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<AreaDeleteResponseDto>> Delete(int id)
        {
            var userId = GetCurrentUserId();

            try
            {
                var result = await _service.SoftDeleteAsync(id, userId);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Tražena oblast nije pronađena." });
            }
        }

        // POST: api/areas
        [HttpPost]
        public async Task<ActionResult<AreaListItemDto>> Create([FromBody] AreaCreateRequestDto request)
        {
            var userId = GetCurrentUserId();

            try
            {
                var created = await _service.CreateAsync(request, userId);
                return CreatedAtAction(nameof(GetMyAreas), new { }, created);
            }
            catch (ArgumentException)
            {
                return BadRequest(new { message = "Neispravni podaci za kreiranje oblasti." });
            }
        }

        // PUT: api/areas/5
        [HttpPut("{id:int}")]
        public async Task<ActionResult<AreaListItemDto>> Update(int id, [FromBody] AreaUpdateRequestDto request)
        {
            var userId = GetCurrentUserId();

            try
            {
                var updated = await _service.UpdateAsync(id, request, userId);
                return Ok(updated);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Tražena oblast nije pronađena." });
            }
            catch (ArgumentException)
            {
                return BadRequest(new { message = "Neispravni podaci za izmjenu oblasti." });
            }
            catch (InvalidOperationException)
            {
                return BadRequest(new { message = "Operacija nad oblašću nije dozvoljena." });
            }
        }
    }
}
