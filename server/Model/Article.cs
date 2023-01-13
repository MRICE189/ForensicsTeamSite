#pragma warning disable CS8618
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace server.Models;

public class Article
{
    [Key]
    public int ArticleId { get; set; }
    public string? ArticleDescription { get; set; } 
    [Required]
    public string Link { get; set; } 
    [Required]
    public int PromptId {get;set;}
    
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    Prompt? Prompt {get;set;}
}