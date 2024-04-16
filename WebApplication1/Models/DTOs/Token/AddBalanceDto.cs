namespace WebApplication1.Models.DTOs.Token
{
    public class AddTokenBalanceDto
    {
        public string UserId { get; set; }
        public string TokenSymbol { get; set; }
        public decimal Amount { get; set; }
    }
}
