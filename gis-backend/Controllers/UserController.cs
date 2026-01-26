using gis_backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace gis_backend.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController :ControllerBase
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
                    message = "Došlo je do greške na serveru.",
                    details = ex.Message   
                });
            }
        }



    }
}
