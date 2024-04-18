using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Data.Entities
{
    public class Artwork
    {
        public int Id { get; set; }
        public string Image { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public bool ForSale { get; set; }

        public string OwnerId { get; set; }  // Owner's user ID
        public bool IsSold { get; set; }      // Indicates if the artwork is sold

        // Foreign key with Artists
        public int ArtistId { get; set; }
        public ArtistInformation Artist { get; set; }
        public virtual ICollection<Bid> Bids { get; set; }


        public string TokenSymbol { get; set; }
    }
}
