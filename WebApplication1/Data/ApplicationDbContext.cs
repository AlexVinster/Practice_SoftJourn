using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Auth;
using WebApplication1.Data.Entities;

namespace WebApplication1.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfigurationsFromAssembly(GetType().Assembly);
        }

        public DbSet<Artwork> Artworks { get; set; }
        public DbSet<ArtistInformation> Artists { get; set; }
        public DbSet<Bid> Bids { get; set; }
        public DbSet<Token> Tokens { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<UserBalance> UserBalances { get; set; }
    }
}
