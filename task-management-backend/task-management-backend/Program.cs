using Microsoft.EntityFrameworkCore;
using task_management_backend.Data;
using task_management_backend.Models.Services.Interfaces;
using task_management_backend.Models.Services;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:5175")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Add services to the container.
builder.Services.AddControllers();

// Register Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Task Management API", Version = "v1" });
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});

// Register TaskItemService
builder.Services.AddScoped<ITaskItemService, TaskItemService>();

// Environment-aware database configuration
string dbPath;
if (Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true" || 
    builder.Environment.EnvironmentName == "DevContainer")
{
    // Container environment
    var dataDirectory = "/app/data";
    if (!Directory.Exists(dataDirectory))
    {
        Directory.CreateDirectory(dataDirectory);
    }
    dbPath = "Data Source=/app/data/task-management.db";
}
else
{
    // Local development environment
    var localDataPath = Path.Combine(Directory.GetCurrentDirectory(), "data");
    if (!Directory.Exists(localDataPath))
    {
        Directory.CreateDirectory(localDataPath);
    }
    dbPath = $"Data Source={Path.Combine(localDataPath, "task-management.db")}";
}

// Add SQLite with environment-specific path
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(dbPath));

var app = builder.Build();

// Create the database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.EnvironmentName == "DevContainer")
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Management API V1");
    });
}

// Health check endpoint for Rancher
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

app.UseCors("AllowLocalhost");
app.UseHttpsRedirection();
app.MapControllers();
app.Run();