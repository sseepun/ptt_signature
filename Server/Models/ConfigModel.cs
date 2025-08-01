#nullable enable

namespace Server.Models;

public partial class Config
{
    public int? Id { get; set; }
    public required string Name { get; set; }
    public string? Value { get; set; }
}