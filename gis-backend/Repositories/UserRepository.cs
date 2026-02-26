using gis_backend.Data;
using gis_backend.Models;
using gis_backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace gis_backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDBContext _context;

        public UserRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public Task<List<User>> GetAllAsync()
        {
            return _context.Users
                .AsNoTracking()
                .ToListAsync();
        }

        public Task<List<User>> GetByRoleAsync(UserRole role)
        {
            return _context.Users
                .AsNoTracking()
                .Where(u => u.Role == role)
                .ToListAsync();
        }

        public async Task<bool> ExistsByUserNameAsync(string userName)
        {
            return await _context.Users.AnyAsync(u => u.userName == userName);
        }

        public async Task<bool> ExistsByUserNameAsync(string userName, int excludeUserId)
        {
            return await _context.Users.AnyAsync(u => u.userName == userName && u.Id != excludeUserId);
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<bool> ExistsByEmailAsync(string email, int excludeUserId)
        {
            return await _context.Users.AnyAsync(u => u.Email == email && u.Id != excludeUserId);
        }

        public async Task AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetByUserNameAsync(string userName)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.userName == userName);
        }

        public async Task<bool> SetSuspendedStatusAsync(int id, bool isSuspended)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return false;

            user.IsSuspended = isSuspended;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateProfileAsync(int id, string userName, string email)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return false;

            user.userName = userName;
            user.Email = email;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdatePasswordHashAsync(int id, string passwordHash)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return false;

            user.PasswordHash = passwordHash;
            await _context.SaveChangesAsync();
            return true;
        }



    }
}
