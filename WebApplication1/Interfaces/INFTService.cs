using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Data.Entities;

namespace WebApplication1.Interfaces
{
    public interface INFTService
    {
        Task<IEnumerable<Artwork>> GetAllArtworks();
        Task<IEnumerable<Artwork>> GetFilteredArtworks(decimal? minPrice, decimal? maxPrice, string? artistName, bool? forSale);
        Task<Artwork> GetArtworkById(int artworkId);
        Task AddArtwork(Artwork artwork);
        Task UpdateArtwork(int artworkId, Artwork updatedArtwork);
        Task DeleteArtwork(int artworkId);
        Task BuyArtwork(int artworkId, string buyerId, string paymentTokenSymbol);
        Task SetArtworkForSale(int artworkId, string ownerId, decimal price);
        Task SetArtworkNotForSale(int artworkId);
    }
}
