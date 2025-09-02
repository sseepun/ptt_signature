using Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Server.Services;
using Server.DTOs;
using Server.Helpers;

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
      pisUser.Id = _user.Id;
      if (!SUtility.GetTestEmployeeIds().Contains(pisUser.Email ?? "")
      && string.IsNullOrEmpty(pisUser.Email)) pisUser.Email = _user.Email;
      if (string.IsNullOrEmpty(pisUser.Telephone)) pisUser.Telephone = _user.Telephone;
      if (string.IsNullOrEmpty(pisUser.Mobile)) pisUser.Mobile = _user.Mobile;
      if (string.IsNullOrEmpty(pisUser.DepartmentCode)) pisUser.DepartmentCode = _user.DepartmentCode;
      if (string.IsNullOrEmpty(pisUser.Department)) pisUser.Department = _user.Department;
      if (string.IsNullOrEmpty(pisUser.DepartmentEN)) pisUser.DepartmentEN = _user.DepartmentEN;
      if (string.IsNullOrEmpty(pisUser.DepartmentLong)) pisUser.DepartmentLong = _user.DepartmentLong;
      if (string.IsNullOrEmpty(pisUser.DepartmentAbbr)) pisUser.DepartmentAbbr = _user.DepartmentAbbr;
      return Ok(pisUser);
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
      return Ok(pisUser);
    }
    
    [HttpPost("api/user-admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> UserAdminCreate(ReqUserAdmin req)
    {
      if (string.IsNullOrEmpty(req.EmployeeId)) return BadRequest(new { Message = $"ไม่พบผู้ใช้ในระบบ PIS" });

      var pisUsers = await _pisService.GetUsers(req.EmployeeId);
      if(pisUsers.Count < 1) return BadRequest(new { Message = $"ไม่พบผู้ใช้ในระบบ PIS" });
      var pisUser = pisUsers[0];

      User? user = _db.Users
        .Where(d => d.EmployeeId == req.EmployeeId)
        .FirstOrDefault();
      if (user != null)
      {
        user.Department = pisUser.Department;
        user.IsAdmin = 1;
        user.Status = 1;
        _db.SaveChanges();
        return Ok(new { Message = "เพิ่มสิทธิ์ผู้ใช้สำเร็จ" });
      }

      pisUser.IsAdmin = 1;
      pisUser.Status = 1;
      pisUser.CreatedAt = DateTime.Now;
      pisUser.UpdatedAt = DateTime.Now;
      _db.Users.Add(pisUser);
      _db.SaveChanges();

      return Ok(new { Message = "เพิ่มสิทธิ์ผู้ใช้สำเร็จ" });
    }

    [HttpDelete("api/user-admin")]
    [Authorize(Roles = "Admin")]
    public ActionResult UserAdminDelete(ReqUserAdminlDelete req)
    {
      User? user = _db.Users
        .Where(d => d.Id == req.Id)
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