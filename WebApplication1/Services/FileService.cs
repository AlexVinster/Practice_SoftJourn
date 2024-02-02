using WebApplication1.Interfaces;

namespace WebApplication1.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public FileService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public string SaveFile(IFormFile file, string filePath)
        {
            var folderPath = Path.Combine(_webHostEnvironment.WebRootPath, filePath);
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var fileFullPath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(fileFullPath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            return $"/{filePath}/{fileName}";
        }

        public void DeleteFile(string filePath)
        {
            var fullPath = Path.Combine(_webHostEnvironment.WebRootPath, filePath.TrimStart('/'));

            if (System.IO.File.Exists(fullPath))
            {
                System.IO.File.Delete(fullPath);
            }
        }
    }
}
