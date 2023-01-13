#pragma warning disable CS8618
using System.ComponentModel.DataAnnotations;
namespace server.Models;

public class Association
{
    [Key]
    public int AssociationId {get;set;}
    [Required]
    public int PromptId {get;set;}
    [Required]
    public int UserId {get;set;}
    public DateTime CreatedAt {get;set;} = DateTime.Now;
    public DateTime UpdatedAt {get;set;} = DateTime.Now;

    public Prompt? Prompt {get;set;}
    public User? User {get;set;}
}