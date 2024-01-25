using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApplication1.NFTsList;

namespace WebApplication1.Data.Entities
{
    public class ArtworkConfiguration : IEntityTypeConfiguration<Artwork>
    {
        public void Configure(EntityTypeBuilder<Artwork> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.Image)
                .IsRequired();

            builder.Property(a => a.Name)
                .IsRequired();

            builder.Property(a => a.Description)
                .IsRequired();

            builder.Property(a => a.Price)
                .IsRequired();

/*            builder.Property(a => a.Artist)
                .IsRequired();

            builder.Property(a => a.ArtistPic)
                .IsRequired();*/
        }
    }
}
