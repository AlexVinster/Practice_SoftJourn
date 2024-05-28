namespace WebApplication1.Services
{
    using AutoMapper;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using WebApplication1.Data;
    using WebApplication1.Data.Entities;
    using WebApplication1.Interfaces;
    public class ArtistService : IArtistService
    {
        private readonly ApplicationDbContext _context;
        private readonly IFileService _fileService;

        public ArtistService(ApplicationDbContext context, IMapper mapper, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task<IEnumerable<ArtistInformation>> GetAllArtists()
        {
            return await _context.Artists.ToListAsync();        
        }

        public async Task<ArtistInformation> GetArtistById(int id)
        {
            return await _context.Artists.FindAsync(id); 
        }

        public async Task AddArtist(ArtistInformation artist)
        {
            var existingArtist = await _context.Artists.FirstOrDefaultAsync(a => a.UserId == artist.UserId);
            if (existingArtist != null)
            {
                throw new InvalidOperationException("User is already an artist");
            }

            var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == artist.UserId);

            _context.Artists.Add(artist);
            await _context.SaveChangesAsync();

            currentUser.ArtistInformationId = artist.Id;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateArtist(int id, ArtistInformation updatedArtist)
        {
            var existingArtist = await _context.Artists.FindAsync(id);

            if (existingArtist != null)
                {
                existingArtist.Image = updatedArtist.Image;
                existingArtist.Name = updatedArtist.Name;
                existingArtist.Bio = updatedArtist.Bio;
                existingArtist.DateRegistered = updatedArtist.DateRegistered;
                existingArtist.WalletAddress = updatedArtist.WalletAddress;
                existingArtist.Links = updatedArtist.Links;

                await _context.SaveChangesAsync();
            }
            else
            {
                throw new ArgumentException("Artist not found");
            }

        }
        public async Task DeleteArtist(int id)
        {
            var artistToDelete = await _context.Artists.FindAsync(id);

            if (artistToDelete != null)
            {
                foreach (var artwork in _context.Artworks.Where(a => a.ArtistId == id))
                {
                    _fileService.DeleteFile(artwork.Image);

                    _context.Artworks.Remove(artwork);
                }

                if (artistToDelete.User != null)
                {
                    artistToDelete.User.ArtistInformationId = null;
                }

                _context.Artists.Remove(artistToDelete);
                await _context.SaveChangesAsync();
            }
        }
    }
}
