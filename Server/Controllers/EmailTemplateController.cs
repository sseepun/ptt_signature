using Server.Models;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Server.Controllers
{
  [ApiController]
  [Route("")]
  public class EmailTemplateController : ControllerBase
  {
    private readonly SystemDbContext _db;
    private readonly ILogger<EmailTemplateController> _logger;

    public EmailTemplateController(SystemDbContext db, ILogger<EmailTemplateController> logger)
    {
      _db = db;
      _logger = logger;
    }

    [HttpGet("email-template-active")]
    [Authorize(Roles = "Admin,User")]
    public ActionResult EmailTemplateActive()
    {
      EmailTemplate? data = _db.EmailTemplates
        .Where(d => d.Status == 1)
        .FirstOrDefault();
      if (data == null) return NotFound();
      return Ok(data);
    }

    [HttpGet("email-template-count")]
    [Authorize(Roles = "Admin")]
    public ActionResult EmailTemplateCount()
    {
      var count = _db.EmailTemplates.Count();
      return Ok(count);
    }

    [HttpGet("email-templates")]
    [Authorize(Roles = "Admin")]
    public ActionResult EmailTemplateList()
    {
      var data = _db.EmailTemplates
        .OrderByDescending(d => d.Status)
        .ThenByDescending(d => d.UpdatedAt)
        .ToList();
      return Ok(data);
    }

    [HttpGet("email-template/{Id}")]
    [Authorize(Roles = "Admin")]
    public ActionResult EmailTemplateRead(int Id)
    {
      EmailTemplate? data = _db.EmailTemplates
          .Where(d => d.Id == Id)
          .FirstOrDefault();
      if (data == null) return NotFound();
      return Ok(data);
    }

    [HttpPost("email-template")]
    [Authorize(Roles = "Admin")]
    public ActionResult EmailTemplateCreate(ReqEmailTemplate req)
    {
      if (req.Status == 1){
        List<EmailTemplate> temps = _db.EmailTemplates
          .Where(d => d.Status == 1)
          .ToList();
        foreach (var temp in temps) temp.Status = 0;
        _db.SaveChanges();
      }

      EmailTemplate data = new EmailTemplate
      {
        Name = req.Name,
        Template = req.Template,
        Status = req.Status,
        CreatedAt = DateTime.Now,
        UpdatedAt = DateTime.Now
      };
      _db.EmailTemplates.Add(data);
      _db.SaveChanges();
      return Ok(new { Message = "สร้าง Template สำเร็จ" });
    }

    [HttpPatch("email-template")]
    [Authorize(Roles = "Admin")]
    public ActionResult EmailTemplateUpdate(ReqEmailTemplate req)
    {
      EmailTemplate? data = _db.EmailTemplates
          .Where(d => d.Id == req.Id)
          .FirstOrDefault();
      if (data == null) return NotFound();
      
      if (req.Status == 1){
        List<EmailTemplate> temps = _db.EmailTemplates
          .Where(d => d.Status == 1)
          .ToList();
        foreach (var temp in temps) temp.Status = 0;
        _db.SaveChanges();
      }
    
      if (req.Name != null) data.Name = req.Name;
      if (req.Template != null) data.Template = req.Template;
      data.Status = req.Status;
      data.UpdatedAt = DateTime.Now;
      _db.SaveChanges();
      return Ok(new { Message = "แก้ไข Template สำเร็จ" });
    }

    [HttpDelete("email-template/{Id}")]
    [Authorize(Roles = "Admin")]
    public ActionResult EmailTemplateDelete(int Id)
    {
      EmailTemplate? data = _db.EmailTemplates
        .Where(d => d.Id == Id && d.Status == 0)
        .FirstOrDefault();
      if (data != null)
      {
        _db.EmailTemplates.Remove(data);
        _db.SaveChanges();
      }
      return Ok(new { Message = "ลบ Template สำเร็จ" });
    }

  }
}