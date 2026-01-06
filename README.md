# EduTask-Manager

EduTask-Manager is a full-stack academic management system designed to help students organize assignments and track deadlines efficiently.

## Technologies and Languages

The project is built on the **MEAN Stack** architecture:

* **Frontend:** Developed with **Angular 16+**. The client architecture, UI components, and logic were implemented with the assistance of AI tools.
* **Backend:** Node.js environment utilizing the Express.js framework.
* **Database:** MongoDB (NoSQL) managed via Mongoose ODM.
* **Languages:** TypeScript (Frontend), JavaScript (Backend), HTML5, CSS3/SCSS.



## Repository Structure

* **/client**: Contains the Angular application, including state management, API services, and user interface logic, made by AI.
* **/server**: Contains the REST API, database schemas (Mongoose models), and request handling.

## Getting Started

### Backend Setup
1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Configure your `MONGO_URI` environment variable in a `.env` file.
4. Start the server: `npm start`

### Frontend Setup
1. Navigate to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Launch the application: `ng serve`
4. Access the app in your browser at: `http://localhost:4200`
