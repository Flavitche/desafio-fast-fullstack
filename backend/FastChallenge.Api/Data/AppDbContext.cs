using FastChallenge.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FastChallenge.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Colaborador> Colaboradores { get; set; }
    public DbSet<Workshop> Workshops { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Relacionamento muitos-para-muitos entre Workshop e Colaborador
        // (representa a presença de colaboradores em workshops)
        modelBuilder.Entity<Workshop>()
            .HasMany(w => w.Colaboradores)
            .WithMany(); // Colaborador não tem lista de Workshops de volta, então fica unidirecional
    }
}