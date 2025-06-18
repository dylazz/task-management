using task_management_backend.Models.Enums;

namespace task_management_backend.Models.DTOs.Input;

public record TaskUpsert
(
    int? Id,
    string Title,
    string Description,
    Priority Priority,
    Status? Status
    );