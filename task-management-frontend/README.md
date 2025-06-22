# 🚀 Task Management Frontend – React UI (Containerised + Local)

This is the **React + TypeScript frontend** for the Task Management system. It provides an intuitive interface for managing tasks with features like drag-and-drop reordering, task filtering, and responsive design. The application is containerised with Docker for easy deployment and also supports local development.

---

## 📦 Tech Stack

- ⚛️ React 19.1.0
- 🧠 TypeScript 5.8.3
- 🎨 Tailwind CSS 4.1.10
- ⚡ Vite 6.3.5
- 🧲 dnd-kit – for drag-and-drop support

---

## 🐳 Containerised Deployment (Recommended)

Running the frontend in Docker is ideal for production or testing environments.

### ✅ Prerequisites

- Docker & Docker Compose
- Git
- Backend API running (on `http://localhost:8080`) see - [Backend Documentation](../task-management-backend/README.md)

---

### 🔧 Clone & Run (Containerised)

```bash
git clone https://github.com/dylazz/task-management.git
cd task-management/task-management-frontend

# Create Docker network
docker network create task-management-network

# Start the container
docker-compose up --build
```

### 🌐 Access Containerized App

- **Frontend UI:** http://localhost:3000

## 💻 Local Development

For active development with hot-reloading and debugging capabilities.

### ✅ Prerequisites

- Node.js (v18+)
- npm
- Git
- .NET SDK 9.0 (for backend)

### 🔧 Running Backend Locally

Before starting the frontend, make sure the backend API is running locally, see - [Backend Documentation](../task-management-backend/README.md)

### 🔧 Setup & Run Frontend Locally
```bash
git clone https://github.com/dylazz/task-management.git
cd task-management/task-management-frontend
npm install
npm run dev
```
