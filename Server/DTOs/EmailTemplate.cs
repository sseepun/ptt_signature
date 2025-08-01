namespace Server.DTOs
{
  public class ReqEmailTemplate
  {
    public int? Id { get; set; }
    public required string Name { get; set; }
    public required string Template { get; set; }
    public int Status { get; set; } = 0;
  }
}