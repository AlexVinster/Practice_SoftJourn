namespace WebApplication1.Data.Entities
{
    public class Token
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Symbol { get; set; }
        public decimal TotalSupply { get; set; }
        public decimal ExchangeRateToDollars { get; set; }


        // Зв'язок з транзакціями
        public ICollection<Transaction> Transactions { get; set; }
    }
}
