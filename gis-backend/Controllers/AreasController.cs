using System.Security.Claims;
using gis_backend.DTOs.Areas;
using gis_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using gis_backend.DTOs.Areas;

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

            if (string.IsNullOrWhiteSpace(idClaim))
                throw new UnauthorizedAccessException("Nedostaje user id u tokenu.");

            return int.Parse(idClaim);
        }

        [HttpGet("my")]
        public async Task<ActionResult<List<AreaListItemDto>>> GetMyAreas()
        {
            var userId = GetCurrentUserId();
            var list = await _service.GetMyAreasAsync(userId);
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
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        //create
        [HttpPost]
        public async Task<ActionResult<AreaListItemDto>> Create([FromBody] AreaCreateRequestDto request)
        {
            var userId = GetCurrentUserId();

            try
            {
                var created = await _service.CreateAsync(request, userId);
                return CreatedAtAction(nameof(GetMyAreas), new { }, created);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        //update
        [HttpPut("{id:int}")]
        public async Task<ActionResult<AreaListItemDto>> Update(int id, [FromBody] AreaUpdateRequestDto request)
        {
            var userId = GetCurrentUserId();

            try
            {
                var updated = await _service.UpdateAsync(id, request, userId);
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



    }
}
