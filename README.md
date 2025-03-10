# Real-Time Chat Application

## Overview

A full-stack real-time chat application built with Django and React, featuring secure authentication, WebSocket support, and modern web technologies.

[![Watch Project Preview](https://drive.google.com/file/d/1cYeG715FwKYGxJRcmwAa5QgL0ItP5tQI/view?usp=sharing)](https://drive.google.com/file/d/1ZGHFta0bDX-xGfc8RHqNrhsejPhnyJbt/view?usp=sharing)

## 🚀 Features

- Real-time messaging using WebSocket
- JWT-based authentication
- Private chat functionality
- Responsive and modern UI
- Error tracking with Sentry

## 🛠 Tech Stack

### Backend

- Django 5.1.6
- Django Channels
- Django Rest Framework
- Simple JWT
- Sentry for error monitoring
- SQLite Database

### Frontend

- React 19
- Vite
- React Router
- Axios
- Modern React Hooks

## 📦 Prerequisites

- Python 3.9+
- Node.js 18+
- Redis (for WebSocket support)

## 🔧 Local Setup

### Backend Setup

### 1. Docker Setup

1. Clone the repository
2. Run Docker engine on you machine
3. Run Docker Compose

```bash
docker compose up --build
or
docker compose up -d --build  # running containers in background
```

### 2. Local Setup

1. Clone the repository
2. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

3. Install dependencies

```bash
cd Backend
pip install -r requirements.txt
```

4. Run migrations

```bash
python manage.py migrate
```

5. Start the development server

```bash
python manage.py runserver
```

### Frontend Setup

1. Navigate to frontend directory

```bash
cd frontend
```

2. Install dependencies

```bash
npm install
```

3. Start development server

```bash
npm run dev
```

## 🔐 Authentication

- Uses JWT (JSON Web Tokens)
- Token-based authentication
- Refresh token support

## 🌐 WebSocket

- Real-time communication powered by Django Channels
- Redis as the channel layer backend

## 🚦 Environment Variables

Update the environment values in `docker-compose.yml` file with your:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `REDIS_HOST`
- `REDIS_PORT`

## 🐛 Error Tracking

Integrated with Sentry for real-time error monitoring and performance tracking.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
