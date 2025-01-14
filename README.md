# Inventory CQRS API

This is a Node.js project implementing a **CQRS (Command Query Responsibility Segregation)** architecture for managing products and orders. It uses **Express** for the HTTP server, **Mongoose** for database interaction, and includes testing with **Jest** and **Supertest**.

---

## Features

- **Product Management**: Create, restock, and sell products.
- **Order Management**: Create and fetch orders.
- **Validation**: Request payloads are validated using **Joi**.
- **Error Handling**: Centralized error handling middleware.
- **Swagger UI**: Integration for API documentation (coming soon).
- **Testing**: Unit and integration tests with coverage using **Jest**.

---

## Prerequisites

- **Node.js** (v16+)
- **npm** (v8+)
- **MongoDB** (local or remote)

---

## Installation

1. Clone the repository:
2. Install dependencies:
   ```bash
   npm ci
   ```

3. Set up environment variables:
   Create a `.env` file in the project root with the following:
   ```
   cp .env.example .env
   ```

---

## Running the Application

### Locally

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Access the API documentation at `http://localhost/api-docs`.

### With Docker

1. Build and start the services using Docker Compose:
   ```bash
   docker-compose up --build
   ```

2. The application will be available at `http://localhost`.

3. MongoDB will be accessible at `localhost:27017` and the `mongo-express` UI at `http://localhost:8081`.

---

## Scripts

| Script             | Description                                     |
|--------------------|-------------------------------------------------|
| `npm start`        | Starts the app in production mode.              |
| `npm run start:dev`| Starts the app in development mode with watch.  |
| `npm run build`    | Compiles the TypeScript code into JavaScript.   |
| `npm test`         | Runs all tests using Jest.                     |
| `npm run test:watch`| Runs tests in watch mode.                     |
| `npm run test:coverage` | Runs tests and generates coverage reports. |
| `npm run lint`     | Lints the project using ESLint.                |
| `npm run lint:fix` | Fixes lint issues automatically.               |

---

## Development

### Run the app in development mode:
```bash
npm run start:dev
```

The app will be available at `http://localhost:3000`.

---

## API Endpoints

### Products
| Method | Endpoint                   | Description                    |
|--------|----------------------------|--------------------------------|
| `GET`  | `/api/products`            | Fetch all products.           |
| `GET`  | `/api/products/:id`        | Fetch a product by ID.        |
| `POST` | `/api/products`            | Create a new product.         |
| `POST` | `/api/products/:id/restock`| Restock a product.            |
| `POST` | `/api/products/:id/sell`   | Sell a product.               |

### Orders
| Method | Endpoint         | Description                    |
|--------|------------------|--------------------------------|
| `GET`  | `/api/orders`    | Fetch all orders.             |
| `POST` | `/api/orders`    | Create a new order.           |

---

## Project Structure

```
src/
├── app.ts                # Entry point of the application
├── types.ts              # Shared TypeScript types
├── buses/                # Command and query buses
├── commands/             # Command handlers
├── middlewares/          # Middleware (e.g., validation, error handling)
├── models/               # Mongoose models
├── queries/              # Query handlers
├── routes/               # API routes
├── utils/                # App utils
└── validations/          # Request validation schemas
```

---

## Testing

To run tests:
```bash
npm test
```

To watch for changes and re-run tests:
```bash
npm run test:watch
```

To check test coverage:
```bash
npm run test:coverage
```

---

## Linting

To lint the project:
```bash
npm run lint
```

To fix lint issues:
```bash
npm run lint:fix
```

---

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the application:
   ```bash
   npm start
   ```

---

## Error Handling

- Centralized error handling middleware is used to manage errors consistently.
- For unhandled errors, a `500` response with a general message is returned.
