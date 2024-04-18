using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Auth;
using WebApplication1.Data;
using WebApplication1.Data.Entities;
using WebApplication1.Interfaces;


namespace WebApplication1.Services
{
    public class NFTService : INFTService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;


        public NFTService(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
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


        public async Task BuyArtwork(int artworkId, string buyerId, string paymentTokenSymbol)
        {
            var artwork = await _context.Artworks.FindAsync(artworkId);

            if (artwork == null)
            {
                throw new ArgumentException("Artwork not found.");
            }

            // Перевірка, чи вказаний користувач існує
            var buyer = await _userManager.FindByIdAsync(buyerId);

            if (buyer == null)
            {
                throw new ArgumentException("Buyer not found.");
            }

            if (!artwork.ForSale)
            {
                throw new InvalidOperationException("Artwork is not for sale.");
            }

            // Отримання токена, за який планується здійснити оплату
            var paymentToken = await _context.Tokens.FirstOrDefaultAsync(t => t.Symbol == paymentTokenSymbol);

            if (paymentToken == null)
            {
                throw new ArgumentException("Payment token not found.");
            }

            // Перевірка, чи користувач має достатньо коштів для купівлі
            var userBalance = await _context.UserBalances.FirstOrDefaultAsync(ub => ub.UserId == buyerId && ub.Token.Symbol == paymentTokenSymbol);

            // Розрахунок вартості NFT в токенах на основі ціни в доларах та обмінного курсу токена
            decimal priceInTokens = artwork.Price / paymentToken.ExchangeRateToDollars;

            if (userBalance == null || userBalance.Balance < priceInTokens)
            {
                throw new InvalidOperationException("Insufficient balance to buy artwork.");
            }

            // Оновлення власника роботи та відмітка про продаж
            artwork.OwnerId = buyerId;
            artwork.IsSold = true;

            // Віднімання вартості NFT з балансу користувача
            userBalance.Balance -= priceInTokens;

            // Збереження змін в базі даних
            await _context.SaveChangesAsync();
        }

        public async Task SetArtworkForSale(int artworkId, string ownerId, decimal price)
        {
            var artwork = await _context.Artworks.FindAsync(artworkId);

            if (artwork == null)
            {
                throw new ArgumentException("Artwork not found.");
            }

            if (artwork.OwnerId != ownerId)
            {
                throw new InvalidOperationException("Only the owner can put the artwork for sale.");
            }

            artwork.ForSale = true;
            artwork.Price = price;

            await _context.SaveChangesAsync();
        }


        public async Task SetArtworkNotForSale(int artworkId)
        {
            var artwork = await _context.Artworks.FindAsync(artworkId);

            if (artwork == null)
            {
                throw new ArgumentException("Artwork not found.");
            }

            artwork.ForSale = false;

            await _context.SaveChangesAsync();
        }

    }
}
