using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Collections.Generic;
using WebApplication1.Data.Entities;

namespace WebApplication1.Data.Configurations
{
    public class TokenConfiguration : IEntityTypeConfiguration<Token>
    {
        public void Configure(EntityTypeBuilder<Token> builder)
        {
            builder.HasKey(t => t.Id);

            builder.Property(t => t.Name)
                .IsRequired();

            builder.Property(t => t.Symbol)
                .IsRequired();

            builder.Property(t => t.TotalSupply)
                .HasColumnType("numeric(20,8)")
                .IsRequired();

            // Визначення відношень з транзакціями
            builder.HasMany(t => t.Transactions)
                .WithOne(tr => tr.Token)
                .HasForeignKey(tr => tr.TokenId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
