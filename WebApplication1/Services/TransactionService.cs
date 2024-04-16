using WebApplication1.Data.Entities;
using WebApplication1.Data;
using WebApplication1.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace WebApplication1.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ApplicationDbContext _context;

        public TransactionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Transaction>> GetAllTransactionsAsync()
        {
            return await _context.Transactions.ToListAsync();
        }
    }
}
