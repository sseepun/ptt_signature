using System.Text.Json;
using Server.Models;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Server.DTOs;

namespace Server.AuthMiddleware {
  public class AuthMiddleware
  {
    private readonly RequestDelegate _next;
    public AuthMiddleware(RequestDelegate next) { _next = next; }

    private SystemDbContext CreateDbContext()
    {
      var optionsBuilder = new DbContextOptionsBuilder<SystemDbContext>();
      optionsBuilder.UseSqlServer(Environment.GetEnvironmentVariable("ConnectionString"));
      return new SystemDbContext(optionsBuilder.Options);
    }

    private string GetAccessToken(HttpContext context)
    {
      var authHeader = context.Request.Headers["Authorization"];
      if (authHeader.Count == 0) return "";
      var accessToken = (authHeader.First() ?? "").Replace("Bearer ", "");
      if (string.IsNullOrEmpty(accessToken)) return "";
      return accessToken;
    }

    private MiddlewareAuth FindUser(SystemDbContext _db, string accessToken)
    {
      User? user = _db.Users.Where(d => d.AccessToken == accessToken && d.Status == 1)
        .Select(d => new User { Id = d.Id, EmployeeId = d.EmployeeId, IsAdmin = d.IsAdmin, Title = d.Title, Prefix = d.Prefix, FirstName = d.FirstName, LastName = d.LastName, Email = d.Email })
        .FirstOrDefault();
      if (user != null)
      {
        user.UpdatedAt = DateTime.Now;
        _db.SaveChanges();
      }
      return new MiddlewareAuth { Type = "Internal", User = user };
    }

    private ClaimsPrincipal GeneratePrinciple(string userId, string role)
    {
      var claims = new List<Claim> { new(ClaimTypes.NameIdentifier, userId), new(ClaimTypes.Role, role) };
      var identity = new ClaimsIdentity(claims, "custom");
      return new ClaimsPrincipal(identity);
    }

    private void MainMiddlewareProcess(HttpContext context, SystemDbContext _db)
    {
      var accessToken = GetAccessToken(context);
      if (!string.IsNullOrEmpty(accessToken))
      {
        var result = FindUser(_db, accessToken);
        if (result.User != null)
        {
          User user = result.User;
          var role = user.IsAdmin == 1 ? "Admin" : "User";
          context.User = GeneratePrinciple(user.Id.ToString(), role);
          context.Items["User"] = user;
          context.Items["Role"] = role;
        }
      }
    }

    public async Task InvokeAsync(HttpContext context)
    {
      try
      {
        if (context.Response.StatusCode == 400)
        {
          context.Response.ContentType = "application/json";
          context.Response.StatusCode = 400;
          await context.Response.WriteAsync(JsonSerializer.Serialize(new { Status = 400, Message = "Internal server error." })); return;
        }

        using (var _db = CreateDbContext())
        {
          try
          {
            MainMiddlewareProcess(context, _db);
          }
          catch (Exception ex) { Console.WriteLine($"\nMiddleware Auth Error : {ex.Message}\n{ex.StackTrace}"); }
        }

        await _next(context); return;
      }
      catch (Exception ex)
      {
        Console.WriteLine($"\nAPI Error : {context.Request.Path} \n{ex.Message}\n{ex.StackTrace}");
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync(JsonSerializer.Serialize(new { Status = 500, Message = "API not found." })); return;
      }
    }
    
  }
}