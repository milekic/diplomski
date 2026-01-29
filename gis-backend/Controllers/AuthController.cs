using gis_backend.DTOs.Auth;
using gis_backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace gis_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<RegisterResponseDto>> Register([FromBody] RegisterRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (ok, message, data) = await _authService.RegisterAsync(request);

            if (!ok)
                return BadRequest(new { message });

            return Ok(data);
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.LoginAsync(request);

            if (result == null)
                return Unauthorized("Pogrešan username/lozinka ili nalog suspendovan.");

            return Ok(result);
        }



    }
}
