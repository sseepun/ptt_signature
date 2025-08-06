using System.Text;
using System.Text.Json;
using Server.DTOs;
using Newtonsoft.Json;

namespace Server.Services {
  public class SearchDirectory2 {
    public string CompanyCode { get; set; } = "1";
    public string? DepartmentABBR { get; set; }
  }

  public class ObjectUserName {
    public string Prefix { get; set; } = "";
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
  }

  public class PisService {
    private IHttpClientFactory _clientFactory;
    public PisService(IHttpClientFactory clientFactory) {
        _clientFactory = clientFactory;
    }

    public string? GetVariable(string key) {
      return Environment.GetEnvironmentVariable($"Pis:{key}");
    }
    
    public async Task<string?> GetAuthToken() {
      try {
        var authUrl = GetVariable("TokenUrl");
        var authUsername = GetVariable("TokenUsername");
        var authPassword = GetVariable("TokenPassword");
        if(!string.IsNullOrEmpty(authUrl) && !string.IsNullOrEmpty(authUsername) && !string.IsNullOrEmpty(authPassword)){
          var request = new HttpRequestMessage(HttpMethod.Post, authUrl);
          request.Headers.Add("Authorization", "Basic " + Convert.ToBase64String(Encoding.ASCII.GetBytes($"{authUsername}:{authPassword}")));
          request.Content = new StringContent("grant_type=client_credentials", Encoding.UTF8, "application/x-www-form-urlencoded");

          var client = _clientFactory.CreateClient();
          var response = await client.SendAsync(request);
          if(response.IsSuccessStatusCode){
            var content = await response.Content.ReadAsStringAsync();
            var json = JsonDocument.Parse(content);
            return json.RootElement.GetProperty("access_token").GetString();
          }
        }
      } catch (Exception ex) { Console.WriteLine($"\nPhone Directory Auth Token Error : {ex.Message}\n{ex.StackTrace}"); }
      return null;
    }

    public async Task<List<PisUser>> GetUsers(string employeeId) {
      try {
        var token = await GetAuthToken();
        if(string.IsNullOrEmpty(token)) return new List<PisUser>();

        var url = GetVariable("Url");
        if(string.IsNullOrEmpty(url)) return new List<PisUser>();

        string endpoint = "/PersonelInfo/S4/1.0.0/PersonelInfo";
        var request = new HttpRequestMessage(HttpMethod.Get, url+endpoint+$"?Search_EmployeeCode={employeeId}");
        request.Headers.Add("Authorization", "Bearer " + token);
        request.Headers.Add("Accept", "application/json");

        var client = _clientFactory.CreateClient();
        var response = await client.SendAsync(request);
        if(!response.IsSuccessStatusCode) return new List<PisUser>();

        var content = await response.Content.ReadAsStringAsync();
        var resultData = JsonConvert.DeserializeObject<PisUsersMain>(content);
        return resultData?.entries.entry ?? new List<PisUser>();
      } catch (Exception ex) { Console.WriteLine($"\nPhone Directory Get Users Error : {ex.Message}\n{ex.StackTrace}"); }
      return new List<PisUser>();
    }
      
  }
}