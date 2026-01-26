using gis_backend.DTOs;
using gis_backend.Mappers;
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

    }
}
