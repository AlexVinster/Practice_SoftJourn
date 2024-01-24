using WebApplication1.NFTsList;

namespace WebApplication1.Interfaces
{
    public interface INFTService
    {
        Task<IEnumerable<Artwork>> GetAllArtworks();
        Task<Artwork> GetArtworkById(int artworkId);
        Task AddArtwork(Artwork artwork);
        Task UpdateArtwork(int artworkId, Artwork updatedArtwork);
        Task DeleteArtwork(int artworkId);
    }
}
