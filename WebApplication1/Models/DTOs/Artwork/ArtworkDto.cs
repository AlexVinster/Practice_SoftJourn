using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Models.DTOs.Artwork
{
    public class ArtworkDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public IFormFile? Image { get; set; }

        public int ArtistId { get; set; }
    }
}
