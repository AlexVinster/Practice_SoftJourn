namespace WebApplication1.Models.DTOs.Artist
{
    public class ArtistInformationDtoResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string Bio { get; set; }
        public DateTime DateRegistered { get; set; }
        public string WalletAddress { get; set; }
        public string Links { get; set; }
    }
}
