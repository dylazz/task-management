using task_management_backend.Models.DTOs.Input;
using task_management_backend.Models.DTOs.Output;

namespace task_management_backend.Models.Services.Interfaces;

public interface ITaskService
{
    Task<IEnumerable<TaskResponse>> GetAllTasks();
    Task<TaskResponse?> GetTaskById();
    Task<TaskResponse?> UpsertTaskAsync(TaskUpsert dto);
    Task<bool> DeleteTaskAsync(int id);
}