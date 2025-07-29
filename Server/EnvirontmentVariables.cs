namespace Server.Extensions;

public static class EnvirontmentVariables
{
  public static string GetKeyValue(string key, IConfiguration config)
  {
    return config[key.Replace(":", "")] ?? config.GetSection(key).Value ?? "";
  }

  public static IServiceCollection AddEnvirontmentVariables(this WebApplicationBuilder builder) {
    List<string> keys = new List<string> {
      "Caa:ProjectName", "Caa:ProjectCode", "Caa:Url",
      "Caa:Username", "Caa:Password", "Caa:Config",
    };
    foreach (string key in keys) {
      Environment.SetEnvironmentVariable(key, GetKeyValue(key, builder.Configuration));
    }

    return builder.Services;
  }
}