using task_management_backend.Models.DTOs.Input;
using task_management_backend.Models.DTOs.Output;

namespace task_management_backend.Models.Services.Interfaces;

public interface ITaskItemService
{
    Task<IEnumerable<TaskItemResponse>> GetAllTaskItemsAsync();
    Task<TaskItemResponse?> GetTaskItemByIdAsync(int id);
    Task<TaskItemResponse?> UpsertTaskItemAsync(TaskItemUpsert dto);
    Task<bool> DeleteTaskAsync(int id);
}