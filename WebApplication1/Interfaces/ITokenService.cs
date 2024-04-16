using WebApplication1.Data.Entities;

namespace WebApplication1.Interfaces
{
    public interface ITokenService
    {
        Task<IEnumerable<Token>> GetAllTokensAsync();
        Task<Token> GetTokenBySymbolAsync(string symbol);
        Task<Token> UpdateTokenAsync(int tokenId, string name, string symbol, decimal totalSupply);
        Task<decimal> GetUserBalanceAsync(string userId, string tokenSymbol);
        Task<Transaction> TransferTokenAsync(string fromUserId, string toUserId, string tokenSymbol, decimal amount);
        Task<Token> CreateTokenAsync(string name, string symbol, decimal totalSupply);
        Task<bool> AddTokenBalanceAsync(string userId, string tokenSymbol, decimal amount);
    }
}
