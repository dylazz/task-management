using System.ComponentModel.DataAnnotations;
using task_management_backend.Models.Enums;

namespace task_management_backend.Models.DTOs.Input;

public record TaskItemUpsert
(
    int? Id,
    
    [Required(ErrorMessage = "Title is required")]
    [MinLength(3, ErrorMessage = "Title must be at least 3 characters long")]
    [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters")]
    string Title,
    
    [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    string? Description,
    
    Priority? Priority,
    Status? Status
    );