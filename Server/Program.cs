using Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Server.Extensions;
using Server.Services;
using Server.AuthMiddleware;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
builder.AddEnvirontmentVariables();
builder.Services.AddHttpClient();
builder.Services.AddScoped<AzureAdService>();
builder.Services.AddScoped<PisService>();

builder.Services.AddControllers()
    .AddJsonOptions(options => { options.JsonSerializerOptions.PropertyNamingPolicy = null; });

builder.Services.AddTransient<SystemDbContext>();
builder.Services.AddDbContext<SystemDbContext>(options => {
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
        .UseSeeding((context, serviceProvider) => {
            var dbConfig = context.Set<Config>();
            var exists = dbConfig.Where(d => d.Name == "PisTokenUrl").FirstOrDefault();
            if (exists == null) {
                dbConfig.Add(new Config { Name = "PisTokenUrl", Value = "https://pttapi-dev.pttplc.com/oauth2/token" });
                dbConfig.Add(new Config { Name = "PisTokenUsername", Value = "BpJWgmtedCWbwLDmwjBcTgZT8S8a" });
                dbConfig.Add(new Config { Name = "PisTokenPassword", Value = "f0XROG5F5FU2FMqOWE21mf89BXYa" });
                dbConfig.Add(new Config { Name = "PisUrl", Value = "https://pttapigw-dev.pttplc.com/PTT_PIS" });
                context.SaveChanges();
            }
        });
});

builder.Services.AddAuthentication(option => { option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme; })
    .AddJwtBearer(options => { options.TokenValidationParameters = new TokenValidationParameters{ ValidateIssuer = true, ValidateAudience = true, ValidateLifetime = true, ValidateIssuerSigningKey = true }; });

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseMiddleware<AuthMiddleware>();
// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();