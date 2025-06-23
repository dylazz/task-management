using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using task_management_backend.Data;
using task_management_backend.Models;
using task_management_backend.Models.DTOs.Input;
using task_management_backend.Models.Enums;
using task_management_backend.Models.Services;

namespace task_management_backend.Tests.Services;

public class TaskItemServiceTests : IAsyncDisposable
{
    private readonly AppDbContext _appDbContext;
    private readonly Mock<ILogger<TaskItemService>> _mockLogger;
    private readonly TaskItemService _taskItemService;
    
    public TaskItemServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _appDbContext = new AppDbContext(options);
        _mockLogger = new Mock<ILogger<TaskItemService>>();
        _taskItemService = new TaskItemService(_appDbContext, _mockLogger.Object);
    }

    #region GetAllTaskItemsAsync Tests

    [Fact]
    public async Task GetAllTaskItemsAsync_ShouldReturnAllTasks()
    {
        // Arrange
        var taskItems = new List<TaskItem>
        {
            new() { Title = "Task 1", Description = "Description 1", Priority = Priority.High, Status = Status.Incomplete },
            new() { Title = "Task 2", Description = "Description 2", Priority = Priority.Medium, Status = Status.InProgress }
        };
        
        _appDbContext.TaskItems.AddRange(taskItems);
        await _appDbContext.SaveChangesAsync();
        
        // Act
        var result = await _taskItemService.GetAllTaskItemsAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().Contain(t => t.Title == "Task 1");
        result.Should().Contain(t => t.Title == "Task 2");
    }
    
    [Fact]
    public async Task GetAllTaskItemsAsync_ShouldReturnEmptyList_WhenNoTasksExist()
    {
        // Act
        var result = await _taskItemService.GetAllTaskItemsAsync();

        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllTaskItemsAsync_ShouldLogError_WhenExceptionThrown()
    {
        // Arrange - Force an exception by disposing the context
        await _appDbContext.DisposeAsync();
        
        // Act & Assert - Verify exception is thrown
        await Assert.ThrowsAsync<ObjectDisposedException>(() => _taskItemService.GetAllTaskItemsAsync());
        
        // Verify logging behavior
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString().Contains("Error getting all tasks")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
            Times.Once);
    }

    #endregion

    #region GetTaskItemAsync Tests

    [Fact]
    public async Task GetTaskItemAsync_ShouldReturnTask_WhenTaskExists()
    {
        // Arrange - Create and save a task
        var taskItem = new TaskItem 
        { 
            Title = "Test Task", 
            Description = "Test Description", 
            Priority = Priority.High, 
            Status = Status.Incomplete 
        };
        
        _appDbContext.TaskItems.Add(taskItem);
        await _appDbContext.SaveChangesAsync();

        // Act
        var result = await _taskItemService.GetTaskItemAsync(taskItem.Id);

        // Assert - Verify all properties
        result.Should().NotBeNull();
        result!.Id.Should().Be(taskItem.Id);
        result.Title.Should().Be("Test Task");
        result.Description.Should().Be("Test Description");
        result.Priority.Should().Be(Priority.High);
        result.Status.Should().Be(Status.Incomplete);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(999)]
    public async Task GetTaskItemAsync_ShouldReturnNull_WhenTaskDoesNotExist(int invalidId)
    {
        // Act
        var result = await _taskItemService.GetTaskItemAsync(invalidId);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetTaskItemAsync_ShouldLogError_WhenExceptionThrown()
    {
        // Arrange - Force an exception by disposing the context
        await _appDbContext.DisposeAsync();
        
        // Act & Assert - Verify exception is thrown
        await Assert.ThrowsAsync<ObjectDisposedException>(() => _taskItemService.GetTaskItemAsync(1));
        
        // Verify logging behavior
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString().Contains("Error getting task by ID")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
            Times.Once);
    }

    #endregion

    #region CreateTaskItemAsync Tests

    [Fact]
    public async Task CreateTaskItemAsync_ShouldCreateAndReturnTask()
    {
        // Arrange - Create input DTO
        var createRequest = new TaskItemCreate(
            Title: "New Task",
            Description: "New Description",
            Priority: Priority.Medium,
            Status: Status.Incomplete
        );

        // Act
        var result = await _taskItemService.CreateTaskItemAsync(createRequest);

        // Assert - Verify created task matches input
        result.Should().NotBeNull();
        result.Title.Should().Be("New Task");
        result.Description.Should().Be("New Description");
        result.Priority.Should().Be(Priority.Medium);
        result.Status.Should().Be(Status.Incomplete);
        result.Id.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task CreateTaskItemAsync_ShouldSetDefaultValues_WhenNullableFieldsAreNull()
    {
        // Arrange - Create request with null optional fields
        var createRequest = new TaskItemCreate(
            Title: "Minimal Task",
            Description: null,
            Priority: null,
            Status: null
        );

        // Act
        var result = await _taskItemService.CreateTaskItemAsync(createRequest);

        // Assert - Verify defaults are applied
        result.Should().NotBeNull();
        result.Title.Should().Be("Minimal Task");
        result.Description.Should().Be(string.Empty);
        result.Priority.Should().Be(Priority.Low);
        result.Status.Should().Be(Status.Incomplete);
    }

    [Fact]
    public async Task CreateTaskItemAsync_ShouldLogError_WhenExceptionThrown()
    {
        // Arrange
        var createRequest = new TaskItemCreate("Test", null, null, null);
        await _appDbContext.DisposeAsync();
        
        // Act & Assert
        await Assert.ThrowsAsync<ObjectDisposedException>(() => _taskItemService.CreateTaskItemAsync(createRequest));
        
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString().Contains("Error creating task item")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
            Times.Once);
    }

    #endregion

    #region UpdateTaskItemAsync Tests

    [Fact]
    public async Task UpdateTaskItemAsync_ShouldUpdateAndReturnTask_WhenTaskExists()
    {
        // Arrange - Create existing task
        var taskItem = new TaskItem 
        { 
            Title = "Original Title", 
            Description = "Original Description", 
            Priority = Priority.Low, 
            Status = Status.Incomplete 
        };
        
        _appDbContext.TaskItems.Add(taskItem);
        await _appDbContext.SaveChangesAsync();
        
        // Arrange - Create update request
        var updateRequest = new TaskItemUpdate(
            Title: "Updated Title",
            Description: "Updated Description",
            Priority: Priority.High,
            Status: Status.Complete
        );

        // Act
        var result = await _taskItemService.UpdateTaskItemAsync(taskItem.Id, updateRequest);

        // Assert - Verify all fields were updated
        result.Should().NotBeNull();
        result!.Title.Should().Be("Updated Title");
        result.Description.Should().Be("Updated Description");
        result.Priority.Should().Be(Priority.High);
        result.Status.Should().Be(Status.Complete);
    }
    
    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(999)]
    public async Task UpdateTaskItemAsync_ShouldReturnNull_WhenTaskDoesNotExist(int invalidId)
    {
        // Arrange
        var updateRequest = new TaskItemUpdate("Updated Title", null, null, null);

        // Act
        var result = await _taskItemService.UpdateTaskItemAsync(invalidId, updateRequest);

        // Assert
        result.Should().BeNull();
    }
    
    [Fact]
    public async Task UpdateTaskItemAsync_ShouldOnlyUpdateProvidedFields()
    {
        // Arrange - Create existing task
        var taskItem = new TaskItem 
        { 
            Title = "Original Title", 
            Description = "Original Description", 
            Priority = Priority.Low, 
            Status = Status.Incomplete 
        };
        
        _appDbContext.TaskItems.Add(taskItem);
        await _appDbContext.SaveChangesAsync();
        
        // Arrange - Create update request
        var updateRequest = new TaskItemUpdate(
            Title: "Updated Title", // Will be updated
            Description: null,      // Will NOT be updated (null means no change)
            Priority: null,         // Will NOT be updated
            Status: Status.Complete // Will be updated
        );

        // Act
        var result = await _taskItemService.UpdateTaskItemAsync(taskItem.Id, updateRequest);

        // Assert - Only specified fields should change
        result.Should().NotBeNull();
        result!.Title.Should().Be("Updated Title");              // Changed
        result.Description.Should().Be("Original Description");  // Unchanged
        result.Priority.Should().Be(Priority.Low);              // Unchanged
        result.Status.Should().Be(Status.Complete);             // Changed
    }

    [Fact]
    public async Task UpdateTaskItemAsync_ShouldLogError_WhenExceptionThrown()
    {
        // Arrange
        var updateRequest = new TaskItemUpdate("Test", null, null, null);
        await _appDbContext.DisposeAsync();
        
        // Act & Assert
        await Assert.ThrowsAsync<ObjectDisposedException>(() => _taskItemService.UpdateTaskItemAsync(1, updateRequest));
        
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString().Contains("Error updating task item")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
            Times.Once);
    }

    #endregion

    #region DeleteTaskItemAsync Tests
    
    [Fact]
    public async Task DeleteTaskItemAsync_ShouldReturnTrue_WhenTaskExists()
    {
        // Arrange - Create task to delete
        var taskItem = new TaskItem 
        { 
            Title = "Task to Delete", 
            Description = "Description", 
            Priority = Priority.Medium, 
            Status = Status.Incomplete 
        };
        
        _appDbContext.TaskItems.Add(taskItem);
        await _appDbContext.SaveChangesAsync();

        // Act
        var result = await _taskItemService.DeleteTaskItemAsync(taskItem.Id);

        // Assert - Should return true when task exists and is deleted
        result.Should().BeTrue();
    }
    
    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(999)]
    public async Task DeleteTaskItemAsync_ShouldReturnFalse_WhenTaskDoesNotExist(int invalidId)
    {
        // Act
        var result = await _taskItemService.DeleteTaskItemAsync(invalidId);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteTaskItemAsync_ShouldLogError_WhenExceptionThrown()
    {
        // Arrange
        await _appDbContext.DisposeAsync();
        
        // Act & Assert
        await Assert.ThrowsAsync<ObjectDisposedException>(() => _taskItemService.DeleteTaskItemAsync(1));
        
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString().Contains("Error deleting task item")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception, string>>()),
            Times.Once);
    }

    #endregion
    // Cleanup Method
    public async ValueTask DisposeAsync()
    {
        if (_appDbContext != null)
        {
            await _appDbContext.DisposeAsync();
        }
    }
}