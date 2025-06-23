using task_management_backend.Models.DTOs.Input;
using task_management_backend.Models.DTOs.Output;
using task_management_backend.Models.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using task_management_backend.Controllers;
using FluentAssertions;
using task_management_backend.Models.Enums;

namespace task_management_backend.Tests.Controllers;

public class TaskItemControllerTests
{
    private readonly Mock<ITaskItemService> _mockTaskItemService;
    private readonly TaskItemController _taskItemController;

    public TaskItemControllerTests()
    {
        _mockTaskItemService = new Mock<ITaskItemService>();
        var mockLogger = new Mock<ILogger<TaskItemController>>();
        _taskItemController = new TaskItemController(_mockTaskItemService.Object, mockLogger.Object);
    }

    #region GetAllTaskItemsAsync Tests
    
    [Fact]
    public async Task GetAllTaskItemsAsync_ShouldReturnOk_WhenTasksExist()
    {
        // Arrange - Set up mock service behavior
        var expectedTasks = new List<TaskItemResponse>
        {
            new(1, "Task 1", "Description 1", Priority.High, Status.Incomplete, DateTime.UtcNow),
            new(2, "Task 2", "Description 2", Priority.Medium, Status.Complete, DateTime.UtcNow)
        };
        // Configure mock to return test data
        _mockTaskItemService.Setup(s => s.GetAllTaskItemsAsync())
                           .ReturnsAsync(expectedTasks);

        // Act - Call the controller method
        var result = await _taskItemController.GetAllTaskItemsAsync();

        // Assert - Verify the HTTP response
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedTasks = okResult.Value.Should().BeAssignableTo<IEnumerable<TaskItemResponse>>().Subject;
        returnedTasks.Should().HaveCount(2);
        returnedTasks.Should().BeEquivalentTo(expectedTasks);
    }

