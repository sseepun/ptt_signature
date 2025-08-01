using Server.Models;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs;
using Server.Services;

namespace Server.Controllers
{
  [ApiController]
  [Route("")]
  public class AuthController : ControllerBase
  {
    private readonly SystemDbContext _db;
    private readonly AzureAdService _azureAdService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(SystemDbContext db, AzureAdService azureAdService, ILogger<AuthController> logger)
    {
      _db = db;
      _azureAdService = azureAdService;
      _logger = logger;
    }

    [HttpPost("signin-ad")]
    public async Task<ActionResult> SigninAD(ReqAuthSigninAD req)
    {
      ResAuthSigninAD res = await _azureAdService.AuthorizationAD(req);
      if(!res.Success) return BadRequest(new { Message = res.Message });
      return Ok(res);

      // User? user = SigninProcess(res);
      // if(user == null) return BadRequest(new { Message = $"ไม่พบผู้ใช้ในระบบที่ใช้อีเมล {res.Email}" });

      // return Ok(new { User = user });
    }
  }
}