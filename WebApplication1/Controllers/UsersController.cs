﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Auth;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public IActionResult GetUsers()
    {
        try
        {
            var users = _userManager.Users.ToList();

            return Ok(users);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Status = "Error", Message = $"An error occurred: {ex.Message}" });
        }
    }

    [HttpGet("checkUsername")]
    public async Task<IActionResult> CheckUsernameAvailability(string username)
    {
        try
        {
            var user = await _userManager.FindByNameAsync(username);
            return Ok(new { Available = user == null });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Status = "Error", Message = $"An error occurred: {ex.Message}" });
        }
    }
}
