namespace Server.DTOs
{

  public class PisUsersMain
  {
    public required PisUsers entries { get; set; }
  }
  public class PisUsers
  {
    public required List<PisUser> entry { get; set; }
  }
  public class PisUser
  {
    public string? INAME { get; set; }
    public string? INAME_ENG { get; set; }
    public required string FNAME { get; set; }
    public string? FNAME_ENG { get; set; }
    public required string LNAME { get; set; }
    public string? LNAME_ENG { get; set; }
    public string? UNITCODE { get; set; }
    public string? CODE { get; set; }
    public string? POSNAME { get; set; }
    public string? POSCODE { get; set; }
    public string? FULLNAMETH { get; set; }
    public string? FULLNAMEENG { get; set; }
  }
    
}