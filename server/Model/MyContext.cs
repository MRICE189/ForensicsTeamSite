#pragma warning disable CS8618
using Microsoft.EntityFrameworkCore;
namespace server.Models;
public class MyContext : DbContext 
{   
    public MyContext(DbContextOptions options) : base(options) {}
    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Prompt> Prompts { get; set; }
    public DbSet<Article> Articles { get; set; }
    public DbSet<Association> Associations { get; set; }
}