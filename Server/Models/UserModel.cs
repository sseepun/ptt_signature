#nullable enable

namespace Server.Models;

public partial class User
{
    public int Id { get; set; }
    public int IsAdmin { get; set; } = 0;

    public string? Prefix { get; set; }
    public string? PrefixEN { get; set; }
    public string? FirstName { get; set; }
    public string? FirstNameEN { get; set; }
    public string? LastName { get; set; }
    public string? LastNameEN { get; set; }

    public string? EmployeeId { get; set; }
    public string? Title { get; set; }
    public string? TitleEN { get; set; }

    public string? Email { get; set; }
    public string? Telephone { get; set; }
    public string? Mobile { get; set; }
    public string? Avatar { get; set; }

    public int Status { get; set; } = 1;

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }

    public string? DepartmentCode { get; set; }
    public string? Department { get; set; }
    public string? DepartmentEN { get; set; }
    public string? DepartmentLong { get; set; }
    public string? DepartmentAbbr { get; set; }
}