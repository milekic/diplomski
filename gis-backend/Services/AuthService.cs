using gis_backend.DTOs.Auth;
using gis_backend.Models;
using gis_backend.Models.Enums;
using gis_backend.Repositories;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;


namespace gis_backend.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly PasswordHasher<User> _hasher = new();
        private readonly IConfiguration _config;


        public AuthService(IUserRepository userRepository, IConfiguration config)
        {
            _userRepository = userRepository;
            _config = config;
        }

        public async Task<(bool ok, string message, RegisterResponseDto? data)> RegisterAsync(RegisterRequestDto request)
        {
            
            if (await _userRepository.ExistsByUserNameAsync(request.UserName))
                return (false, "Korisničko ime je već zauzeto.", null);

            if (await _userRepository.ExistsByEmailAsync(request.Email))
                return (false, "Email je već zauzet.", null);

            
            var user = new User
            {
                userName = request.UserName,
                Email = request.Email,
                Role = UserRole.USER,
                IsSuspended = false
            };

            
            user.PasswordHash = _hasher.HashPassword(user, request.Password);

           
            await _userRepository.AddAsync(user);

         
            var response = new RegisterResponseDto
            {
                Id = user.Id,
                UserName = user.userName,
                Email = user.Email,
                Role = user.Role.ToString()
            };

            return (true, "Registracija uspješna.", response);
        }



        public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
        {
            var user = await _userRepository.GetByUserNameAsync(request.UserName);

            if (user == null) return null;
            if (user.IsSuspended) return null;

            var verify = _hasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.Password
            );

            if (verify == PasswordVerificationResult.Failed)
                return null;

            var token = GenerateJwtToken(user);

            return new LoginResponseDto
            {
                Token = token,
                UserName = user.userName,
                Role = user.Role.ToString()
            };
        }


        private string GenerateJwtToken(User user)
        {
            var jwt = _config.GetSection("Jwt");

            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.UniqueName, user.userName),
        new Claim(ClaimTypes.Role, user.Role.ToString())
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expiresMinutes = int.Parse(jwt["ExpiresMinutes"] ?? "60");

            var token = new JwtSecurityToken(
                issuer: jwt["Issuer"],
                audience: jwt["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }




    }
}
