using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApplication1.Data.Entities;

namespace WebApplication1.Data.Configurations
{
    public class BidConfiguration : IEntityTypeConfiguration<Bid>
    {
        public void Configure(EntityTypeBuilder<Bid> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Amount)
                .HasPrecision(18, 6)
                .IsRequired();

            builder.Property(b => b.Timestamp)
                .IsRequired();

            // Foreign key with User
            builder.HasOne(b => b.User)
                .WithMany(u => u.Bids)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

             // Foreign key with ArtWork
             builder.HasOne(b => b.Artwork)
                .WithMany(u => u.Bids)
                .HasForeignKey(b => b.ArtworkId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
