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

            if (string.IsNullOrWhiteSpace(idClaim))
                throw new UnauthorizedAccessException("Nedostaje user id u tokenu.");

            return int.Parse(idClaim);
        }

        // GET: api/areas/my
        [HttpGet("my")]
        public async Task<ActionResult<List<AreaListItemDto>>> GetMyAreas()
        {
            var userId = GetCurrentUserId();
            var list = await _service.GetMyAreasAsync(userId);
            return Ok(list);
        }
    }
}
