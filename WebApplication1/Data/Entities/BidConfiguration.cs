using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApplication1.NFTsList;
using Microsoft.AspNetCore.Identity;

namespace WebApplication1.Data.Configurations
{
    public class BidConfiguration : IEntityTypeConfiguration<Bid>
    {
        public void Configure(EntityTypeBuilder<Bid> builder)
        {
            builder.HasKey(b => b.BidId);

            builder.Property(b => b.Amount)
                .IsRequired();

            builder.Property(b => b.Timestamp)
                .IsRequired();

            // Зв'язок з NFT
            /*            builder.HasOne(b => b.NFT)
                            .WithMany(nft => nft.Bids)
                            .HasForeignKey(b => b.NFTId)
                            .OnDelete(DeleteBehavior.Cascade)
                            .HasPrincipalKey(nft => nft.NFTId);*/

            builder.HasOne(b => b.User)
                .WithMany(u => u.Bids)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
