using WebApplication1.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Data;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Interfaces;
using WebApplication1.Data.Entities;

namespace WebApplication1.Services
{
    public class TokenService : ITokenService
    {
        private readonly ApplicationDbContext _context;

        public TokenService(ApplicationDbContext context)
        {
            _context = context;
        }
        
        public async Task<IEnumerable<Token>> GetAllTokensAsync()
        {
            return await _context.Tokens.ToListAsync();
        }

        public async Task<Token?> GetTokenBySymbolAsync(string symbol)
        {
            var tokenEntity = await _context.Tokens.FirstOrDefaultAsync(t => t.Symbol == symbol);

            if (tokenEntity != null)
            {
                var token = new Token
                {
                    Id = tokenEntity.Id,
                    Name = tokenEntity.Name,
                    Symbol = tokenEntity.Symbol,
                    TotalSupply = tokenEntity.TotalSupply,
                    Transactions = tokenEntity.Transactions
                };
                return token;
            }
            else
            {
                throw new ArgumentNullException("Undefined symbol");
            }
        }

        public async Task<decimal> GetUserBalanceAsync(string userId, string tokenSymbol)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(tokenSymbol))
            {
                throw new ArgumentNullException("Both userId and tokenSymbol are required.");
            }

            var token = await _context.Tokens.FirstOrDefaultAsync(t => t.Symbol == tokenSymbol);

            if (token == null)
            {
                return 0;
            }

            var userBalance = await _context.UserBalances.FirstOrDefaultAsync(ub => ub.UserId == userId && ub.Token.Symbol == tokenSymbol);

            if (userBalance == null)
            {
                return 0;
            }

            return userBalance.Balance;
        }

        public async Task<Transaction?> TransferTokenAsync(string fromUserId, string toUserId, string tokenSymbol, decimal amount)
        {
            if (string.IsNullOrEmpty(fromUserId) || string.IsNullOrEmpty(toUserId) ||
                string.IsNullOrEmpty(tokenSymbol) || amount <= 0)
            {
                throw new ArgumentException("Invalid arguments for transferring token.");
            }

            var token = await _context.Tokens.FirstOrDefaultAsync(t => t.Symbol == tokenSymbol);

            if (token == null)
            {
                throw new ArgumentException("Token not found.");
            }

            var fromUserBalance = await _context.UserBalances.FirstOrDefaultAsync(ub => ub.UserId == fromUserId && ub.Token.Symbol == tokenSymbol);

            if (fromUserBalance == null || fromUserBalance.Balance < amount)
            {
                throw new ArgumentException("Insufficient funds for transfer.");
            }

            var toUserBalance = await _context.UserBalances.FirstOrDefaultAsync(ub => ub.UserId == toUserId && ub.Token.Symbol == tokenSymbol);

            if (toUserBalance == null)
            {
                toUserBalance = new UserBalance
                {
                    UserId = toUserId,
                    Token = token,
                    Balance = 0
                };
                _context.UserBalances.Add(toUserBalance);
            }

            fromUserBalance.Balance -= amount;
            toUserBalance.Balance += amount;

            var transaction = new Transaction
            {
                UserFromId = fromUserId,
                UserToId = toUserId,
                Token = token,
                Amount = amount,
                Timestamp = DateTime.UtcNow
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return transaction;
        }


        public async Task<Token?> CreateTokenAsync(string name, string symbol, decimal totalSupply)
        {
            if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(symbol) || totalSupply <= 0)
            {
                throw new ArgumentException("Невірні аргументи для створення токена.");
            }

            if (await _context.Tokens.AnyAsync(t => t.Symbol == symbol))
            {
                throw new ArgumentException("Токен з таким символом вже існує.");
            }

            var tokenEntity = new Token
            {
                Name = name,
                Symbol = symbol,
                TotalSupply = totalSupply
            };

            _context.Tokens.Add(tokenEntity);
            await _context.SaveChangesAsync();

            return tokenEntity;
        }

        public async Task<bool> AddTokenBalanceAsync(string userId, string tokenSymbol, decimal amount)
        {
            // Validate user ID, token symbol, and amount
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(tokenSymbol) || amount <= 0)
            {
                throw new ArgumentException("Invalid arguments for adding token balance.");
            }

            // Find the token by symbol
            var token = await _context.Tokens.FirstOrDefaultAsync(t => t.Symbol == tokenSymbol);

            if (token == null)
            {
                throw new ArgumentException("Token not found.");
            }

            // Check if the user already has a balance for this token
            var userBalance = await _context.UserBalances.FirstOrDefaultAsync(b => b.UserId == userId && b.Token.Symbol == tokenSymbol);

            if (userBalance == null)
            {
                // If the user does not have a balance for this token, create a new balance entry
                userBalance = new UserBalance
                {
                    UserId = userId,
                    Token = token,
                    Balance = amount
                };
                await _context.UserBalances.AddAsync(userBalance);
            }
            else
            {
                // If the user already has a balance for this token, update the balance
                userBalance.Balance += amount;
                _context.UserBalances.Update(userBalance);
            }

            // Save changes to the database
            await _context.SaveChangesAsync();

            return true; // Return true to indicate successful addition of token balance
        }
        public async Task<Token> UpdateTokenAsync(int tokenId, string name, string symbol, decimal totalSupply)
        {
            var token = await _context.Tokens.FindAsync(tokenId);

            if (token == null)
            {
                throw new ArgumentException("Token not found.");
            }

            token.Name = name;
            token.Symbol = symbol;
            token.TotalSupply = totalSupply;

            _context.Tokens.Update(token);
            await _context.SaveChangesAsync();

            return token;
        }
    }
}
