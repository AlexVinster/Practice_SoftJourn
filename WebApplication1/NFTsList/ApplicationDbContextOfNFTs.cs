using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.NFTsList
{
    public class ApplicationDbContextOfNFTs : DbContext
    {
        public ApplicationDbContextOfNFTs(DbContextOptions<ApplicationDbContextOfNFTs> options) : base(options)
        {
        }

        public DbSet<Artwork> Artworks { get; set; }
    }
}