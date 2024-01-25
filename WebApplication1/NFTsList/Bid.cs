namespace WebApplication1.NFTsList
{
    public class Bid
    {
        public int BidId { get; set; }
        public int NFTId { get; set; }
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
