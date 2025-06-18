using task_management_backend.Models.Enums;
using TaskStatus = System.Threading.Tasks.TaskStatus;

namespace task_management_backend.Models;

public class Task
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public Priority Priority { get; set; }
    public Status Status { get; set; }
    public DateTime CreatedDate { get; set; }
    
}