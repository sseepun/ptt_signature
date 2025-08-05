namespace Server.DTOs
{
  public class ReqAuthSigninAD
  {
    public required string TenantId { get; set; }
    public required string ClientId { get; set; }
    public required string AccessToken { get; set; }
    public required string LocalAccountId { get; set; }
    public required string HomeAccountId { get; set; }
    public required string Name { get; set; }
    public required string Username { get; set; }
    public required string IdToken { get; set; }
  }
  public class ResAuthSigninAD
  {
    public bool Success { get; set; } = true;
    public string? Message { get; set; }
    public string? UserId { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
  }
  public class ReqAuthRefresh
  {
    public string? RefreshToken { get; set; }
  }
}