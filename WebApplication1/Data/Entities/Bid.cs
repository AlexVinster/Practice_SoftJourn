using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
using WebApplication1.Auth;

namespace WebApplication1.Data.Entities
{
    public class Bid
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Timestamp { get; set; }

        // Foreign key with Users
        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; }

        // Foreign key with Artwork
        public int ArtworkId { get; set; }
        public virtual Artwork Artwork { get; set; }

    }
}
