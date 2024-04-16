using WebApplication1.Auth;

namespace WebApplication1.Data.Entities
{
    public class Transaction
    {
        public int Id { get; set; }
        public string UserFromId { get; set; }
        public ApplicationUser UserFrom { get; set; }
        public string UserToId { get; set; }
        public ApplicationUser UserTo { get; set; }
        public int TokenId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Timestamp { get; set; }

        public Token Token { get; set; }
    }
}
