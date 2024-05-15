namespace WebApplication1.Models.DTOs.Artwork
{
    public class ArtworkDtoResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string TokenSymbol { get; set; }
        public string ImageUrl { get; set; }
        public int ArtistId { get; set; }
        public string OwnerId { get; set; }
        public bool ForSale { get; set; }
       /* public bool ForAuction { get; set; }*/
        public bool IsSold { get; set; }
    }
}
