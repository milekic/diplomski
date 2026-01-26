
using gis_backend.Models;
using Microsoft.EntityFrameworkCore;
namespace gis_backend.Data
{

    //ova klasa je most izmedju c# koda i baze 
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions)
            : base(dbContextOptions)
        {
        }

        //DbSet je genericka klasa, ona ne cuva podatke u memoriji, vec omogucava da se radi sa tabelom iz baze onda
        //kad se posalje upit

        public DbSet<User> Users { get; set; }

    }
}
