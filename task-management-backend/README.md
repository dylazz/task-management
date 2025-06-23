# 🐳 Task Management Backend – Web API (Containerised + Local)
                  
This is the **.NET 9 Web API backend** for the Task Management system. It supports task creation, updates, deletion, and filtering by status. The service is containerised with Docker for easy deployment and also supports local development with hot-reloading and debugging capabilities.
                  
---

## 📦 Tech Stack

- 🌐 ASP.NET Core 9.0
- 💾 SQLite Database
- 📊 Entity Framework Core
- 📝 Swagger
- 🐳 Docker & Docker Compose
- 🔧 C# 13.0

---

## 🐳 Containerised Deployment (Recommended)

Running the backend in Docker is ideal for production or testing environments.

### ✅ Prerequisites
- Docker & Docker Compose
- Git

### 🔧 Clone & Run (Containerised)

```bash
git clone https://github.com/dylazz/task-management.git
cd task-management/task-management-backend

# Create Docker network (if not already created)
docker network create task-management-network

# Start the container
docker-compose up --build
```


### 🌐 Access Containerised API
- **API Base:** http://localhost:8080
- **Swagger UI:** http://localhost:8080/swagger
- **Health Check:** http://localhost:8080/health

### 💻 Local Development
For active development with hot-reloading, debugging, and IntelliSense support.

### ✅ Prerequisites
- .NET SDK 9.0+
- Git

### 🔧 Setup & Run Backend Locally
```bash
git clone https://github.com/dylazz/task-management.git
cd task-management/task-management-backend
dotnet restore
dotnet run
```

### 🌐 Access Local API
- **API Base:** [http://localhost:5000](http://localhost:5000) (HTTP)
- **Swagger UI:** [http://localhost:5000/swagger](http://localhost:5000/swagger)
- **Health Check:** [http://localhost:5000/health](http://localhost:5000/health)


## 📋 API Features

### **Task Operations**
- ✅ Create tasks
- ✅ Update tasks
- ✅ Delete tasks
- ✅ Get all tasks

### **Task Status Types**
- 🔄 **Incomplete** - Tasks that haven't been started
- ⚡ **InProgress** - Tasks currently being worked on
- ✅ **Complete** - Finished tasks

## 🗄️ Database
The application uses **SQLite** for data persistence:
- **Containerized:** Database stored in `/app/data/task-management.db`
- **Local Development:** Database stored in `./data/task-management.db`

The database is automatically created on first run with Entity Framework migrations.

