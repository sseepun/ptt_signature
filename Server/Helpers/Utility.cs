
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Server.Models;

namespace Server.Helpers
{
  public static class SUtility
  {

    public static List<string> GetTestAccounts()
    {
      var testAccounts = Environment.GetEnvironmentVariable("TestAccounts") ?? "";
      return testAccounts.Split(",").ToList();
    }
    
    public static string GenerateAccessToken(User user) {
      var expires = DateTime.Now.AddDays(Convert.ToDouble(
        Environment.GetEnvironmentVariable("Jwt:Expire") ?? "1"
      ));
      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
        Environment.GetEnvironmentVariable("Jwt:Key")!
      ));
      var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
        issuer: Environment.GetEnvironmentVariable("Jwt:Issuer") ?? "PTT E-Mail Signature",
        audience: Environment.GetEnvironmentVariable("Jwt:Audience") ?? "PTT E-Mail Signature",
        expires: expires,
        signingCredentials: credentials,
        claims: [
          new Claim("Id", user.Id.ToString()),
        ]
      );
      return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public static string GenerateRefreshToken(User user) {
      var expires = DateTime.Now.AddDays(Convert.ToDouble(
        Environment.GetEnvironmentVariable("Jwt:RefreshExpire") ?? "1"
      ));
      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
        Environment.GetEnvironmentVariable("Jwt:RefreshKey")!
      ));
      var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
        issuer: Environment.GetEnvironmentVariable("Jwt:Issuer") ?? "PTT E-Mail Signature",
        audience: Environment.GetEnvironmentVariable("Jwt:Audience") ?? "PTT E-Mail Signature",
        expires: expires,
        signingCredentials: credentials,
        claims: [
          new Claim("Id", user.Id.ToString()),
        ]
      );
      return new JwtSecurityTokenHandler().WriteToken(token);
    }
  
  }
}