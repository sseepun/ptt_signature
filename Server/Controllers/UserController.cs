using Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Server.Services;

namespace Server.Controllers
{
  [ApiController]
  [Route("")]
  public class UserController : ControllerBase
  {
    private readonly SystemDbContext _db;
    private readonly PisService _pisAdService;
    private readonly ILogger<UserController> _logger;

    public UserController(SystemDbContext db, PisService pisAdService, ILogger<UserController> logger)
    {
      _db = db;
      _pisAdService = pisAdService;
      _logger = logger;
    }

    [HttpGet("user-info")]
    [Authorize(Roles = "Admin,User")]
    public async Task<ActionResult> UserInfo()
    {
      User? _user = HttpContext.Items["User"] as User;
      if (_user == null) return Ok(null);

      var pisUsers = await _pisAdService.GetUsers(_user.EmployeeId ?? "");
      if(pisUsers.Count < 1) return Ok(null);

      var pisUser = pisUsers[0];
      return Ok(new
      {
        Prefix = pisUser.INAME,
        PrefixEN = pisUser.INAME_ENG,
        FirstName = pisUser.FNAME,
        FirstNameEN = pisUser.FNAME_ENG,
        LastName = pisUser.LNAME,
        LastNameEN = pisUser.LNAME_ENG,
        Employeeid = pisUser.CODE,
        Title = pisUser.POSNAME,
        FullName = pisUser.FULLNAMETH,
        FullNameEN = pisUser.FULLNAMEENG,
        Email = _user.Email,
      });
    }

  }
}