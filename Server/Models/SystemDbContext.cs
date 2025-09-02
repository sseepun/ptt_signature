using Microsoft.EntityFrameworkCore;

namespace Server.Models;

public class SystemDbContext(DbContextOptions<SystemDbContext> options) : DbContext(options)
{

  public DbSet<Config> Configs => Set<Config>();
  public DbSet<User> Users => Set<User>();
  public DbSet<EmailTemplate> EmailTemplates => Set<EmailTemplate>();

}