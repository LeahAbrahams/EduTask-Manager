# EduTask Manager

EduTask Manager is a full-stack academic task management system developed as a **learning project** to help students organize assignments, track deadlines, and manage task statuses efficiently.  
This project demonstrates backend development skills and integration with a frontend interface.

## Features
- Create and update tasks
- Track task status (e.g., Pending, Completed)
- RESTful API for task management
- MongoDB database with Mongoose models
- Frontend web interface for task interaction
- Integration between backend and frontend

## Technologies

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- REST API design and implementation

### Frontend
- Angular 16+ (generated using AI-assisted tools)
- Components, services, and UI layout connected to backend APIs
- Functional UI demonstrating integration with backend

## Development Overview

**Backend:**  
All backend functionality was designed and implemented independently, including:
- API routing and controllers
- Database schemas and data handling
- Request validation and error handling
- Integration with the frontend

**Frontend:**  
The frontend interface was generated entirely using AI-assisted tools based on textual instructions.  
The code provides a functional UI.
The frontend logic was scaffolded using AI to focus on backend architecture and full-stack integration

This demonstrates:
- Ability to integrate backend with a working frontend
- Conceptual understanding of frontend structure and API connections
- Problem-solving and backend system delivery

## 🛠 Challenges & Learnings
One of the main challenges in this project was implementing a secure **Authentication & Authorization** system. 
- **The Issue:** Managing user sessions securely while using TypeScript's strict typing for request objects.
- **The Solution:** I created custom middleware that validates JWT tokens and extends the Express Request interface to include the authenticated user's data. This ensured that only authorized users can access specific routes while maintaining type safety throughout the app.

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Backend Setup
```bash
cd server
npm install
# Configure your MONGO_URI environment variable in a .env file
npm start
```

### Frontend Setup
```bash
cd client
npm install
ng serve
```

Access the application at:
```
http://localhost:4200
```

## Purpose of the Project

This project was developed as a **learning exercise** to:
- Build a complete backend system
- Gain practical experience with backend development
- Integrate backend with a functional frontend interface
- Demonstrate problem-solving in an academic context
- Deliver a functional, professional-looking system
