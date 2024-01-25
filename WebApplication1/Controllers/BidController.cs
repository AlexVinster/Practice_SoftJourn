using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.NFTsList;

namespace WebApplication1.Controllers
{
    public class BidController : ControllerBase
        {
            private readonly ApplicationDbContext _context;

            public BidController(ApplicationDbContext context)
            {
                _context = context;
            }

            [HttpGet]
            public ActionResult<IEnumerable<Bid>> GetBids()
            {
                return _context.Bids.ToList();
            }
        }
}