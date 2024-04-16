using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using WebApplication1.Interfaces;
using WebApplication1.Models.DTOs.Token;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TokensController : ControllerBase
    {
        private readonly ITokenService _tokenService;

        public TokensController(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTokens()
        {
            var tokens = await _tokenService.GetAllTokensAsync();
            return Ok(tokens);
        }

        [HttpGet("{symbol}")]
        public async Task<IActionResult> GetTokenBySymbol(string symbol)
        {
            var token = await _tokenService.GetTokenBySymbolAsync(symbol);

            if (token == null)
            {
                return NotFound();
            }

            return Ok(token);
        }

        [HttpGet("balance/{userId}/{tokenSymbol}")]
        [Authorize]
        public async Task<IActionResult> GetUserTokenBalance(string userId, string tokenSymbol)
        {
            var balance = await _tokenService.GetUserBalanceAsync(userId, tokenSymbol);

            return Ok(new { Balance = balance });
        }

        [HttpPost("transfer")]
        [Authorize]
        public async Task<IActionResult> TransferToken(string fromUserId, string toUserId, string tokenSymbol, decimal amount)
        {
            var transaction = await _tokenService.TransferTokenAsync(fromUserId, toUserId, tokenSymbol, amount);

            if (transaction == null)
            {
                return BadRequest("Failed to transfer token.");
            }

            return Ok(transaction);
        }

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateToken(string name, string symbol, decimal totalSupply)
        {
            var token = await _tokenService.CreateTokenAsync(name, symbol, totalSupply);

            if (token == null)
            {
                return BadRequest("Failed to create token.");
            }

            return Ok(token);
        }

        [HttpPost("add-balance")]
        public async Task<IActionResult> AddTokenBalance([FromBody] AddTokenBalanceDto request)
        {
            // Перевіряємо, чи запит валідний
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // сервіс для додавання балансу
            try
            {
                await _tokenService.AddTokenBalanceAsync(request.UserId, request.TokenSymbol, request.Amount);
                var responseDto = new AddTokenBalanceResponseDto
                {
                    Message = "Balance added successfully.",
                    Success = true
                };
                return Ok(responseDto);
            }
            catch (Exception ex)
            {
                var responseDto = new AddTokenBalanceResponseDto
                {
                    Message = $"Error adding balance: {ex.Message}",
                    Success = false
                };
                return StatusCode(500, responseDto);
            }
        }

        [HttpPut("{tokenId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateToken(int tokenId, [FromBody] TokenDto model)
        {
            // Перевіряємо, чи запит валідний
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Оновлюємо токен
            try
            {
                var token = await _tokenService.UpdateTokenAsync(tokenId, model.Name, model.Symbol, model.TotalSupply);
                return Ok(token);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating token: {ex.Message}");
            }
        }
    }
}
