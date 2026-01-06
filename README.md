# EduTask-Manager
A backend task management system built with **Node.js** and **TypeScript**, focusing on secure authentication flows and robust server-side logic.

## Project Overview
EduTask-Manager handles user tasks and administrative operations within a modular architecture. The project places a high priority on security, implementing **JWT (JSON Web Tokens)** for stateless authentication and environment-based configuration for sensitive data.

## Key Features
* **JWT Authentication:** End-to-end implementation of token generation and secure verification middleware.
* **Security & Environment:** Sensitive keys and configurations are managed via `dotenv` to prevent data leakage.
* **Structured Logging:** Integrated logging system for real-time monitoring of server events, authentication flows, and errors.
* **Type Safety:** Developed entirely in TypeScript to ensure data integrity and prevent runtime errors.

## Tech Stack
* **Runtime:** Node.js
* **Language:** TypeScript
* **Authentication:** jsonwebtoken
* **Configuration:** dotenv
* **Architecture:** Middleware-based request validation.

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/LeahAbrahams/EduTask-Manager.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and define the following variables:
    ```env
    JWT_SECRET=my_secret_key
    PORT=3000
    ```

4.  **Run the Project:**
    ```bash
    # For development (with auto-reload)
    npm run dev

    # For production
    npm run build
    npm start
    ```
