namespace WebApplication1.Models.DTOs.Artwork
{
    public class ArtworkDtoResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public int ArtistId { get; set; }
    }

}
