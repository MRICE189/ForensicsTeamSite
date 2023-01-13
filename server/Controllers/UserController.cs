using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace server.Controllers;
public class UserController : Controller
{
    private readonly ILogger<UserController> _logger;
    private MyContext _context;

    public UserController(ILogger<UserController> logger, MyContext context)
    {
        _logger = logger;
        _context = context;
    }

    //Create

    [HttpPost("api/users/create")]
    public IActionResult CreateUser([FromBody] User newUser)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        else
        {
            PasswordHasher<User> hasher = new PasswordHasher<User>();
            newUser.Password = hasher.HashPassword(newUser, newUser.Password);
            _context.Add(newUser);
            _context.SaveChanges();
            User? userInDb = _context.Users.FirstOrDefault(u => u.Email == newUser.Email);
            return Json(userInDb);
        }
    }

    [HttpPost("api/articles/{promptId}/create")]
    public IActionResult CreateArticles([FromBody] List<Article> promptArticlesList, int promptId)
    {
        foreach (Article article in promptArticlesList)
        {
            article.PromptId = promptId;
            if (ModelState.IsValid)
            {
                _context.Add(article);
                _context.SaveChanges();
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        return Ok(new {message = "successfully added articles"});
    }

    [HttpPost("api/prompts/create")]
    public IActionResult CreatePrompt([FromBody] Prompt newPrompt)
    {
        if (ModelState.IsValid)
        {
            _context.Add(newPrompt);
            _context.SaveChanges();
            return Json(newPrompt.PromptId);
        }
        else
        {
            return BadRequest(ModelState);
        }
    }

    [HttpPost("api/associations/{promptId}/{userId}/create")]
    public IActionResult CreateAssociation(int promptId, int userId)
    {
        Association newAssociation = new Association();
        newAssociation.UserId = userId;
        newAssociation.PromptId = promptId;
        if (ModelState.IsValid)
        {
            _context.Add(newAssociation);
            _context.SaveChanges();
            return Ok(new {message = "added association"});
        }
        else
        {
            return BadRequest(ModelState);
        }
    }

    //Read

    [HttpPost("api/users/login")]
    public IActionResult LoginUser([FromBody] LoginUser loginUser)
    {
        if (ModelState.IsValid)
        {
            User? userInDb = _context.Users.FirstOrDefault(u => u.Email == loginUser.LoginEmail);
            if (userInDb == null)
            {
                ModelState.AddModelError("LoginEmail", "Invalid credentials.");
                return BadRequest(ModelState);
            }
            PasswordHasher<LoginUser> hasher = new PasswordHasher<LoginUser>();
            var result = hasher.VerifyHashedPassword(loginUser, userInDb.Password, loginUser.LoginPassword);
            if (result == 0)
            {
                ModelState.AddModelError("LoginEmail", "Invalid credentials.");
                return BadRequest(ModelState);
            }
            //login success
            return Json(userInDb);
        }
        else
        {
            return BadRequest(ModelState);
        }
    }

    [HttpGet("api/prompts")]
    public IActionResult GetAllPrompts()
    {
        MyViewModel MyModel = new MyViewModel()
        {
            AllCategories = _context.Categories.ToList(),
            AllPrompts = _context.Prompts
                .Include(p => p.PromptCategory)
                .Include(p => p.PromptArticles)
                .Include(p => p.PromptAssociations)
                .ThenInclude(a => a.User)
                .ToList()
        };

        JsonSerializerOptions options = new JsonSerializerOptions()
        {
            WriteIndented = true,
            ReferenceHandler = ReferenceHandler.IgnoreCycles
        };
        string MyModelJson = JsonSerializer.Serialize<MyViewModel>(MyModel, options);
        return Json(MyModelJson);
    }

    [HttpGet("api/prompts/{userId}")]
    public IActionResult GetUserPrompts(int userId)
    {
        MyViewModel MyUserPromptsModel = new MyViewModel()
        {
            AllPrompts = _context.Prompts
                .Where(p => p.PromptAssociations
                .Any(a => a.UserId == userId))
                .Include(p => p.PromptArticles)
                .Include(p => p.PromptCategory)
                .Include(p => p.PromptAssociations)
                .ThenInclude(a => a.User)
                .ToList()
        };
        JsonSerializerOptions options = new JsonSerializerOptions()
        {
            WriteIndented = true,
            ReferenceHandler = ReferenceHandler.IgnoreCycles
        };
        string MyModelJson = JsonSerializer.Serialize<MyViewModel>(MyUserPromptsModel, options);
        return Json(MyModelJson);
    }

// Update

    [HttpPost("api/prompts/{promptId}/edit")]
    public IActionResult EditPrompt([FromBody] Prompt editPrompt, int promptId)
    {
        if (ModelState.IsValid)
        {
            System.Console.WriteLine("valid");
            Prompt promptToEdit = _context.Prompts.SingleOrDefault(p => p.PromptId == promptId);
            System.Console.WriteLine(promptToEdit);
            if (promptToEdit != null)
            {
                promptToEdit.Title = editPrompt.Title;
                promptToEdit.PromptDescription = editPrompt.PromptDescription;
                promptToEdit.CategoryId = editPrompt.CategoryId;
                promptToEdit.CreatorName = editPrompt.CreatorName;
                promptToEdit.UpdatedAt = DateTime.Now;
                _context.SaveChanges();
                return Json(promptToEdit);
            }
            else
            {
                // return BadRequest(new {message = " this "});
                return Ok(new {message = "this"});
            }
        }
        else
        {
            return BadRequest(ModelState);
        }
    }

    [HttpPost("api/articles/{promptId}/edit")]
    public IActionResult EditArticles([FromBody] List<Article> articlesToEdit, int promptId)
    {
        List<Article> promptArticles = _context.Articles.Where(a => a.PromptId == promptId).ToList();
        foreach (Article article in articlesToEdit)
        {
            article.PromptId = promptId;
            if (ModelState.IsValid)
            {
                if (!promptArticles.Any(a => a.Link == article.Link))
                {
                    _context.Add(article);
                    _context.SaveChanges();
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        return Ok(new {message = "updated articles"});
    }


//Delete

    [HttpPost("api/associations/{promptId}/{userId}/destroy")]
    public IActionResult DestroyAssociation(int promptId, int userId)
    {
        Association? assocInDb = _context.Associations.SingleOrDefault(a => a.PromptId == promptId && a.UserId == userId);
        if (assocInDb != null)
        {
            _context.Remove(assocInDb);
            _context.SaveChanges();
            return Ok(new {message = "successfully removed association"});
        }
        else
        {
            return BadRequest();
        }
    }

    [HttpPost("api/associations/{promptId}/destroy")]
    public IActionResult DestroyAllAssociations(int promptId)
    {
        List<Association> associationsToDestroy = _context.Associations.Where(a => a.PromptId == promptId).ToList();
        if (associationsToDestroy != null)
        {
            foreach (Association association in associationsToDestroy)
            {
                _context.Remove(association);
                _context.SaveChanges();
            }
        }
        return Ok(new {message = "success"});
    }

    [HttpPost("api/articles/{promptId}/destroy")]
    public IActionResult DestroyArticles(int promptId)
    {
        List<Article> articlesToDestroy = _context.Articles.Where(a => a.PromptId == promptId).ToList();
        if (articlesToDestroy != null)
        {
            foreach (Article article in articlesToDestroy)
            {
                _context.Remove(article);
                _context.SaveChanges();
            }
            return Ok(new {message = "successfully removed articles"});
        }
        else
        {
            return BadRequest();
        }
    }

    [HttpPost("api/prompts/{promptId}/destroy")]
    public IActionResult DestroyPrompt(int promptId)
    {
        Prompt? promptToDestroy = _context.Prompts.SingleOrDefault(p => p.PromptId == promptId);
        if (promptToDestroy != null)
        {
            _context.Remove(promptToDestroy);
            _context.SaveChanges();
            return Ok(new {message = "successfully deleted prompt"});
        }
        else 
        {
            return BadRequest();
        }
    }
}

