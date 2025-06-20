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
    [ProducesResponseType(typeof(IEnumerable<TaskItemResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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
            return Problem("An error occurred while retrieving tasks", statusCode: StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    /// Returns a TaskItem by ID
    /// </summary>
    [HttpGet("{id}")]
    [ActionName(nameof(GetTaskItemByIdAsync))]
    [ProducesResponseType(typeof(TaskItemResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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
    [ProducesResponseType(typeof(TaskItemResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(TaskItemResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TaskItemResponse>> UpsertTaskAsync(TaskItemUpsert request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var taskItem = await _taskItemService.UpsertTaskItemAsync(request);
        if (request.Id.HasValue)
        {
            if (taskItem == null)
            {
                return NotFound($"Task with ID {request.Id} not found");
            }

            return Ok(taskItem);
        }
        return CreatedAtAction(
            nameof(GetTaskItemByIdAsync),
            new { id = taskItem!.Id },
            taskItem
        );
    }
    
    /// <summary>
    /// Deletes a TaskItem by ID
    /// </summary>
    
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<bool>> DeleteTaskAsync(int id)
    {
        var taskItem = await _taskItemService.DeleteTaskAsync(id);
        if (!taskItem)
        {
            return NotFound($"Task with ID {id} not found");
        }
        return NoContent();
    }
}