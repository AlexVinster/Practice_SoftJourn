namespace WebApplication1.Interfaces
{
    public interface IFileService
    {
        string SaveFile(IFormFile file, string filePath);
        void DeleteFile(string filePath);
    }
}
