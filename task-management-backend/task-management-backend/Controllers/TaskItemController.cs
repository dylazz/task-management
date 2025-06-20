using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using task_management_backend.Data;
using task_management_backend.Models;
using task_management_backend.Models.DTOs.Input;
using task_management_backend.Models.DTOs.Output;
using task_management_backend.Models.Services.Interfaces;

namespace task_management_backend.Controllers;

/// <summary>
/// Controller for Task related operations
/// </summary>
[ApiController]
[Route("[controller]")]
public class TaskItemController : ControllerBase
{
    private readonly ITaskItemService _taskItemService;
    private readonly ILogger<TaskItemController> _logger;

    public TaskItemController(ITaskItemService taskItemService, ILogger<TaskItemController> logger)
    {
        _taskItemService = taskItemService;
        _logger = logger;
    }
    
    /// <summary>
    /// Returns all TaskItems
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItemResponse>>> GetAllTaskItemsAsync()
    {
        try
        {
            var taskItems = await _taskItemService.GetAllTaskItemsAsync();
            return Ok(taskItems);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error retrieving tasks");
            return StatusCode(500, e.Message);
        }
    }
    
    /// <summary>
    /// Returns a TaskItem by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TaskItemResponse>> GetTaskItemByIdAsync(int id)
    {
        var taskItem = await _taskItemService.GetTaskItemByIdAsync(id);
        if (taskItem == null)
        {
            return NotFound();
        }
        return Ok(taskItem);
    }
    
    /// <summary>
    /// Inserts / Updates a TaskItem
    /// </summary>
    [HttpPut]
    public async Task<ActionResult<TaskItemResponse>> UpsertTaskAsync(TaskItemUpsert request)
    {
        var taskItem = await _taskItemService.UpsertTaskItemAsync(request);
        if(request.Id.HasValue && taskItem == null)
        {
            return NotFound($"Task with ID {request.Id} not found");
        }
        return request.Id.HasValue ? Ok(taskItem) : CreatedAtAction(nameof(GetTaskItemByIdAsync), new {id = taskItem!.Id}, taskItem);
    }
}