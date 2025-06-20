using task_management_backend.Models.Enums;

namespace task_management_backend.Models.DTOs.Output;

public record TaskItemResponse
(
    int Id,
    string Title,
    string Description,
    Priority Priority,
    Status Status,
    DateTime CreatedDate
);