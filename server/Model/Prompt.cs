#pragma warning disable CS8618
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace server.Models;

public class Prompt
{
    [Key]
    public int PromptId { get; set; }
    [Required]
    public string Title { get; set; } 
    [Required]
    public string PromptDescription { get; set; } 
    [Required]
    public int CategoryId {get;set;}
    [Required]
    public string CreatorName {get;set;}
    
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    public List<Association> PromptAssociations {get;set;} = new List<Association>();
    public List<Article> PromptArticles {get;set;} = new List<Article>();
    public Category? PromptCategory {get;set;}

}