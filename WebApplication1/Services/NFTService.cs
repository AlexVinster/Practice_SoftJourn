using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Data;
using WebApplication1.Data.Entities;
using WebApplication1.Interfaces;


namespace WebApplication1.Services
{
    public class NFTService : INFTService
    {
        private readonly ApplicationDbContext _context;

        public NFTService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Artwork>> GetAllArtworks()
        {
            return await _context.Artworks.ToListAsync();
        }

        public async Task<Artwork> GetArtworkById(int artworkId)
        {
            return await _context.Artworks.FindAsync(artworkId);
        }

        public async Task AddArtwork(Artwork artwork)
        {
            _context.Artworks.Add(artwork);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateArtwork(int artworkId, Artwork updatedArtwork)
        {
            var existingArtwork = await _context.Artworks.FindAsync(artworkId);

            if (existingArtwork != null)
            {
                existingArtwork.Image = updatedArtwork.Image;
                existingArtwork.Name = updatedArtwork.Name;
                existingArtwork.Description = updatedArtwork.Description;
                existingArtwork.Price = updatedArtwork.Price;
/*                existingArtwork.Artist = updatedArtwork.Artist;
                existingArtwork.ArtistPic = updatedArtwork.ArtistPic;*/

                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteArtwork(int artworkId)
        {
            var artworkToDelete = await _context.Artworks.FindAsync(artworkId);

            if (artworkToDelete != null)
            {
                _context.Artworks.Remove(artworkToDelete);
                await _context.SaveChangesAsync();
            }
        }
    }
}
