using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApplication1.Auth;
using WebApplication1.Data.Entities;

namespace WebApplication1.Data.Configurations
{
    public class ArtistConfiguration : IEntityTypeConfiguration<ArtistInformation>
    {
        public void Configure(EntityTypeBuilder<ArtistInformation> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.Name)
                .IsRequired();

            builder.Property(a => a.Image)
                .IsRequired();

            builder.Property(a => a.Bio)
                .IsRequired();

            builder.Property(a => a.DateRegistered)
                .IsRequired();

            builder.Property(a => a.WalletAddress)
                .IsRequired();

            builder.Property(a => a.Links)
                .IsRequired();

            builder.HasMany(a => a.Artworks)
                .WithOne(a => a.Artist)
                .HasForeignKey(a => a.ArtistId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasPrincipalKey(a => a.Id);

            builder.HasOne(a => a.User)
                .WithOne(u => u.ArtistInformation)
                .HasForeignKey<ApplicationUser>(u => u.ArtistInformationId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasPrincipalKey<ArtistInformation>(a => a.Id);

        }
    }
}
