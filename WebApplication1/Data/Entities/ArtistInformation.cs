using System.ComponentModel.DataAnnotations.Schema;
using WebApplication1.Auth;

namespace WebApplication1.Data.Entities
{
    public class ArtistInformation
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Bio { get; set; }
        public DateTime DateRegistered { get; set; }
        public string WalletAddress { get; set; }
        public string Links { get; set; }
        public string UserId { get; set; }

        // For key with Artwork
        public virtual ICollection<Artwork> Artworks { get; set; }
        public virtual ApplicationUser User { get; set; }

    }
}
