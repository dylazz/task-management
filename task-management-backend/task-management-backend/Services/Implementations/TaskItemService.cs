using Microsoft.EntityFrameworkCore;
using task_management_backend.Data;
using task_management_backend.Models.DTOs.Input;
using task_management_backend.Models.DTOs.Output;
using task_management_backend.Models.Enums;
using task_management_backend.Models.Services.Interfaces;

namespace task_management_backend.Models.Services;

public class TaskItemService : ITaskItemService
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<TaskItemService> _logger;

    public TaskItemService(AppDbContext dbContext, ILogger<TaskItemService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<IEnumerable<TaskItemResponse>> GetAllTaskItemsAsync()
    {
        try
        {
            return await _dbContext.TaskItems
                .Select(t => MapToResponse(t))
                .ToListAsync();
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error getting all tasks");
            throw;
        }
    }

    public async Task<TaskItemResponse?> GetTaskItemAsync(int id)
    {
        try
        {
            var taskItem = await _dbContext.TaskItems.FindAsync(id);
            return taskItem == null ? null : MapToResponse(taskItem);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error getting task by ID {id}", id);
            throw;
        }
    }

    public async Task<TaskItemResponse> CreateTaskItemAsync(TaskItemCreate dto)
    {
        try
        {
            var taskItem = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description ?? string.Empty,
                Priority = dto.Priority ?? Priority.Low,
                Status = dto.Status ?? Status.Incomplete,
                CreatedDate = DateTime.UtcNow
            };

            _dbContext.TaskItems.Add(taskItem);
            await _dbContext.SaveChangesAsync();

            return MapToResponse(taskItem);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error creating task item");
            throw;
        }
    }

    public async Task<TaskItemResponse?> UpdateTaskItemAsync(int id, TaskItemUpdate dto)
    {
        try
        {
            var taskItem = await _dbContext.TaskItems.FindAsync(id);
            if (taskItem == null)
            {
                return null;
            }

            // Only update properties that are provided
            if (dto.Title != null)
                taskItem.Title = dto.Title;

            if (dto.Description != null)
                taskItem.Description = dto.Description;

            if (dto.Priority.HasValue)
                taskItem.Priority = dto.Priority.Value;

            if (dto.Status.HasValue)
                taskItem.Status = dto.Status.Value;

            await _dbContext.SaveChangesAsync();
            return MapToResponse(taskItem);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error updating task item {Id}", id);
            throw;
        }
    }

    public async Task<bool> DeleteTaskItemAsync(int id)
    {
        try
        {
            var taskItem = await _dbContext.TaskItems.FindAsync(id);

            if (taskItem == null)
            {
                return false;
            }

            _dbContext.TaskItems.Remove(taskItem);
            await _dbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error deleting task item {Id}", id);
            throw;
        }
    }

    private static TaskItemResponse MapToResponse(TaskItem taskItem) => new(
        taskItem.Id,
        taskItem.Title,
        taskItem.Description,
        taskItem.Priority,
        taskItem.Status,
        taskItem.CreatedDate
    );
}