    [Fact]
    public async Task GetAllTaskItemsAsync_ShouldReturnOk_WhenNoTasksExist()
    {
        // Arrange - Mock service returns empty list
        _mockTaskItemService.Setup(s => s.GetAllTaskItemsAsync())
                           .ReturnsAsync(new List<TaskItemResponse>());

        // Act
        var result = await _taskItemController.GetAllTaskItemsAsync();

        // Assert - Should still return 200 OK with empty collection
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedTasks = okResult.Value.Should().BeAssignableTo<IEnumerable<TaskItemResponse>>().Subject;
        returnedTasks.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllTaskItemsAsync_ShouldReturn500_WhenServiceThrowsException()
    {
        // Arrange - Mock service failure (database down, network error, etc.)
        _mockTaskItemService.Setup(s => s.GetAllTaskItemsAsync())
                           .ThrowsAsync(new Exception("Database error"));

        // Act & Assert - Controller should let exceptions bubble up and not attempt to catch / hide them
        await Assert.ThrowsAsync<Exception>(() => _taskItemController.GetAllTaskItemsAsync());
    }

    #endregion

    #region CreateTaskItemAsync Tests

    [Fact]
    public async Task CreateTaskItemAsync_ShouldReturnCreated_WhenTaskIsCreatedSuccessfully()
    {
        // Arrange - Create input and expected output
        var createRequest = new TaskItemCreate("New Task", "Description", Priority.Medium, Status.Incomplete);
        var expectedResponse = new TaskItemResponse(1, "New Task", "Description", Priority.Medium, Status.Incomplete, DateTime.UtcNow);
        
        _mockTaskItemService.Setup(s => s.CreateTaskItemAsync(createRequest))
                           .ReturnsAsync(expectedResponse);

        // Act
        var result = await _taskItemController.CreateTaskItemAsync(createRequest);

        // Assert - Should return 201 Created with location header
        var createdResult = result.Result.Should().BeOfType<CreatedResult>().Subject;
        createdResult.Location.Should().Be("/api/taskitems/1");
        var returnedTask = createdResult.Value.Should().BeOfType<TaskItemResponse>().Subject;
        returnedTask.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async Task CreateTaskItemAsync_ShouldReturnBadRequest_WhenModelStateIsInvalid()
    {
        // Arrange - Manually add model error to simulate validation failure
        _taskItemController.ModelState.AddModelError("Title", "Title is required");
        var request = new TaskItemCreate("", null, null, null);

        // Act
        var result = await _taskItemController.CreateTaskItemAsync(request);

        // Assert - Should return 400 Bad Request
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task CreateTaskItemAsync_ShouldThrowException_WhenServiceThrowsException()
    {
        // Arrange - Mock service failure (database down, network error, etc.)
        var createRequest = new TaskItemCreate("New Task", "Description", Priority.Medium, Status.Incomplete);
        _mockTaskItemService.Setup(s => s.CreateTaskItemAsync(createRequest))
                           .ThrowsAsync(new Exception("Database error"));

        // Act & Assert - Controller should let exceptions bubble up and not attempt to catch / hide them
        await Assert.ThrowsAsync<Exception>(() => _taskItemController.CreateTaskItemAsync(createRequest));
    }

    #endregion

    #region UpdateTaskItemAsync Tests

    [Fact]
    public async Task UpdateTaskItemAsync_ShouldReturnOk_WhenTaskIsUpdatedSuccessfully()
    {
        // Arrange - Create update request and expected response
        var updateRequest = new TaskItemUpdate("Updated Task", "Updated Description", Priority.High, Status.Complete);
        var expectedResponse = new TaskItemResponse(1, "Updated Task", "Updated Description", Priority.High, Status.Complete, DateTime.UtcNow);
        // Mock update call
        _mockTaskItemService.Setup(s => s.UpdateTaskItemAsync(1, updateRequest))
                           .ReturnsAsync(expectedResponse);

        // Act
        var result = await _taskItemController.UpdateTaskItemAsync(1, updateRequest);

        // Assert - Should return 200 OK with updated task
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedTask = okResult.Value.Should().BeOfType<TaskItemResponse>().Subject;
        returnedTask.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async Task UpdateTaskItemAsync_ShouldReturnNotFound_WhenTaskDoesNotExist()
    {
        // Arrange - Mock service returns null (task not found)
        var updateRequest = new TaskItemUpdate("Updated Task", null, null, null);
        _mockTaskItemService.Setup(s => s.UpdateTaskItemAsync(999, updateRequest))
                           .ReturnsAsync((TaskItemResponse?)null);

        // Act
        var result = await _taskItemController.UpdateTaskItemAsync(999, updateRequest);

        // Assert - Should return 404 Not Found
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task UpdateTaskItemAsync_ShouldReturnBadRequest_WhenModelStateIsInvalid()
    {
        // Arrange - Add validation error
        _taskItemController.ModelState.AddModelError("Title", "Title cannot be empty");
        var updateRequest = new TaskItemUpdate("", null, null, null);

        // Act
        var result = await _taskItemController.UpdateTaskItemAsync(1, updateRequest);

        // Assert - Should return 400 Bad Request
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    #endregion

    #region DeleteTaskItemAsync Tests

    [Fact]
    public async Task DeleteTaskItemAsync_ShouldReturnNoContent_WhenTaskIsDeletedSuccessfully()
    {
        // Arrange - Mock service returns true (successful deletion)
        _mockTaskItemService.Setup(s => s.DeleteTaskItemAsync(1))
                           .ReturnsAsync(true);

        // Act
        var result = await _taskItemController.DeleteTaskItemAsync(1);

        // Assert - Should return 204 No Content (successful deletion, no response body)
        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task DeleteTaskItemAsync_ShouldReturnNotFound_WhenTaskDoesNotExist()
    {
        // Arrange - Mock service returns false (task not found)
        _mockTaskItemService.Setup(s => s.DeleteTaskItemAsync(999))
                           .ReturnsAsync(false);

        // Act
        var result = await _taskItemController.DeleteTaskItemAsync(999);

        // Assert - Should return 404 Not Found
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public async Task DeleteTaskItemAsync_ShouldReturnNotFound_WhenIdIsInvalid(int invalidId)
    {
        // Arrange - Mock service returns false for invalid IDs
        _mockTaskItemService.Setup(s => s.DeleteTaskItemAsync(invalidId))
                           .ReturnsAsync(false);

        // Act
        var result = await _taskItemController.DeleteTaskItemAsync(invalidId);

        // Assert - Should return 404 Not Found
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    #endregion
}