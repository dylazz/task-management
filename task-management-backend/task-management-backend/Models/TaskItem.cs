using task_management_backend.Models.Enums;

namespace task_management_backend.Models;

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public Priority Priority { get; set; }
    public Status Status { get; set; }
    public DateTime CreatedDate { get; set; }
    
}