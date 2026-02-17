
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

        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //obezbejedjuje da u Tabeli EventType ime dogadjaja bude jedinstveno
            modelBuilder.Entity<EventType>()
                .HasIndex(e => e.Name)
                .IsUnique();

            // Unique samo za aktivne, baza ne dozvoljava dva aktivna reda na jednoj oblasti za isti dogadjaj
            modelBuilder.Entity<AreaMonitor>()
                .HasIndex(x => new { x.AreaId, x.EventTypeId })
                .IsUnique()
                .HasFilter("\"ActiveTo\" IS NULL");
        }




        //DbSet omogucava da se radi sa tabelom iz baze onda
        //kad se posalje upit

        public DbSet<User> Users { get; set; }
        public DbSet<Area> Areas { get; set; }
        public DbSet<EventType> EventTypes { get; set; }
        public DbSet<AreaMonitor> AreaMonitors { get; set; }
        public DbSet<Measurement> Measurements { get; set; }

    }
}
