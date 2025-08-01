#nullable enable

namespace Server.Models;

public partial class EmailTemplate
{
    public int? Id { get; set; }
    public required string Name { get; set; }
    public string? Template { get; set; }
    public int Status { get; set; } = 1;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}