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

    public string? EmailAddr { get; set; }
    public string? OFFICETEL { get; set; }
    public string? Mobile { get; set; }
  }


  public class PisDepartmentsMain
  {
    public required PisDepartments Entries {get; set;}
  }
  public class PisDepartments
  {
    public required List<PisDepartment> Entry {get; set;}
  }
  public class PisDepartment
  {
    public string? unitcode { get; set; }
    public string? unitname { get; set; }
    public string? engname { get; set; }
    public string? longname { get; set; }
    public string? unitabbr { get; set; }
  }
    

  public class PisPositionsMain
  {
    public required PisPositions Entries {get; set;}
  }
  public class PisPositions
  {
    public required List<PisPosition> Entry {get; set;}
  }
  public class PisPosition
  {
    public string? poscode { get; set; }
    public string? t_name { get; set; }
    public string? e_name { get; set; }
  }
    
}