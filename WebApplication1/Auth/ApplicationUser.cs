using WebApplication1.NFTsList;
using Microsoft.AspNetCore.Identity;
namespace WebApplication1.Auth
{
    public class ApplicationUser : IdentityUser
    {
        public int BidId { get; set; }
        public virtual ICollection<Bid> Bids { get; set; }
    }
}
