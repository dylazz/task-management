using Microsoft.EntityFrameworkCore;
using task_management_backend.Data;
using task_management_backend.Models.DTOs.Input;
using task_management_backend.Models.DTOs.Output;
using task_management_backend.Models.Enums;
using task_management_backend.Models.Services.Interfaces;
using Task = task_management_backend.Models.Task;


public class TaskService : ITaskService
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<TaskService> _logger;

    public TaskService(AppDbContext dbContext, ILogger<TaskService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }
    
    public async Task<IEnumerable<TaskResponse>> GetAllTasksAsync()
    {
        try
        {
            return await _dbContext.Tasks
                .Select(t => MapToResponse(t))
                .ToListAsync();
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error getting all tasks");
            throw;
        }
    }
    
    public async Task<TaskResponse?> GetTaskByIdAsync(int id)
    {
        try
        {
            var task = await _dbContext.Tasks.FindAsync(id);
            return task == null ? null : MapToResponse(task);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error getting task by id");
            throw;
        }
    }

    public async Task<TaskResponse?> UpsertTaskAsync(TaskUpsert dto)
    {
        try
        {
            var task = new Task
            {
                Title = dto.Title,
                Description = dto.Description,
                Priority = dto.Priority,
                Status = dto.Status ?? Status.Todo,
                CreatedDate = DateTime.Now
            };
            _dbContext.Tasks.Add(task);
            await _dbContext.SaveChangesAsync();

            return MapToResponse(task);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error upserting task");
            throw;
        }
    }
    
    public async Task<bool> DeleteTaskAsync(int id)
    {
        var task = await _dbContext.Tasks.FindAsync(id);
    
        if (task == null)
        {
            return false;
        }

        _dbContext.Tasks.Remove(task);
        await _dbContext.SaveChangesAsync();
    
        return true;

    }
    
    private static TaskResponse MapToResponse(Task task) => new(
        task.Id,
        task.Title,
        task.Description,
        task.Priority,
        task.Status,
        task.CreatedDate
    );

}