using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApplication1.Data.Entities;

namespace WebApplication1.Data.Configurations
{
    public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
    {
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder.HasKey(t => t.Id);

            // Зв'язок з ApplicationUser для UserFrom
            builder.HasOne(t => t.UserFrom)
                .WithMany()
                .HasForeignKey(t => t.UserFromId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            // Зв'язок з ApplicationUser для UserTo
            builder.HasOne(t => t.UserTo)
                .WithMany()
                .HasForeignKey(t => t.UserToId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            // Зв'язок з Token
            builder.HasOne(t => t.Token)
                .WithMany()
                .HasForeignKey(t => t.TokenId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
