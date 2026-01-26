using gis_backend.Models;
using gis_backend.DTOs;
namespace gis_backend.Services
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllAsync();
    }
}
