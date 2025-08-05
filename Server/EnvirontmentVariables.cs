namespace Server.Extensions;

public static class EnvirontmentVariables
{
  public static string GetKeyValue(string key, IConfiguration config)
  {
    return config[key.Replace(":", "")] ?? config.GetSection(key).Value ?? "";
  }

  public static IServiceCollection AddEnvirontmentVariables(this WebApplicationBuilder builder) {
    List<string> keys = new List<string> {
      "TestAccounts",
      "Caa:ProjectName", "Caa:ProjectCode", "Caa:Url", "Caa:Username", "Caa:Password", "Caa:Config",
      "Jwt:Expire", "Jwt:Key", "Jwt:RefreshExpire", "Jwt:RefreshKey", "Jwt:Issuer", "Jwt:Audience",
    };
    foreach (string key in keys) {
      Environment.SetEnvironmentVariable(key, GetKeyValue(key, builder.Configuration));
    }

    Environment.SetEnvironmentVariable("ConnectionString", builder.Configuration.GetSection("ConnectionStrings:DefaultConnection").Value);
    return builder.Services;
  }
}