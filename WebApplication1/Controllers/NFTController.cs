using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data.Entities;
using WebApplication1.Interfaces;
using WebApplication1.Models.DTOs;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<ArtworkDto>>> GetAllArtworks()
    {
        var artworks = await _nftService.GetAllArtworks();
        var artworkDtos = _mapper.Map<IEnumerable<ArtworkDto>>(artworks);
        return Ok(artworkDtos);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ArtworkDto>> GetArtworkById(int id)
    {
        var artwork = await _nftService.GetArtworkById(id);

        if (artwork == null)
            return NotFound();

        var artworkDto = _mapper.Map<ArtworkDto>(artwork);
        return Ok(artworkDto);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> AddArtwork([FromForm] ArtworkDto artworkDto)
    {
        if (artworkDto.Image == null)
            return BadRequest("Image file is required.");

        string imagePath = SaveFile(artworkDto.Image, "images");

        var artwork = _mapper.Map<Artwork>(artworkDto);
        artwork.Image = imagePath;

        await _nftService.AddArtwork(artwork);
        return Ok();
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> UpdateArtwork(int id, [FromForm] ArtworkDto updatedArtworkDto)
    {
        var existingArtwork = await _nftService.GetArtworkById(id);

        if (existingArtwork == null)
            return NotFound();

        if (updatedArtworkDto.Image != null)
        {
            string imagePath = SaveFile(updatedArtworkDto.Image, "images");
            existingArtwork.Image = imagePath;
        }

        _mapper.Map(updatedArtworkDto, existingArtwork);

        await _nftService.UpdateArtwork(id, existingArtwork);
        return Ok();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
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
