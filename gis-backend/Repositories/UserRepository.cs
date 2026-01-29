using gis_backend.Data;
using gis_backend.Models;
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

        public async Task<bool> ExistsByUserNameAsync(string userName)
        {
            return await _context.Users.AnyAsync(u => u.userName == userName);
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetByUserNameAsync(string userName)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.userName == userName);
        }



    }
}
