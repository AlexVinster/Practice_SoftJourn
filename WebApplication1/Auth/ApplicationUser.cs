using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using WebApplication1.Data.Entities;

namespace WebApplication1.Auth
{
    public class ApplicationUser : IdentityUser
    {
        public decimal WalletBalance { get; set; }
        public int? ArtistInformationId { get; set; }

        public virtual ICollection<Bid> Bids { get; set; }
        public virtual ICollection<Artwork> OwnedArtworks { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }
        public virtual ArtistInformation ArtistInformation { get; set; }
    }
}
