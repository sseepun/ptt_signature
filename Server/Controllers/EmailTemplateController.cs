using System.Models;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs;

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

    [HttpGet("email-templates")]
    public ActionResult EmailTemplateList()
    {
      var data = _db.EmailTemplates
        .OrderBy(d => d.Status)
        .ThenByDescending(d => d.UpdatedAt)
        .ToList();
      return Ok(data);
    }

    [HttpGet("email-template/{Id}")]
    public ActionResult EmailTemplateRead(int Id)
    {
      EmailTemplate? data = _db.EmailTemplates
          .Where(d => d.Id == Id)
          .FirstOrDefault();
      if (data == null) return NotFound();
      return Ok(data);
    }

    [HttpPost("email-template")]
    public ActionResult EmailTemplateCreate(ReqEmailTemplate req)
    {
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
    public ActionResult EmailTemplateUpdate(ReqEmailTemplate req)
    {
      EmailTemplate? data = _db.EmailTemplates
          .Where(d => d.Id == req.Id)
          .FirstOrDefault();
      if (data == null) return NotFound();
    
      if (req.Name != null) data.Name = req.Name;
      if (req.Template != null) data.Template = req.Template;
      data.Status = req.Status;
      data.UpdatedAt = DateTime.Now;
      _db.SaveChanges();
      return Ok(new { Message = "แก้ไข Template สำเร็จ" });
    }

    [HttpDelete("email-template/{Id}")]
    public ActionResult EmailTemplateDelete(int Id)
    {
      EmailTemplate? data = _db.EmailTemplates
          .Where(d => d.Id == Id)
          .FirstOrDefault();
      if (data == null) return NotFound();

      _db.EmailTemplates.Remove(data);
      _db.SaveChanges();
      return Ok(new { Message = "ลบ Template สำเร็จ" });
    }

  }
}