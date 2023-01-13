#pragma warning disable CS8618
using System.ComponentModel.DataAnnotations;
namespace server.Models;

public class LoginUser
{
    [Required]
    [EmailAddress]
    [Display(Name = "Email")]
    public string LoginEmail { get; set; }
    [Required]
    [DataType(DataType.Password)]
    [MinLength(8)]
    [Display(Name = "Password")]
    public string LoginPassword { get; set; }
}