# Quizzy (Quiz Web Application)

A simple quiz application with user authentication using the MERN stack (MongoDB, Express.js, React.js, and Node.js). It incorporates full CRUD operations with token-based authentication (JWT).

## Features

### Admin
- **Login Authentication**: Admin login with error message for invalid credentials and redirection to the dashboard upon successful login.
- **Quiz Management**: Add, Edit, and Delete quizzes. Quizzes include title, description (optional), and timer.
- **Question Management**: Add, Edit, and Delete questions for each quiz. All questions are multiple-choice.
- **View Quizzes**: View all quizzes added to the application.
- **View Scores**: View scores of all users who attempted a quiz or any particular quiz.
- **Dashboard**: View all necessary data on the admin dashboard.

### User
- **View Quizzes**: View all available quizzes added by the admin.
- **Attempt Quizzes**: Answer questions in quizzes that the user has not attempted. Display an appropriate message if the user has attempted the quiz previously.
- **View Scores**: View scores after completing a quiz.
- **View Attempts**: View all previously attempted quizzes and scores.
- **Dashboard**: View all necessary data on the user dashboard.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Token (JWT)

## Installation

### Prerequisites
- Node.js
- MongoDB

### Backend Setup
1. Clone the repository:
   ```sh
     git clone https://github.com/yourusername/quiz-web-app.git
     cd quiz-web-app
   ```
   
2. Install backend dependencies:
   ```sh
    cd backend
    npm install
   ```
   
3. Set up environment variables:
    Create a .env file in the backend directory with the following content:
   ```sh
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
   ```

4. Start the backend server:
   ```sh
    npm run dev
   ```

###  Frontend Setup

1. Install frontend dependencies:
``` sh
    cd ../frontend
    npm install
```

2. Start the frontend server:
``` sh
    npm run dev
```
The application should now be running, with the frontend accessible at http://localhost:5173 and the backend at http://localhost:3000.

## Production & Deployment

This repository includes CI and deployment helpers to prepare the app for production.

What was added:
- `client/Dockerfile` — multi-stage build for the Vite React client (served with nginx).
- `server/Dockerfile` — production Node/Express Docker image.
- `.github/workflows/deploy.yml` — GitHub Actions workflow:
   - builds the client and deploys `client/dist` to GitHub Pages (on push to `main`/`master`).
   - builds the server Docker image and pushes it to GHCR as `quizzy-server:latest`.

How to use locally

1. Build and serve client locally:
```bash
cd client
npm install
npm run build
npx serve dist   # or use an nginx container
```

2. Build and run Docker images locally:
```bash
# From repo root
docker build -f client/Dockerfile -t quizzy-client:latest ./client
docker build -f server/Dockerfile -t quizzy-server:latest ./server

# Run server (example):
docker run -e MONGO_URI="your_mongo" -e JWT_SECRET="secret" -p 5000:5000 quizzy-server:latest

# Run client (nginx):
docker run -p 8080:80 quizzy-client:latest
```

Notes and secrets
- The GitHub Actions workflow uses `GITHUB_TOKEN` to deploy to GitHub Pages and to authenticate with GHCR. If you prefer pushing images under your account, create a Personal Access Token with `write:packages` and set it as a repository secret named `CR_PAT` and update the workflow accordingly.
- Ensure production environment variables (MongoDB URI, JWT secret, any third-party keys) are configured in your hosting provider.

Next steps I can do for you (pick any):
- Add focus trap and ARIA attributes to the mobile drawer for accessibility.
- Add an nginx config for client in the Docker image.
- Configure a deploy target for the server (Render, Fly, DigitalOcean App Platform) and the necessary workflow.

### API Endpoints
#### Auth
POST /api/auth/register: Sign Up User.
POST /api/auth/login: Authenticate admin/user and return a JWT token.

#### Admin
GET /api/admin/quizzes: Get all quizzes.

POST /api/admin/quizzes: Add a new quiz.

PUT /api/admin/quizzes/:id: Update a quiz.

DELETE /api/admin/quizzes/:id: Delete a quiz.

GET /api/admin/quizzes/:id/questions: Get all questions for a quiz.

POST /api/admin/quizzes/:id/questions: Add a new question to a quiz.

PUT /api/admin/questions/:id: Update a question.

DELETE /api/admin/questions/:id: Delete a question.

GET /api/admin/scores: Get scores for all users or a particular quiz.

#### User
GET /api/quizzes: Get all available quizzes.

POST /api/quizzes/:id/attempt: Attempt a quiz.

GET /api/users/:id/attempts: Get all attempts for a user
