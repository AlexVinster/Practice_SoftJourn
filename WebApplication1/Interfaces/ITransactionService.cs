using WebApplication1.Data.Entities;

namespace WebApplication1.Interfaces
{
    public interface ITransactionService
    {
        Task<IEnumerable<Transaction>> GetAllTransactionsAsync();
    }
}
