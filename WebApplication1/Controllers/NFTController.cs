using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data.Entities;
using WebApplication1.Interfaces;
using WebApplication1.Models.DTOs.Artwork;

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
        var artworkDtoResponse = _mapper.Map<IEnumerable<ArtworkDtoResponse>>(artworks);
        return Ok(artworkDtoResponse);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ArtworkDto>> GetArtworkById(int id)
    {
        var artwork = await _nftService.GetArtworkById(id);

        if (artwork == null)
            return NotFound();

        var artworkDtoResponse = _mapper.Map<ArtworkDtoResponse>(artwork);
        return Ok(artworkDtoResponse);
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
    public async Task<ActionResult<ArtworkDtoResponse>> UpdateArtwork(int id, [FromForm] ArtworkDto updatedArtworkDto)
    {
        var existingArtwork = await _nftService.GetArtworkById(id);

        if (existingArtwork == null)
            return NotFound();

        string imagePath = null;

        if (updatedArtworkDto.Image != null)
        {
            DeleteFile(existingArtwork.Image);

            imagePath = SaveFile(updatedArtworkDto.Image, "images");
            existingArtwork.Image = imagePath;
        }
        else
        {
            imagePath = existingArtwork.Image;
        }

        _mapper.Map(updatedArtworkDto, existingArtwork);

        if (!string.IsNullOrEmpty(imagePath))
        {
            existingArtwork.Image = imagePath;
        }

        await _nftService.UpdateArtwork(id, existingArtwork);

        var updatedArtworkDtoResponse = _mapper.Map<ArtworkDtoResponse>(existingArtwork);

        return Ok(updatedArtworkDtoResponse);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteArtwork(int id)
    {
        var artwork = await _nftService.GetArtworkById(id);

        if (artwork == null)
            return NotFound();

        DeleteFile(artwork.Image);

        await _nftService.DeleteArtwork(id);
        return Ok();
    }

    private void DeleteFile(string filePath)
    {
        var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", filePath.TrimStart('/'));

        if (System.IO.File.Exists(fullPath))
        {
            System.IO.File.Delete(fullPath);
        }
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
