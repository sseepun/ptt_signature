using Server.Models;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs;
using Server.Services;
using Server.Helpers;

namespace Server.Controllers
{
  [ApiController]
  [Route("")]
  public class AuthController : ControllerBase
  {
    private readonly SystemDbContext _db;
    private readonly AzureAdService _azureAdService;
    private readonly PisService _pisService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(SystemDbContext db, AzureAdService azureAdService, PisService pisService, ILogger<AuthController> logger)
    {
      _db = db;
      _azureAdService = azureAdService;
      _pisService = pisService;
      _logger = logger;
    }

    private async Task<User?> SigninProcess(ResAuthSigninAD req)
    {
      if (!req.Success || req.UserId == null || req.Email == null) return null;

      User? user = _db.Users.Where(d => d.Email == req.Email && d.Status == 1).FirstOrDefault();
      if (user == null)
      {
        var _testIndex = SUtility.GetTestAccounts().IndexOf(req.Email ?? "");
        User newUser = new User
        {
          EmployeeId = req.EmployeeId,
          IsAdmin = SUtility.GetTestAccounts().Contains(req.Email ?? "") ? 1 : 0,
          FirstName = req.FirstName,
          LastName = req.LastName,
          Email = req.Email ?? "",
          Status = 1,
          CreatedAt = DateTime.Now,
          UpdatedAt = DateTime.Now,
        };
        _db.Users.Add(newUser);
        _db.SaveChanges();

        user = _db.Users.Where(d => d.Email == req.Email && d.Status == 1).FirstOrDefault();
        if (user == null) return null;
      }

      var pisUsers = await _pisService.GetUsers(user.EmployeeId ?? "");
      var pisUser = pisUsers.Count > 0 ? pisUsers[0] : null;
      if (pisUser != null)
      {
        user.Prefix = pisUser.INAME;
        user.PrefixEN = pisUser.INAME_ENG;
        user.FirstName = pisUser.FNAME;
        user.FirstNameEN = pisUser.FNAME_ENG;
        user.LastName = pisUser.LNAME;
        user.LastNameEN = pisUser.LNAME_ENG;
        user.EmployeeId = pisUser.CODE;
        user.Title = pisUser.POSNAME;
      }

      user.EmployeeId = req.EmployeeId;
      user.AccessToken = SUtility.GenerateAccessToken(user);
      user.RefreshToken = SUtility.GenerateRefreshToken(user);
      user.UpdatedAt = DateTime.Now;
      _db.SaveChanges();

      return user;
    }

    [HttpPost("api/signin-ad")]
    public async Task<ActionResult> SigninAD(ReqAuthSigninAD req)
    {
      ResAuthSigninAD res = await _azureAdService.AuthorizationAD(req);
      if (!res.Success) return BadRequest(new { Message = res.Message });

      User? user = await SigninProcess(res);
      if (user == null) return BadRequest(new { Message = $"ไม่พบผู้ใช้ในระบบที่ใช้อีเมล {res.Email}" });

      return Ok(new { User = user });
    }

    [HttpPatch("api/refresh")]
    public ActionResult Refresh()
    {
      User? _user = HttpContext.Items["User"] as User;
      if (_user == null) return Ok(false);
      return Ok(true);
    }
        
  }
}