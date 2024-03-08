using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    private readonly IFileService _fileService;

    public ArtistController(IArtistService artistService, IMapper mapper, IFileService fileService)
    {
        _artistService = artistService;
        _mapper = mapper;
        _fileService = fileService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<ArtistInformationDto>>> GetArtists()
    {
        var artists = await _artistService.GetAllArtists();
        var artistDtoResponse = _mapper.Map<IEnumerable<ArtistInformationDtoResponse>>(artists);
        return Ok(artistDtoResponse);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ArtistInformationDto>> GetArtistById(int id)
    {
        var artist = await _artistService.GetArtistById(id);

        if (artist == null)
        {
            return NotFound();
        }

        var artistDtoResponse = _mapper.Map<ArtistInformationDtoResponse>(artist);
        return Ok(artistDtoResponse);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<int>> AddArtist([FromForm] ArtistInformationDto artistDto)
    {
        if (artistDto.Image == null)
        {
            return BadRequest("Image file is required");
        }

        string imagePath = _fileService.SaveFile(artistDto.Image, "images/artists");

        var artist = _mapper.Map<ArtistInformation>(artistDto);
        artist.Image = imagePath;
        artist.DateRegistered = DateTime.Now;

        await _artistService.AddArtist(artist);

        return Ok();
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ArtistInformationDtoResponse>> UpdateArtist(int id, [FromForm] ArtistInformationDto updatedArtistDto)
    {
        var existingArtist = await _artistService.GetArtistById(id);

        if (existingArtist == null)
        {
            return NotFound();
        }

        string imagePath = null;

        if (updatedArtistDto.Image != null)
        {
            _fileService.DeleteFile(existingArtist.Image);

            imagePath = _fileService.SaveFile(updatedArtistDto.Image, "images/artists");
            existingArtist.Image = imagePath;
        }
        else
        {
            imagePath = existingArtist.Image;
        }

        updatedArtistDto.DateRegistered = existingArtist.DateRegistered;

        _mapper.Map(updatedArtistDto, existingArtist);

        if (!string.IsNullOrEmpty(imagePath))
        {
            existingArtist.Image = imagePath;
        }

        await _artistService.UpdateArtist(id, existingArtist);

        var updatedArtistDtoResponse = _mapper.Map<ArtistInformationDtoResponse>(existingArtist);

        return Ok(updatedArtistDtoResponse);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteArtist(int id)
    {
        var artist = await _artistService.GetArtistById(id);
        if (artist == null)
        {
            return NotFound();
        }
        _fileService.DeleteFile(artist.Image);
        await _artistService.DeleteArtist(id);
        return Ok();
    }
}
