using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using WebApplication1.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class EmailSenderController : ControllerBase
{
    private readonly IEmailSender _emailSender;

    public EmailSenderController(IEmailSender emailSender)
    {
        _emailSender = emailSender;
    }

    [HttpPost]
    public async Task<IActionResult> SendEmail([FromForm] string email, [FromForm] string subject, [FromForm] string message)
    {
        try
        {
            // Викликаємо метод для надсилання електронної пошти
            await _emailSender.SendEmailAsync(email, subject, message);
            return Ok(new { Message = "Email sent successfully!" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Error = $"Error sending email: {ex.Message}" });
        }
    }
}
