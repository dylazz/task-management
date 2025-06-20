using Microsoft.EntityFrameworkCore;
using task_management_backend.Data;
using task_management_backend.Models;
using task_management_backend.Models.DTOs.Input;
using task_management_backend.Models.DTOs.Output;
using task_management_backend.Models.Enums;
using task_management_backend.Models.Services.Interfaces;


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
    
    public async Task<TaskItemResponse?> GetTaskItemByIdAsync(int id)
    {
        try
        {
            var taskItem = await _dbContext.TaskItems.FindAsync(id);
            return taskItem == null ? null : MapToResponse(taskItem);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error getting task by id");
            throw;
        }
    }

    public async Task<TaskItemResponse?> UpsertTaskItemAsync(TaskItemUpsert dto)
    {
        try
        {
            TaskItem taskItem;
        
            if (dto.Id.HasValue)
            {
                // Update existing task
                taskItem = await _dbContext.TaskItems.FindAsync(dto.Id.Value);
                if (taskItem == null)
                {
                    return null;
                }
            
                // Update properties
                taskItem.Title = dto.Title;
                taskItem.Description = dto.Description;
                taskItem.Priority = dto.Priority;
                taskItem.Status = dto.Status ?? taskItem.Status;
            }
            else
            {
                // Create new task
                taskItem = new TaskItem
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    Priority = dto.Priority,
                    Status = dto.Status ?? Status.Todo,
                    CreatedDate = DateTime.UtcNow
                };
                _dbContext.TaskItems.Add(taskItem);
            }

            await _dbContext.SaveChangesAsync();
            return MapToResponse(taskItem);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error upserting task");
            throw;
        }
    }
    
    public async Task<bool> DeleteTaskAsync(int id)
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
    
    private static TaskItemResponse MapToResponse(TaskItem taskItem) => new(
        taskItem.Id,
        taskItem.Title,
        taskItem.Description,
        taskItem.Priority,
        taskItem.Status,
        taskItem.CreatedDate
    );

}