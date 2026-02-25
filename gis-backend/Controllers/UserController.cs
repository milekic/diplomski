using gis_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace gis_backend.Controllers
{
    [Route("api/users")]
    [Authorize]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _service.GetAllAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Doslo je do greske na serveru.",
                    //details = ex.Message
                });
            }
        }

        [HttpGet("role/user")]
        //gat all users where Role=user
        //https://localhost:7007/api/Users/role/user
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var result = await _service.GetAllUsersAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Doslo je do greske na serveru."
                    //details = ex.Message
                });
            }
        }
    }
}
