using gis_backend.DTOs.Users;
using gis_backend.Mappers;
using gis_backend.Models;
using gis_backend.Models.Enums;
using gis_backend.Repositories;
using Microsoft.AspNetCore.Identity;

namespace gis_backend.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;
        private readonly PasswordHasher<User> _hasher = new();

        public UserService(IUserRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<UserDto>> GetAllAsync()
        {
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

        public async Task<(bool ok, int statusCode, string message)> UpdateProfileAsync(int id, UserProfileUpdateDto request)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null)
                return (false, 404, "Korisnik nije pronadjen.");

            if (await _repo.ExistsByUserNameAsync(request.UserName, id))
                return (false, 409, "Korisnicko ime je vec zauzeto.");

            if (await _repo.ExistsByEmailAsync(request.Email, id))
                return (false, 409, "Email je vec zauzet.");

            var updated = await _repo.UpdateProfileAsync(id, request.UserName, request.Email);
            if (!updated)
                return (false, 404, "Korisnik nije pronadjen.");

            return (true, 200, "Profil je uspjesno azuriran.");
        }

        public async Task<(bool ok, int statusCode, string message)> ChangePasswordAsync(int id, UserPasswordChangeDto request)
        {
            if (request.NewPassword != request.ConfirmNewPassword)
                return (false, 400, "Potvrda lozinke se ne poklapa.");

            var user = await _repo.GetByIdAsync(id);
            if (user == null)
                return (false, 404, "Korisnik nije pronadjen.");

            var verify = _hasher.VerifyHashedPassword(user, user.PasswordHash, request.CurrentPassword);
            if (verify == PasswordVerificationResult.Failed)
                return (false, 400, "Trenutna lozinka nije ispravna.");

            var newHash = _hasher.HashPassword(user, request.NewPassword);
            var updated = await _repo.UpdatePasswordHashAsync(id, newHash);
            if (!updated)
                return (false, 404, "Korisnik nije pronadjen.");

            return (true, 200, "Lozinka je uspjesno promijenjena.");
        }
    }
}
