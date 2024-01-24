using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.NFTsList;

[ApiController]
[Route("api/[controller]")]
public class ArtworkController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ArtworkController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Artwork>> GetArtworks()
    {
        return _context.Artworks.ToList();
    }
}
