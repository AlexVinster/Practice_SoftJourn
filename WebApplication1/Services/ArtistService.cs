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
    using WebApplication1.Models.DTOs.Artist;

    public class ArtistService : IArtistService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ArtistService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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
            _context.Artists.Add(artist);
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
                _context.Artists.Remove(artistToDelete);
                await _context.SaveChangesAsync();
            }
        }
    }
}
