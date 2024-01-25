using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.NFTsList
{
    public class Artwork
    {
        public int Id { get; set; }
        public string Image { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }

        // Foreign key with Artists
        public int ArtistId { get; set; }
        public ArtistInformation Artist { get; set; }
        public virtual ICollection<Bid> Bids { get; set; }
    }
}
