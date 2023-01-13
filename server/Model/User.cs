#pragma warning disable CS8618
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace server.Models;

public class User
{
    [Key]
    public int UserId { get; set; }
    [Required]
    [Display(Name = "First Name")]
    public string FirstName { get; set; } 
    [Required]
    [Display(Name = "Last Name")]
    public string LastName { get; set; } 
    [EmailAddress]
    [UniqueEmail]
    public string Email { get; set; }
    public bool IsAdmin {get;set;} = false;
    [Required]
    [DataType(DataType.Password)]
    [MinLength(8)]
    public string Password { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    [NotMapped]
    [Compare("Password")]
    [DataType(DataType.Password)]
    [Display(Name = "Confirm Password")]
    public string ConfirmPw {get;set;}

    public List<Association> UserAssociations {get;set;} = new List<Association>();
}

public class UniqueEmailAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if(value == null)
        {
            return new ValidationResult("Email is required!");
        }
    	// This will connect us to our database since we are not in our Controller
        MyContext _context = (MyContext)validationContext.GetService(typeof(MyContext));
        // Check to see if there are any records of this email in our database
        if (_context.Users.Any(e => e.Email == value.ToString()))
        {
            // If yes, throw an error
            return new ValidationResult("Email must be unique!");
        }
        else
        {
            // If no, proceed
            return ValidationResult.Success;
        }
    }
}