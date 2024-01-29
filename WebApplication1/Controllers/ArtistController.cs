using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Data.Entities;
using WebApplication1.Interfaces;
using WebApplication1.Models.DTOs.Artist;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ArtistController : ControllerBase
{
    private readonly IArtistService _artistService;
    private readonly IMapper _mapper;

    public ArtistController(IArtistService artistService, IMapper mapper)
    {
        _artistService = artistService;
        _mapper = mapper;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<ArtistInformationDto>>> GetArtists()
    {
        var artists = await _artistService.GetAllArtists();
        var artistDtosResponse = _mapper.Map<IEnumerable<ArtistInformationDtoResponse>>(artists);
        return Ok(artistDtosResponse);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ArtistInformationDto>> GetArtistById(int id)
    {
        var artist = await _artistService.GetArtistById(id);
        var artistDtosResponse = _mapper.Map<IEnumerable<ArtistInformationDtoResponse>>(artist);

        return Ok(artistDtosResponse);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<int>> AddArtist([FromForm] ArtistInformationDto artistDto)
    {
        if (artistDto.Image == null)
        {
            return BadRequest("Image file is requred");
        }

        string imagePath = SaveFile(artistDto.Image, "images", "artists");

        var artist = _mapper.Map<ArtistInformation>(artistDto);
        artist.Image = imagePath;

        
        await _artistService.AddArtist(artist); 

        return Ok();
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateArtist(int id, [FromForm] ArtistInformation updatedArtist)
    {
        try
        {
            await _artistService.UpdateArtist(id, updatedArtist);
            return Ok();
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteArtist(int id)
    {
        await _artistService.DeleteArtist(id);
        return Ok();
    }

    private string SaveFile(IFormFile file, string subfolder1, string subfolder2)
    {
        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", subfolder1, subfolder2);
        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(folderPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            file.CopyTo(stream);
        }

        return $"/{subfolder1}/{subfolder2}/{fileName}";
    }
}
