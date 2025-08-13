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
        user.Prefix = pisUser.Prefix;
        user.PrefixEN = pisUser.PrefixEN;
        user.FirstName = pisUser.FirstName;
        user.FirstNameEN = pisUser.FirstNameEN;
        user.LastName = pisUser.LastName;
        user.LastNameEN = pisUser.LastNameEN;
        user.EmployeeId = pisUser.EmployeeId;
        user.Title = pisUser.Title;
        if(!string.IsNullOrEmpty(pisUser.Email)) user.Email = pisUser.Email;
        user.Telephone = pisUser.Telephone;
        user.Mobile = pisUser.Mobile;
        if(!string.IsNullOrEmpty(pisUser.DepartmentCode)) user.DepartmentCode = pisUser.DepartmentCode;
        if(!string.IsNullOrEmpty(pisUser.Department)) user.Department = pisUser.Department;
        if(!string.IsNullOrEmpty(pisUser.DepartmentEN)) user.DepartmentEN = pisUser.DepartmentEN;
        if(!string.IsNullOrEmpty(pisUser.DepartmentLong)) user.DepartmentLong = pisUser.DepartmentLong;
        if(!string.IsNullOrEmpty(pisUser.DepartmentAbbr)) user.DepartmentAbbr = pisUser.DepartmentAbbr;
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

      res.Email = string.IsNullOrEmpty(res.Email)? req.Username: res.Email;
      User? user = await SigninProcess(res);
      if (user == null) return BadRequest(new { Message = $"ไม่พบผู้ใช้ในระบบที่ใช้อีเมล {res.Email}" });

      return Ok(new { User = user });
    }

    [HttpPatch("api/refresh")]
    public ActionResult Refresh()
    {
      User? _user = HttpContext.Items["User"] as User;
      if (_user == null) return Ok(true);
      return Ok(true);
    }

    [HttpPost("api/signout")]
    public ActionResult Signout()
    {
      User? _user = HttpContext.Items["User"] as User;
      if (_user == null) return Ok(true);
      
      User? user = _db.Users
        .Where(d => d.Id == _user.Id)
        .FirstOrDefault();
      if(user == null) return Ok(true);

      user.AccessToken = null;
      user.RefreshToken = null;
      _db.SaveChanges();
      return Ok(true);
    }
        
  }
}