using System.ComponentModel.DataAnnotations.Schema;

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

        // For key with Artwork
        public virtual ICollection<Artwork> Artworks { get; set; }

    }
}
