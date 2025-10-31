using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Server.DTOs;

namespace Server.Controllers
{
  [ApiController]
  [Route("")]
  public class AppSettingController : ControllerBase
  {
    private readonly ILogger<AppSettingController> _logger;

    public AppSettingController(ILogger<AppSettingController> logger)
    {
      _logger = logger;
    }

    [HttpGet("api")]
    public ActionResult AppDefaultRead()
    {
      return Ok("PTT - E-mail Signature API");
    }

    [HttpGet("api/app-setting")]
    public ActionResult<ResAppConfig> AppSettingRead()
    {
      return Ok(new ResAppConfig
      {
        CaaProjectName = Environment.GetEnvironmentVariable("Caa:ProjectName") ?? "",
        CaaProjectCode = Environment.GetEnvironmentVariable("Caa:ProjectCode") ?? "",
        CaaUrl = Environment.GetEnvironmentVariable("Caa:Url") ?? "",
        CaaUsername = Environment.GetEnvironmentVariable("Caa:Username") ?? "",
        CaaPassword = Environment.GetEnvironmentVariable("Caa:Password") ?? "",
        CaaConfig = JsonDocument.Parse(Environment.GetEnvironmentVariable("Caa:Config") ?? ""),
      });
    }
  }
}