using Microsoft.EntityFrameworkCore;

namespace System.Models;

public class SystemDbContext(DbContextOptions<SystemDbContext> options) : DbContext(options)
{

  public DbSet<User> Users => Set<User>();
  public DbSet<EmailTemplate> EmailTemplates => Set<EmailTemplate>();

}