using Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Server.Services;
using Server.DTOs;

namespace Server.Controllers
{
  [ApiController]
  [Route("")]
  public class UserController : ControllerBase
  {
    private readonly SystemDbContext _db;
    private readonly PisService _pisService;
    private readonly ILogger<UserController> _logger;

    public UserController(SystemDbContext db, PisService pisAdService, ILogger<UserController> logger)
    {
      _db = db;
      _pisService = pisAdService;
      _logger = logger;
    }

    [HttpGet("api/user-info")]
    [Authorize(Roles = "Admin,User")]
    public async Task<ActionResult> UserInfo()
    {
      User? _user = HttpContext.Items["User"] as User;
      if (_user == null) return Ok(null);

      var pisUsers = await _pisService.GetUsers(_user.EmployeeId ?? "");
      if (pisUsers.Count < 1) return Ok(null);

      var pisUser = pisUsers[0];
      User res = new User
      {
        Id = _user.Id,
        Prefix = pisUser.INAME,
        PrefixEN = pisUser.INAME_ENG,
        FirstName = pisUser.FNAME,
        FirstNameEN = pisUser.FNAME_ENG,
        LastName = pisUser.LNAME,
        LastNameEN = pisUser.LNAME_ENG,
        EmployeeId = pisUser.CODE,
        Department = _user.Department,
        Title = pisUser.POSNAME,
        TitleEN = _user.TitleEN,
        Email = _user.Email,
        Telephone = _user.Telephone,
        Mobile = _user.Mobile,
        Avatar = _user.Avatar,
      };
      return Ok(res);
    }

    [HttpGet("api/user-admins")]
    [Authorize(Roles = "Admin")]
    public ActionResult UserAdminList()
    {
      var data = _db.Users
        .Where(d => d.IsAdmin == 1)
        .OrderBy(d => d.FirstName)
        .ThenBy(d => d.LastName)
        .ToList();
      return Ok(data);
    }

    [HttpGet("api/user/{EmployeeCode}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> UserRead(string EmployeeCode)
    {
      var pisUsers = await _pisService.GetUsers(EmployeeCode);
      if (pisUsers.Count < 1) return BadRequest(new { Message = $"ไม่พบผู้ใช้ในระบบ PIS" });
      
      var pisUser = pisUsers[0];
      User res = new User
      {
        Prefix = pisUser.INAME,
        PrefixEN = pisUser.INAME_ENG,
        FirstName = pisUser.FNAME,
        FirstNameEN = pisUser.FNAME_ENG,
        LastName = pisUser.LNAME,
        LastNameEN = pisUser.LNAME_ENG,
        EmployeeId = pisUser.CODE,
        Title = pisUser.POSNAME,
      };
      return Ok(res);
    }
    
    [HttpPost("api/user-admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> UserAdminCreate(ReqUserAdmin req)
    {
      if (string.IsNullOrEmpty(req.EmployeeId)) return BadRequest(new { Message = $"ไม่พบผู้ใช้ในระบบ PIS" });

      User? user = _db.Users
        .Where(d => d.EmployeeId == req.EmployeeId)
        .FirstOrDefault();
      if (user != null)
      {
        user.IsAdmin = 1;
        user.Status = 1;
        _db.SaveChanges();
        return Ok(new { Message = "เพิ่มสิทธิ์ผู้ใช้สำเร็จ" });
      }

      var pisUsers = await _pisService.GetUsers(req.EmployeeId);
      if(pisUsers.Count < 1) return BadRequest(new { Message = $"ไม่พบผู้ใช้ในระบบ PIS" });

      var pisUser = pisUsers[0];
      User newUser = new User
      {
        IsAdmin = 1,
        Prefix = pisUser.INAME,
        PrefixEN = pisUser.INAME_ENG,
        FirstName = pisUser.FNAME,
        FirstNameEN = pisUser.FNAME_ENG,
        LastName = pisUser.LNAME,
        LastNameEN = pisUser.LNAME_ENG,
        EmployeeId = pisUser.CODE,
        Title = pisUser.POSNAME,
        Status = 1,
        CreatedAt = DateTime.Now,
        UpdatedAt = DateTime.Now,
      };
      _db.Users.Add(newUser);
      _db.SaveChanges();

      return Ok(new { Message = "เพิ่มสิทธิ์ผู้ใช้สำเร็จ" });
    }

    [HttpDelete("api/user-admin/{Id}")]
    [Authorize(Roles = "Admin")]
    public ActionResult UserAdminDelete(int Id)
    {
      User? user = _db.Users
        .Where(d => d.Id == Id)
        .FirstOrDefault();
      if (user != null)
      { 
        user.IsAdmin = 0;
        _db.SaveChanges();
      }
      return Ok(new { Message = "ลบสิทธิ์ผู้ใช้สำเร็จ" });
    }

  }
}