namespace WebApplication1.Data.Entities
{
    public class UserBalance
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public decimal Balance { get; set; }

        public Token Token { get; set; }
    }
}
