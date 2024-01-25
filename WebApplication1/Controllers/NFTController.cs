using Microsoft.AspNetCore.Mvc;
using WebApplication1.Interfaces;
using WebApplication1.NFTsList;
using WebApplication1.Models.DTOs;
using AutoMapper;


[ApiController]
[Route("api/[controller]")]
public class NFTController : ControllerBase
{
    private readonly INFTService _nftService;
    private readonly IMapper _mapper;

    public NFTController(INFTService nftService, IMapper mapper)
    {
        _nftService = nftService;
        _mapper = mapper;
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
    public async Task<ActionResult> AddArtwork([FromForm] ArtworkDto artworkDto)
    {
        if (artworkDto.Image == null)
            return BadRequest("Image and ArtistPic files are required.");

        string imagePath = SaveFile(artworkDto.Image, "images");

        var artwork = _mapper.Map<Artwork>(artworkDto);

/*        artworkDto.Image = imagePath;
        artworkDto.ArtistPic = artistPicPath;*/

        await _nftService.AddArtwork(artwork);
        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateArtwork(int id, [FromForm] Artwork updatedArtwork, IFormFile imageFile, IFormFile artistPicFile)
    {
        if (imageFile == null || artistPicFile == null)
            return BadRequest("Image and ArtistPic files are required.");

        string imagePath = SaveFile(imageFile, "images");
        string artistPicPath = SaveFile(artistPicFile, "images");

        updatedArtwork.Image = imagePath;
/*        updatedArtwork.ArtistPic = artistPicPath;*/

        await _nftService.UpdateArtwork(id, updatedArtwork);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteArtwork(int id)
    {
        await _nftService.DeleteArtwork(id);
        return Ok();
    }

    private string SaveFile(IFormFile file, string subfolder)
    {
        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", subfolder);
        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(folderPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            file.CopyTo(stream);
        }

        return $"/{subfolder}/{fileName}";
    }
}
