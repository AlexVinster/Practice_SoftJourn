using Microsoft.AspNetCore.Mvc;
using WebApplication1.NFTsList;
using WebApplication1.Data;

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
