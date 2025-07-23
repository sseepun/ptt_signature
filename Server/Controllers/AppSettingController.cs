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

        [HttpGet("")]
        public IActionResult AppDefaultRead()
        {
            return Ok("PTT - E-Mail Signature API");
        }

        [HttpGet("app-setting")]
        public ResAppConfig AppSettingRead()
        {
            return new ResAppConfig
            {
                CaaProjectName = "CL6800178-EMS",
                CaaProjectCode = "CL6800178-EMS",
                CaaUrl = "https://centralized-aa-test.pttplc.com",
                CaaUsername = "CL6800178-EMS",
                CaaPassword = "AiJi_Dj36FBSE0y8PgS4HlZM[(Albs8;6h-a6YLJbSQeRZ:FM>+C78MVKuGRQ#Am",
                CaaConfig = JsonDocument.Parse("{\"tenants\":[{\"tenant_id\":\"11438945-344b-4f06-b424-78384c52ceb1\",\"name\":\"pttplctest01\",\"domain\":\"pttplctest01.onmicrosoft.com\",\"b2c\":\"N\",\"env\":\"NON-PRD\",\"apps\":[{\"isMsGraph\":\"Y\",\"app_display_name\":\"AD-CL6800178-EMS-NON-PRD\",\"app_description\":\"\",\"client_id\":\"88f31de3-c9ea-4f11-9ad5-bbeee0411afa\",\"authority\":[{\"type\":\"spa\",\"url\":\"https://login.microsoftonline.com/11438945-344b-4f06-b424-78384c52ceb1/\"}],\"callbackDomain\":[\"https://pttemailsignaturetest.pttplc.com\",\"http://localhost:63446\"],\"callbackType\":[\"spa\"],\"signedOutCallbackUrl\":\"https://pttemailsignaturetest.pttplc.com\",\"loginRequest\":{\"scopes\":[\"User.Read\"]},\"client_secret\":\"AD-CL6800178-EMS-NON-PRD-MS-GRAPH\",\"grant_type\":\"client_credentials\",\"b2cScopes\":[],\"bearer_strategy\":{}}]}]}".Replace("\\", "")),
            };
        }
    }
}
