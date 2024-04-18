using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApplication1.Auth;
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
    private readonly IFileService _fileService;
    private readonly UserManager<ApplicationUser> _userManager;


    public NFTController(INFTService nftService, IMapper mapper, IFileService fileService, UserManager<ApplicationUser> userManager)
    {
        _nftService = nftService;
        _mapper = mapper;
        _fileService = fileService;
        _userManager = userManager;

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

        string imagePath = _fileService.SaveFile(artworkDto.Image, "images");

        var artwork = _mapper.Map<Artwork>(artworkDto);
        artwork.Image = imagePath;

        try
        {
            await _nftService.AddArtwork(artwork);
            return Ok();
        }
        catch (Exception ex)
        {
            _fileService.DeleteFile(imagePath);
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
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
            _fileService.DeleteFile(existingArtwork.Image);

            imagePath = _fileService.SaveFile(updatedArtworkDto.Image, "images");
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

        _fileService.DeleteFile(artwork.Image);

        await _nftService.DeleteArtwork(id);
        return Ok();
    }


    [HttpPost("buy/{id}")]
    public async Task<ActionResult> BuyNFT(int id, [FromQuery] string paymentTokenSymbol, [FromQuery] string buyerId)
    {
        var artwork = await _nftService.GetArtworkById(id);

        if (artwork == null)
        {
            return NotFound("Artwork not found.");
        }

        try
        {
            await _nftService.BuyArtwork(id, buyerId, paymentTokenSymbol);
            return Ok("Artwork purchased successfully.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error purchasing artwork: {ex.Message}");
        }
    }

    [HttpPost("{artworkId}/forsale")]
    public async Task<IActionResult> PutArtworkForSale(int artworkId, [FromQuery] decimal price)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        try
        {
            await _nftService.SetArtworkForSale(artworkId, userId, price);
            return Ok("Artwork is now for sale.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error putting artwork for sale: {ex.Message}");
        }
    }


    [HttpPost("{id}/notforsale")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> SetArtworkNotForSale(int id)
    {
        try
        {
            await _nftService.SetArtworkNotForSale(id);
            return Ok("Artwork is no longer for sale.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error setting artwork not for sale: {ex.Message}");
        }
    }


}