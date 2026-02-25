using gis_backend.DTOs.Users;
using gis_backend.Mappers;
using gis_backend.Models.Enums;
using gis_backend.Repositories;

namespace gis_backend.Services
{
    public class UserService: IUserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo)
        {
            _repo = repo;   
        }   

        //async omogucava da sa await koristi unutar metode
        public async Task<List<UserDto>> GetAllAsync()
        {
            //throw new Exception("Namjerna greska za test");
            var users = await _repo.GetAllAsync();
            return users.Select(u => u.ToDto()).ToList();
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = await _repo.GetByRoleAsync(UserRole.USER);
            return users.Select(u => u.ToDto()).ToList();
        }

        public async Task<UserDto?> GetByIdAsync(int id)
        {
            var user = await _repo.GetByIdAsync(id);
            return user?.ToDto();
        }

        public async Task<bool> SetSuspendedStatusAsync(int id, bool isSuspended)
        {
            return await _repo.SetSuspendedStatusAsync(id, isSuspended);
        }
    }
}

