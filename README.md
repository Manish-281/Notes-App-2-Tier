# 📝 2-Tier Notes App

A simple, fully containerized Notes application built with React, Node.js, Express, and SQLite. This project is designed as a **2-Tier Architecture** to practice DevOps workflows including Docker, Docker Compose, CI/CD (Jenkins), and Kubernetes.

## 🏗️ Architecture

This app is divided into two main tiers, both running in isolated Docker containers:

- **Tier 1 (Frontend):** React.js application served via Nginx.
  - *Nginx also acts as a reverse proxy*, forwarding `/api` requests from the browser directly to the backend container. This eliminates CORS issues and removes the need to hardcode IP addresses.
- **Tier 2 (Backend):** Node.js + Express API server.
- **Database:** SQLite. The database file is persisted on the host machine using a **Docker Named Volume** (`notes-data`), ensuring data is not lost when containers restart.

🚀 Live URL : 

## 📂 Project Structure

```text
notes-app-2tier/
├── backend/                # Node.js Express API
│   ├── Dockerfile
│   ├── db.js               # SQLite setup
│   ├── server.js           # API routes (CRUD)
│   └── package.json
├── frontend/               # React App
│   ├── public/
│   ├── src/                # React components & CSS
│   ├── Dockerfile          # Multi-stage build (Node -> Nginx)
│   ├── nginx.conf          # Nginx config with API reverse-proxy
│   └── package.json
├── docker-compose.yml      # Orchestrates both containers
└── README.md
```
🚀 How to Run - 

1. Clone the repository:

git clone https://github.com/YOUR_USERNAME/notes-app-2tier.git
cd notes-app-2tier

2. Build and run the containers:

docker compose up -d --build

3. Access the app:

Frontend (UI): Open http://localhost:3000 in your browser.

Backend API Health: Check http://localhost:5000/api/health to verify the backend is running.

🛑 Useful Docker Commands

Check container status: docker compose ps

View live logs: docker compose logs -f

Stop the application (Data is preserved): docker compose down

Stop the application and DELETE all data: docker compose down -v (Warning: This will permanently delete all your saved notes)

🛠️ Tech Stack

Frontend: React 18, CSS3

Backend: Node.js 20, Express.js, CORS

Database: SQLite (via better-sqlite3)

Web Server / Reverse Proxy: Nginx (Alpine)

Containerization: Docker, Docker Compos


Author -
Name : Manish Kumar

GitHub: @Manish-281 - https://github.com/Manish-281

LinkedIn: Your LinkedIn - https://www.linkedin.com/in/manishk670/

