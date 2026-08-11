using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FastChallenge.Api.Models;

namespace FastChallenge.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // POST /api/auth/login
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest login)
    {
        // Usuário e senha fixos, apenas para fins do desafio
        if (login.Usuario != "admin" || login.Senha != "123456")
        {
            return Unauthorized("Usuário ou senha inválidos.");
        }

        var token = GerarToken(login.Usuario);
        return Ok(new { token });
    }

    private string GerarToken(string usuario)
    {
        var chave = _configuration["Jwt:Key"]!;
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];

        var chaveBytes = Encoding.UTF8.GetBytes(chave);
        var credenciais = new SigningCredentials(new SymmetricSecurityKey(chaveBytes), SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, usuario)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credenciais
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}