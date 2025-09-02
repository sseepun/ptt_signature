namespace Server.DTOs
{
  public class ReqUserAdmin
  {
    public int? Id { get; set; }
    public string? EmployeeId { get; set; }
  }
  public class ReqUserAdminlDelete
  {
    public required int Id { get; set; }
  }
}