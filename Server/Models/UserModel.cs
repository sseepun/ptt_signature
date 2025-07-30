#nullable enable

namespace System.Models;

public partial class User
{
    public int Id { get; set; }
    public Int64? EmployeeId { get; set; }
    public string? Department { get; set; }
    public int IsAdmin { get; set; } = 0;
    public string? Title { get; set; }
    public string? Prefix { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }

    public required string Email { get; set; }
    public string? Avatar { get; set; }

    public int Status { get; set; } = 1;

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
}