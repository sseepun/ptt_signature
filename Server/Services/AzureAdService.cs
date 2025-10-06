using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using Server.DTOs;

namespace Server.Services{
  public class AzureObjectRes{
    public bool Success { get; set; } = false;
    public string? Message { get; set; }
    public JsonElement? json { get; set; }
  }
  public class AzureObject1{
    public string? k { get; set; }
    public string? v { get; set; }
  }

  public class AzureAdService{
    private IHttpClientFactory _clientFactory;
    public AzureAdService(IHttpClientFactory clientFactory){
      _clientFactory = clientFactory;
    }

    private async Task<AzureObjectRes> GetResponse(HttpRequestMessage request, string resultKey)
    {
      try
      {
        var client = _clientFactory.CreateClient();
        var response = await client.SendAsync(request);
        if (!response.IsSuccessStatusCode) return new AzureObjectRes { Success = false };

        var content = await response.Content.ReadAsStringAsync();
        var json = JsonDocument.Parse(content).RootElement;
        Console.WriteLine($"\nAzure AD Response : {json.GetRawText()}");
        if (json.GetProperty(resultKey).GetString() != "SUCCESS") return new AzureObjectRes { Success = false, Message = json.GetProperty("result_desc").GetString() };

        return new AzureObjectRes { Success = true, json = json };
      }
      catch (Exception ex)
      {
        Console.WriteLine($"\nAzure AD Get Response Error : {ex.Message}\n{ex.StackTrace}");
        return new AzureObjectRes { Success = false, Message = ex.Message };
      }
    }

    public async Task<ResAuthSigninAD> AuthorizationAD(ReqAuthSigninAD req){
      try
      {
        var apiUrl = Environment.GetEnvironmentVariable("Caa:Url");
        var projectCode = Environment.GetEnvironmentVariable("Caa:ProjectCode");

        var jsonOption = new JsonSerializerOptions { Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping, WriteIndented = false };
        var requestData = new { tenant_id = req.TenantId, client_id = req.ClientId, access_token = req.AccessToken, type = "CMS" };
        string requestString = JsonSerializer.Serialize(requestData);
        byte[] requestBytes = Encoding.UTF8.GetBytes(requestString);
        string requestBase64 = Convert.ToBase64String(requestBytes);
        var bodyData = new
        {
          function_id = "F100011",
          app_user = projectCode,
          req_transaction_id = DateTime.Now.ToString("ddMMyyyyhhmmssfff"),
          state_name = "",
          req_parameters = new List<AzureObject1> {
          new AzureObject1 {
              k = "data",
              v = requestBase64,
            }
          },
          extra_xml = "",
        };

        var request = new HttpRequestMessage(HttpMethod.Post, apiUrl + "/auth/ad");
        request.Content = new StringContent(JsonSerializer.Serialize(bodyData, jsonOption), Encoding.UTF8, "application/json");

        var jsonRes = await GetResponse(request, "result_status");
        if (!jsonRes.Success) return new ResAuthSigninAD { Success = false, Message = $"เชื่อมต่อระบบ CA&A ไม่สำเร็จ - {jsonRes.Message}" };

        var json2 = jsonRes.json?.GetProperty("resp_parameters")[0].GetProperty("value").GetString();
        byte[] dataBytes = Convert.FromBase64String(json2 ?? "");
        string decoded = Encoding.UTF8.GetString(dataBytes);

        var result = JsonDocument.Parse(decoded).RootElement;
        string? userId = result.GetProperty("user_id").GetString();
        string? email = result.GetProperty("email").GetString();
        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(email)) return new ResAuthSigninAD { Success = false, Message = "ไม่พบอีเมลผู้ใช้ในระบบ CA&A" };

        string firstName = ""; string lastName = "";
        foreach (var name in result.GetProperty("name").EnumerateArray())
        {
          firstName = name.GetProperty("first").GetString() ?? "";
          lastName = name.GetProperty("last").GetString() ?? "";
        }

        string? employeeId = null;
        try { employeeId = result.GetProperty("employee_id").GetString(); } catch { }
        return new ResAuthSigninAD
        {
          Success = true,
          Message = "เข้าสู่ระบบ CA&A สำเร็จ",
          EmployeeId = employeeId,
          UserId = userId,
          Email = string.IsNullOrEmpty(email) ? req.Username : email,
          FirstName = firstName,
          LastName = lastName,
        };
      }
      catch (Exception ex)
      {
        Console.WriteLine($"\nAzure AD Auth Error : {ex.Message}\n{ex.StackTrace}");
        return new ResAuthSigninAD{ Success = false, Message = $"เชื่อมต่อระบบ CA&A ไม่สำเร็จ - {ex.Message}" };
      }
    }
  }
}