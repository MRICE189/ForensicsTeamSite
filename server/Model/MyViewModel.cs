#pragma warning disable CS8618
namespace server.Models;
public class MyViewModel
{    
    public User User {get;set;}
    public List<User> AllUsers {get;set;}
    public Category Category {get;set;}
    public List<Category> AllCategories {get;set;}
    public Prompt Prompt {get;set;}
    public List<Prompt> AllPrompts {get;set;}
    public Article Article {get;set;}
    public List<Article> AllArticles {get;set;}
    public Association Association {get;set;}
    public List<Association> AllAssociations {get;set;}
    
}