using Microsoft.AspNetCore.Identity;
using WebApplication1.Data.Entities;
namespace WebApplication1.Auth
{
    public class ApplicationUser : IdentityUser
    {
        public virtual ICollection<Bid> Bids { get; set; }
    }
}
