using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.NFTsList;

namespace WebApplication1.Controllers
{
    public class ArtistController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ArtistController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ArtistInformation>> GetArtworks()
        {
            return _context.Artists.ToList();
        }
    }
}
