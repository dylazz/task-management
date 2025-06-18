using task_management_backend.Models.DTOs.Input;
using task_management_backend.Models.DTOs.Output;

namespace task_management_backend.Models.Services.Interfaces;

public interface ITaskService
{
    Task<IEnumerable<TaskResponse>> GetAllTasksAsync();
    Task<TaskResponse?> GetTaskByIdAsync(int id);
    Task<TaskResponse?> UpsertTaskAsync(TaskUpsert dto);
    Task<bool> DeleteTaskAsync(int id);
}