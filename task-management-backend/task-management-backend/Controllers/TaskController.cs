using Microsoft.AspNetCore.Mvc;
using task_management_backend.Data;

namespace task_management_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaskController : ControllerBase
{
    private readonly AppDbContext _dbContext;
}