using task_management_backend.Models.DTOs.Input;
using task_management_backend.Models.DTOs.Output;

namespace task_management_backend.Models.Services.Interfaces;

public interface ITaskItemService
{
    Task<IEnumerable<TaskItemResponse>> GetAllTaskItemsAsync();
    Task<TaskItemResponse> CreateTaskItemAsync(TaskItemCreate dto);
    Task<TaskItemResponse?> UpdateTaskItemAsync(int id, TaskItemUpdate dto);
    Task<bool> DeleteTaskItemAsync(int id);
}