# URL Shortener Project

This project is a full-stack application for creating and managing shortened URLs. It consists of a React-based frontend and a Go-based backend, providing a comprehensive solution for URL shortening, management, and analytics.

## Features

- **URL Shortening**: Users can create short aliases for long URLs, making them easier to share and manage.
- **User Authentication**: The application supports user registration and authentication, allowing for personalized URL management.
- **Analytics**: Users can view analytics for their shortened URLs, including click counts, geographic distribution, and device types.

## Project Structure

The project is divided into two main directories:

- `client/`: Contains the React-based frontend application.
- `server/`: Contains the Go-based backend application.

### Client

The client application is built with React and Vite, utilizing Tailwind CSS for styling. It includes features such as user authentication, URL management, and analytics visualization.

Key directories and files:

- `src/`: Source code for the React application.
  - `App.jsx`: The main application component.
  - `pages/`: Contains page components, including the dashboard and analytics pages.
  - `context/`: React context providers for global state management.
  - `hooks/`: Custom React hooks.
  - `components/`: Reusable UI components.
- `public/`: Static assets such as images and icons.
- `vite.config.js`: Configuration for the Vite build tool.

### Server

The server application is built with Go, providing RESTful APIs for user management, URL shortening, and analytics.

Key directories and files:

- `cmd/api/`: Entry point for the server application.
- `internal/`: Internal packages for the application.
  - `database/`: Database integration and models.
  - `server/`: HTTP server setup and route definitions.
  - `types/`: Custom types and structs.
  - `utils/`: Utility functions.
  - `validators/`: Input validation functions.

## Getting Started

### Prerequisites

- Node.js and npm
- Go
- A MongoDB database

### Setup

1. Clone the repository:

```sh
git clone https://github.com/your-username/url-shortener.git
cd url-shortener

2. Set up the client application:

cd client
npm install
npm run dev

3. Set up the server application:

cd server
go mod download
go run cmd/api/*.go

4. Configure environment variables in .env files for both the client and server applications according to your setup.
```
