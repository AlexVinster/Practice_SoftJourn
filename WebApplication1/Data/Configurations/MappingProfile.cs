using AutoMapper;
using WebApplication1.Data.Entities;
using WebApplication1.Models.DTOs;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<ArtworkDto, Artwork>().ReverseMap();
    }
}
