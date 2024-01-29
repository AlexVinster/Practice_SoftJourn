using AutoMapper;
using WebApplication1.Data.Entities;
using WebApplication1.Models.DTOs.Artist;
using WebApplication1.Models.DTOs.Artwork;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<ArtworkDto, Artwork>().ReverseMap();
        CreateMap<ArtistInformationDto, ArtistInformation>().ReverseMap();
        CreateMap<Artwork, ArtworkDtoResponse>()
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.Image));
        CreateMap<ArtistInformation, ArtistInformationDtoResponse>()
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.Image));
    }
}
