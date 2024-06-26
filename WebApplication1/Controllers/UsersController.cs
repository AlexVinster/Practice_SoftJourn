﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
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

    [HttpGet("getUserById/{id}")]
    public async Task<IActionResult> GetUserById(string id)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { Status = "Error", Message = "User not found" });

            return Ok( user );
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Status = "Error", Message = $"An error occurred: {ex.Message}" });
        }
    }

    [Authorize]
    [HttpGet("currentUser")]
    public async Task<IActionResult> GetLoggedInUserInfo()
    {
        try
        {
            // Отримати ім'я користувача з клеймів
            string username = User.Identity.Name;

            // Знайти користувача за ім'ям користувача
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
                return NotFound(new { Status = "Error", Message = "User not found" });

            return Ok(new { userId = user.Id, username = user.UserName, email = user.Email, artistId = user.ArtistInformationId });
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

    [HttpGet("checkEmail")]
    public async Task<IActionResult> CheckEmailAvailability(string email)
    {
        try
        {
            var user = await _userManager.FindByEmailAsync(email);
            return Ok(new { Available = user == null });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Status = "Error", Message = $"An error occurred: {ex.Message}" });
        }
    }

    [Authorize]
    [HttpPut("changeUsername")]
    public async Task<IActionResult> ChangeUsername(string userId, string newUsername)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound(new { Status = "Error", Message = "User not found" });

            // New username
            user.UserName = newUsername;

            // Save to database
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
                return Ok(new { Status = "Success", Message = "Username updated successfully" });
            else
                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = "Failed to update username", Errors = result.Errors });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = $"An error occurred: {ex.Message}" });
        }
    }


    [Authorize]
    [HttpPut("changePassword")]
    public async Task<IActionResult> ChangePassword(string userId, string currentPassword, string newPassword)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound(new { Status = "Error", Message = "User not found" });

            // Check current password
            var passwordValid = await _userManager.CheckPasswordAsync(user, currentPassword);
            if (!passwordValid)
                return BadRequest(new { Status = "Error", Message = "Invalid current password" });

            // Change password
            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);

            if (result.Succeeded)
                return Ok(new { Status = "Success", Message = "Password changed successfully" });
            else
                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = "Failed to change password", Errors = result.Errors });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = $"An error occurred: {ex.Message}" });
        }
    }


    [Authorize]
    [HttpPut("changeEmail")]
    public async Task<IActionResult> ChangeEmail(string userId, string newEmail)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound(new { Status = "Error", Message = "User not found" });

            // Check if the new email is already taken by another user
            var existingUserWithEmail = await _userManager.FindByEmailAsync(newEmail);
            if (existingUserWithEmail != null && existingUserWithEmail.Id != user.Id)
                return BadRequest(new { Status = "Error", Message = "Email is already taken by another user" });

            // Change email
            user.Email = newEmail;
            user.NormalizedEmail = newEmail.ToUpper();

            // Update user in the database
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
                return Ok(new { Status = "Success", Message = "Email updated successfully" });
            else
                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = "Failed to update email", Errors = result.Errors });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = $"An error occurred: {ex.Message}" });
        }
    }

}
