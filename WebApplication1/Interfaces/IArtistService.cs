using WebApplication1.Data.Entities;

namespace WebApplication1.Interfaces
{
    public interface IArtistService
    {
        Task<IEnumerable<ArtistInformation>> GetAllArtists();
        Task<ArtistInformation> GetArtistById(int id);
        Task AddArtist(ArtistInformation artistDto);
        Task UpdateArtist(int id, ArtistInformation updatedArtistDto);
        Task DeleteArtist(int id);
    }
}