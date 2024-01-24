using Microsoft.AspNetCore.Mvc;
using WebApplication1.Interfaces;
using WebApplication1.NFTsList;

[ApiController]
[Route("api/[controller]")]
public class NFTController : ControllerBase
{
    private readonly INFTService _nftService;

    public NFTController(INFTService nftService)
    {
        _nftService = nftService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Artwork>>> GetAllArtworks()
    {
        var artworks = await _nftService.GetAllArtworks();
        return Ok(artworks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Artwork>> GetArtworkById(int id)
    {
        var artwork = await _nftService.GetArtworkById(id);

        if (artwork == null)
            return NotFound();

        return Ok(artwork);
    }

    [HttpPost]
    public async Task<ActionResult> AddArtwork([FromBody] Artwork artwork)
    {
        await _nftService.AddArtwork(artwork);
        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateArtwork(int id, [FromBody] Artwork updatedArtwork)
    {
        await _nftService.UpdateArtwork(id, updatedArtwork);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteArtwork(int id)
    {
        await _nftService.DeleteArtwork(id);
        return Ok();
    }
}
