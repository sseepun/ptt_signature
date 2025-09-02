using System.Text;
using System.Text.Json;
using Server.DTOs;
using Newtonsoft.Json;
using Server.Models;

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
    private readonly SystemDbContext _db;
    private IHttpClientFactory _clientFactory;
    public PisService(SystemDbContext db, IHttpClientFactory clientFactory) {
      _db = db;
      _clientFactory = clientFactory;
    }

    public string? GetVariable(string key) {
      var config = _db.Configs
        .Where(d => d.Name == $"Pis{key}")
        .FirstOrDefault();
      return config == null ? "" : config.Value;
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

    public async Task<PisDepartment> GetDepartment(string token, string? unitCode) {
      try {
        if(string.IsNullOrEmpty(token) || string.IsNullOrEmpty(unitCode)) return new PisDepartment();

        var url = GetVariable("Url");
        if (string.IsNullOrEmpty(url)) return new PisDepartment();

        string endpoint = "/Unit/S4/1.0.0/Unit";
        var request = new HttpRequestMessage(HttpMethod.Get, $"{url}{endpoint}?Search_UnitCode={unitCode}");
        request.Headers.Add("Authorization", "Bearer " + token);
        request.Headers.Add("Accept", "application/json");

        var client = _clientFactory.CreateClient();
        var response = await client.SendAsync(request);
        if(!response.IsSuccessStatusCode) return new PisDepartment();

        var content = await response.Content.ReadAsStringAsync();
        var resultData = JsonConvert.DeserializeObject<PisDepartmentsMain>(content);
        var result = resultData?.Entries.Entry ?? new List<PisDepartment>();
        return result.FirstOrDefault() ?? new PisDepartment();
      } catch (Exception ex) { Console.WriteLine($"\nPhone Directory Get Departments Error : {ex.Message}\n{ex.StackTrace}"); }
      return new PisDepartment();
  }

    public async Task<PisPosition> GetPosition(string token, string? posCode) {
      try {
        if(string.IsNullOrEmpty(token) || string.IsNullOrEmpty(posCode)) return new PisPosition();

        var url = GetVariable("Url");
        if (string.IsNullOrEmpty(url)) return new PisPosition();

        string endpoint = "/Position/S4/1.0.0/Position";
        var request = new HttpRequestMessage(HttpMethod.Get, $"{url}{endpoint}?Search_PositionCode={posCode}");
        request.Headers.Add("Authorization", "Bearer " + token);
        request.Headers.Add("Accept", "application/json");

        var client = _clientFactory.CreateClient();
        var response = await client.SendAsync(request);
        if(!response.IsSuccessStatusCode) return new PisPosition();

        var content = await response.Content.ReadAsStringAsync();
        var resultData = JsonConvert.DeserializeObject<PisPositionsMain>(content);
        var result = resultData?.Entries.Entry ?? new List<PisPosition>();
        return result.FirstOrDefault() ?? new PisPosition();
      } catch (Exception ex) { Console.WriteLine($"\nPhone Directory Get Positions Error : {ex.Message}\n{ex.StackTrace}"); }
      return new PisPosition();
  }

    public async Task<List<User>> ResultUsers(string token, List<PisUser> resultData)
    {
      List<User> result = new List<User>();
      foreach (PisUser entry in resultData)
      {
        var department = await GetDepartment(token, entry.UNITCODE);
        var position = await GetPosition(token, entry.POSCODE);
        result.Add(new User
        {
          Prefix = entry.INAME,
          PrefixEN = entry.INAME_ENG,
          FirstName = entry.FNAME,
          FirstNameEN = entry.FNAME_ENG,
          LastName = entry.LNAME,
          LastNameEN = entry.LNAME_ENG,
          EmployeeId = entry.CODE,
          Title = position.t_name ?? "",
          TitleEN = position.e_name ?? "",
          Email = entry.EmailAddr ?? "",
          Telephone = entry.OFFICETEL ?? "",
          Mobile = entry.Mobile ?? "",
          DepartmentCode = department.unitcode,
          Department = department.longname,
          DepartmentEN = department.engname,
          DepartmentLong = department.longname,
          DepartmentAbbr = department.unitabbr,
        });
      }
      return result;
    }

    public async Task<List<User>> GetUsers(string employeeId)
    {
      try
      {
        var token = await GetAuthToken();
        if (string.IsNullOrEmpty(token)) return new List<User>();

        var url = GetVariable("Url");
        if (string.IsNullOrEmpty(url)) return new List<User>();

        string endpoint = "/PersonelInfo/S4/1.0.0/PersonelInfo";
        var request = new HttpRequestMessage(HttpMethod.Get, $"{url}{endpoint}?Search_EmployeeCode={employeeId}");
        request.Headers.Add("Authorization", "Bearer " + token);
        request.Headers.Add("Accept", "application/json");

        var client = _clientFactory.CreateClient();
        var response = await client.SendAsync(request);
        if (!response.IsSuccessStatusCode) return new List<User>();

        var content = await response.Content.ReadAsStringAsync();
        var resultData = JsonConvert.DeserializeObject<PisUsersMain>(content);
        var result = await ResultUsers(token, resultData?.entries.entry ?? new List<PisUser>());
        return result;
      }
      catch (Exception ex) { Console.WriteLine($"\nPhone Directory Get Users Error : {ex.Message}\n{ex.StackTrace}"); }
      return new List<User>();
    }
      
  }
}