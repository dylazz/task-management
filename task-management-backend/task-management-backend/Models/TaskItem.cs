using System.ComponentModel.DataAnnotations;
using task_management_backend.Models.Enums;

namespace task_management_backend.Models;

public class TaskItem
{
    public int Id { get; init; }

    [Required] 
    [MaxLength(100)] 
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    public Priority Priority { get; set; }
    public Status Status { get; set; }
    public DateTime CreatedDate { get; init; }
    
}