using Microsoft.AspNetCore.Mvc;
using task_management_backend.Models.DTOs.Input;
using task_management_backend.Models.DTOs.Output;
using task_management_backend.Models.Services.Interfaces;

namespace task_management_backend.Controllers;

/// <summary>
/// Controller for Task related operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TaskItemController : ControllerBase
{
    private readonly ITaskItemService _taskItemService;

    public TaskItemController(ITaskItemService taskItemService, ILogger<TaskItemController> logger)
    {
        _taskItemService = taskItemService;
    }

    /// <summary>
    /// Returns all tasks
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TaskItemResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<TaskItemResponse>>> GetAllTaskItemsAsync()
    {
        var taskItems = await _taskItemService.GetAllTaskItemsAsync();
        return Ok(taskItems);
    }

    /// <summary>
    /// Returns a task by ID
    /// </summary>
    /// <param name="id">The ID of the task to get</param>
    [HttpGet("{id}")]
    [ActionName(nameof(GetTaskItemByIdAsync))]
    [ProducesResponseType(typeof(TaskItemResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<TaskItemResponse>> GetTaskItemByIdAsync(int id)
    {
        var taskItem = await _taskItemService.GetTaskItemByIdAsync(id);
        if (taskItem == null)
        {
            return NotFound($"Task with ID {id} not found");
        }
        
        return Ok(taskItem);
    }

    /// <summary>
    /// Creates a new task
    /// </summary>
    /// <param name="request">The task to create</param>
    [HttpPost]
    [ProducesResponseType(typeof(TaskItemResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<TaskItemResponse>> CreateTaskAsync(TaskItemCreate request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var taskItem = await _taskItemService.CreateTaskItemAsync(request);
        return CreatedAtAction(
            nameof(GetTaskItemByIdAsync),
            new { id = taskItem.Id },
            taskItem
        );
    }

    /// <summary>
    /// Updates a task
    /// </summary>
    /// <param name="id">The ID of the task to update</param>
    /// <param name="request">The fields to update</param>
    [HttpPatch("{id}")]
    [ProducesResponseType(typeof(TaskItemResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<TaskItemResponse>> UpdateTaskAsync(int id, TaskItemUpdate request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var taskItem = await _taskItemService.UpdateTaskItemAsync(id, request);
        if (taskItem == null)
        {
            return NotFound($"Task with ID {id} not found");
        }

        return Ok(taskItem);
    }

    /// <summary>
    /// Deletes a task by ID
    /// </summary>
    /// <param name="id">The ID of the TaskItem to delete</param>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteTaskAsync(int id)
    {
        var taskItem = await _taskItemService.DeleteTaskItemAsync(id);
        if (!taskItem)
        {
            return NotFound($"Task with ID {id} not found");
        }
        
        return NoContent();
    }
}