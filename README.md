# Tour Management Backend

A scalable, production-ready backend API for a tour management platform, built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.  
This project supports user authentication (including Google OAuth), tour and booking management, payment integration (SSLCommerz), advanced statistics, and robust error handling.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Key Architectural Concepts](#key-architectural-concepts)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- **User Authentication & Authorization**

  - JWT-based authentication
  - Google OAuth with Passport.js
  - Session and cookie management
  - Role-based access control (admin, user, etc.)

- **Tour Management**

  - CRUD operations for tours, divisions, and tour types
  - Image upload and management (Cloudinary integration)
  - Slug generation for SEO-friendly URLs

- **Booking & Payment**

  - Booking system with guest count, status, and validation
  - Payment integration with SSLCommerz
  - Invoice PDF generation and secure download

- **Statistics & Analytics**

  - Aggregated stats for tours, bookings, and users
  - Advanced MongoDB aggregation pipelines

- **Robust Error Handling**

  - Centralized error handling with custom error helpers
  - Validation with Zod and custom helpers

- **Clean Code & Maintainability**
  - Modular folder structure
  - Strongly typed with TypeScript interfaces
  - Helper utilities for common logic

---

## Tech Stack

- **Node.js** & **Express.js**
- **TypeScript**
- **MongoDB** & **Mongoose**
- **Passport.js** (Google OAuth)
- **JWT** for authentication
- **SSLCommerz** (payment gateway)
- **Cloudinary** (image storage)
- **Zod** (validation)
- **PDFKit** (invoice generation)

---

## Project Structure

```
src/
  app/
    config/           # Configuration files (env, passport, cloudinary, etc.)
    errorHelpers/     # Custom error classes and error handling utilities
    helpers/          # Helper functions (validation, slug, date, etc.)
    interfaces/       # TypeScript interfaces and types for models and DTOs
    middlewares/      # Express middlewares (auth, error handler, validation, etc.)
    modules/          # Feature modules (user, tour, booking, payment, stats, etc.)
      user/
      tour/
      booking/
      payment/
      division/
      tourType/
      sslCommerz/
      stats/
    routes/           # Main API router
    utils/            # Utility functions (slug, date formatting, invoice, etc.)
  server.ts           # Entry point
  app.ts              # Express app setup
README.md
.env.example
```

### Folder Highlights

- **errorHelpers/**  
  Contains custom error classes (e.g., `AppError`) and logic for global error handling, making error responses consistent and easy to manage.

- **helpers/**  
  Reusable logic for validation, slug generation, date formatting, and more. Keeps controllers and services clean.

- **interfaces/**  
  All TypeScript interfaces and types for models, DTOs, and service responses. Ensures type safety and maintainability across the codebase.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)
- SSLCommerz account (for payment)
- Cloudinary account (for image uploads)
- Google OAuth credentials

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Md-Azad/tour-management-backend.git
   cd tour-management-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env` and fill in your credentials.

4. **Run the server:**

   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5001`.

---

## Environment Variables

Create a `.env` file in the root directory. Example:

```
PORT=5000
DATABASE_URL=mongodb://localhost:27017/tour-management
JWT_ACCESS_TOKEN=your_jwt_secret
EXPRESS_SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/v1/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SSLCommerz
SSL_STORE_ID=your_ssl_store_id
SSL_STORE_PASS=your_ssl_store_password
SSL_SUCCESS_BACKEND_URL=http://localhost:5001/api/v1/payment/success
SSL_FAIL_BACKEND_URL=http://localhost:5001/api/v1/payment/fail
SSL_CANCEL_BACKEND_URL=http://localhost:5001/api/v1/payment/cancel
SSL_IPN_URL=http://localhost:5001/api/v1/payment/ipn
```

---

## API Endpoints

### Auth

- `POST /api/v1/auth/register` — Register a new user
- `POST /api/v1/auth/login` — Login with email/password
- `GET /api/v1/auth/google` — Google OAuth login
- `GET /api/v1/auth/google/callback` — Google OAuth callback

### Tours

- `GET /api/v1/tours` — List all tours
- `POST /api/v1/tours` — Create a new tour (admin)
- `GET /api/v1/tours/:id` — Get tour details
- `PATCH /api/v1/tours/:id` — Update a tour (admin)
- `DELETE /api/v1/tours/:id` — Delete a tour (admin)

### Bookings

- `POST /api/v1/bookings` — Create a booking
- `GET /api/v1/bookings` — List user bookings

### Payments

- `POST /api/v1/payment/init` — Initiate payment
- `POST /api/v1/payment/success` — Payment success callback
- `GET /api/v1/payment/invoice/:id` — Download invoice PDF

### Users

- `GET /api/v1/users` — List all users (admin)
- `GET /api/v1/users/me` — Get current user profile
- `PATCH /api/v1/users/:id` — Update user

### Stats

- `GET /api/v1/stats/tours` — Get tour statistics
- `GET /api/v1/stats/bookings` — Get booking statistics

---

## Key Architectural Concepts

### Error Handling

- **Global Error Handler:**  
  All errors are caught and formatted consistently using custom error classes in `errorHelpers/` and a global error middleware.
- **Validation Errors:**  
  Zod is used for request validation, and custom helpers transform Zod errors into user-friendly responses.

### Helpers

- **Slug Generation:**  
  Utility to create SEO-friendly slugs from tour names.
- **Date Formatting:**  
  Helpers for consistent date formatting across the app.
- **Validation:**  
  Centralized helpers for handling Mongoose and Zod validation errors.

### Interfaces

- **Type Safety:**  
  All models, DTOs, and service responses are typed using interfaces in the `interfaces/` folder.
- **Extensibility:**  
  Adding new features or models is easy and safe due to strong typing.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For questions or support, please open an issue or contact [sokalazad@gmail.com](mailto:sokalazad@gmail.com).
