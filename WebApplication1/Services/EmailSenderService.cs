using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using WebApplication1.Interfaces;

namespace WebApplication1.Services
{
    public class EmailSenderService : IEmailSender
    {
        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var mail = "aliexpre20000@gmail.com";
            var mailPassword = "tpcu dmws hmso askl";

            var client = new SmtpClient("smtp.gmail.com", 587)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(mail, mailPassword)
            };

            await client.SendMailAsync(new MailMessage(mail, email, subject, message));

            Console.WriteLine($"Sending email to: {email}");
            Console.WriteLine($"Subject: {subject}");
            Console.WriteLine($"Message: {message}");
        }
    }
}
