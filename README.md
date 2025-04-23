# Library Management System

A full-stack library management system built with React, TypeScript, GraphQL, and SQLite. This application allows users to manage a collection of books, including features like adding, deleting, and checking out books.

## Features

- User authentication (login/register)
- Book management (CRUD operations)
- Book checkout system
- Search functionality
- Responsive design with Bootstrap

## Tech Stack

### Frontend
- React
- TypeScript
- Apollo Client
- React Bootstrap
- GraphQL

### Backend
- Node.js
- Express
- TypeORM
- SQLite
- GraphQL
- Apollo Server

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd library-management-system
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
cd library
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Set up the database:
```bash
# In the server directory
npm run typeorm migration:run
```

## Configuration

1. Frontend Configuration:
   - The GraphQL endpoint is configured in `library/src/graphql/client.ts`
   - Default endpoint is `http://localhost:4000/graphql`

2. Backend Configuration:
   - Database configuration is in `server/src/config/database.ts`
   - Default uses SQLite with `library.db` file
   - Port configuration is in `server/src/index.ts` (default: 4000)

## Running the Application

1. Start the backend server:
```bash
# In the server directory
npm run dev
```

2. Start the frontend development server:
```bash
# In the library directory
npm run dev
```

3. Access the application:
   - Frontend: http://localhost:5173
   - GraphQL Playground: http://localhost:4000/graphql

## Project Structure

```
library-management-system/
├── library/                 # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── graphql/        # GraphQL operations and client
│   │   ├── types/         # TypeScript type definitions
│   │   └── App.tsx        # Main application component
│   └── package.json
│
└── server/                 # Backend application
    ├── src/
    │   ├── config/        # Configuration files
    │   ├── entities/      # TypeORM entities
    │   ├── resolvers/     # GraphQL resolvers
    │   ├── schema/        # GraphQL schema
    │   └── index.ts       # Server entry point
    └── package.json
```

## Available Scripts

### Frontend (library directory)
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript type checking

### Backend (server directory)
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run typeorm`: Run TypeORM CLI commands
- `npm run seed`: Seed the database with initial data

## GraphQL Operations

### Queries
- `GetBooks`: Fetch all books
- `Login`: User authentication

### Mutations
- `CreateBook`: Add a new book
- `UpdateBook`: Modify an existing book
- `DeleteBook`: Remove a book
- `ToggleBookStatus`: Check out or return a book
- `Register`: Create a new user account

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
