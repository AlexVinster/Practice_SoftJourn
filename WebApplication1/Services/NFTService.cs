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
                existingArtwork.TokenSymbol = updatedArtwork.TokenSymbol;
                existingArtwork.ForSale = updatedArtwork.ForSale;
/*                existingArtwork.ForAuction = updatedArtwork.ForAuction;*/
                existingArtwork.IsSold = updatedArtwork.IsSold;
                existingArtwork.OwnerId = updatedArtwork.OwnerId;
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

            var buyer = await _userManager.FindByIdAsync(buyerId);

            if (buyer == null)
            {
                throw new ArgumentException("Buyer not found.");
            }

            if (!artwork.ForSale)
            {
                throw new InvalidOperationException("Artwork is not for sale.");
            }

            var paymentToken = await _context.Tokens.FirstOrDefaultAsync(t => t.Symbol == paymentTokenSymbol);

            if (paymentToken == null)
            {
                throw new ArgumentException("Payment token not found.");
            }

            var buyerBalance = await _context.UserBalances.FirstOrDefaultAsync(ub => ub.UserId == buyerId && ub.Token.Symbol == paymentTokenSymbol);

            decimal priceInTokens = artwork.Price;

            if (buyerBalance == null || buyerBalance.Balance < priceInTokens)
            {
                throw new InvalidOperationException("Insufficient balance to buy artwork.");
            }

            var seller = await _userManager.FindByIdAsync(artwork.OwnerId);
            if (seller == null)
            {
                throw new ArgumentException("Seller not found.");
            }

            var sellerBalance = await _context.UserBalances.FirstOrDefaultAsync(ub => ub.UserId == seller.Id && ub.Token.Symbol == paymentTokenSymbol);
            if (sellerBalance == null)
            {
                sellerBalance = new UserBalance
                {
                    UserId = seller.Id,
                    Token = paymentToken,
                    Balance = 0
                };
                _context.UserBalances.Add(sellerBalance);
            }

            buyerBalance.Balance -= priceInTokens;
            sellerBalance.Balance += priceInTokens;

            artwork.OwnerId = buyerId;
            artwork.IsSold = true;
            artwork.ForSale = false;

            await _context.SaveChangesAsync();

            var transaction = new Transaction
            {
                UserFromId = seller.Id,
                UserToId = buyerId,
                Token = paymentToken,
                Amount = priceInTokens,
                Timestamp = DateTime.UtcNow,
            };

            _context.Transactions.Add(transaction);
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


        public async Task<IEnumerable<Artwork>> GetFilteredArtworks(decimal? minPrice, decimal? maxPrice, string? artistName, bool? forSale)
        {
            var query = _context.Artworks.AsQueryable();

            if (minPrice.HasValue)
            {
                query = query.Where(a => a.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(a => a.Price <= maxPrice.Value);
            }

            if (!string.IsNullOrEmpty(artistName))
            {
                query = query.Where(a => a.Artist.Name.Contains(artistName));
            }

            if (forSale.HasValue)
            {
                query = query.Where(a => a.ForSale == forSale.Value);
            }

            return await query.ToListAsync();
        }

    }
}
