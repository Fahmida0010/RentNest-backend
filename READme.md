# RentNest 🏠

> **Find & List Rental Properties with Ease**

RentNest is a role-based rental property marketplace backend API that connects tenants with landlords. It allows landlords to manage rental properties and rental requests, while tenants can browse properties, request rentals, complete payments, and review properties after completing a rental.

The platform also provides an admin management system for monitoring users, properties, and rental activities.

---

## 🚀 Project Overview

RentNest provides a secure RESTful API for managing a complete property rental workflow.

The system supports three user roles:

* **Tenant**
* **Landlord**
* **Admin**

Each role has specific permissions and protected API access through JWT-based authentication and role-based authorization.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

* User registration
* User login
* JWT-based authentication
* Secure password hashing
* Role-based authorization
* Protected API routes
* User profile management

### 🏠 Property Management

* Browse rental properties
* View property details
* Search and filter properties
* Filter by location
* Filter by price range
* Filter by property type
* Property category support
* Property availability management

### 👤 Tenant Features

* Register as a tenant
* Browse available properties
* View property details
* Submit rental requests
* View rental request history
* Track rental request status
* Make payments for approved rental requests
* View payment history
* Leave reviews after completed rentals
* Manage profile

### 🏘️ Landlord Features

* Register as a landlord
* Create property listings
* Update property information
* Delete property listings
* Manage property availability
* View rental requests
* Approve rental requests
* Reject rental requests
* View rental history

### 💳 Payment System

* SSLCommerz payment integration
* Payment session initialization
* Payment success callback
* Payment failure handling
* Payment cancellation handling
* Transaction tracking
* Payment status management
* Rental status update after successful payment
* Payment history

### ⭐ Review System

* Tenants can review properties
* Reviews are allowed only after a completed rental
* Rating and review comments
* Rental-based review validation
* Property review management

### 🛡️ Admin Features

* View all users
* Manage user status
* Ban users
* Unban users
* View all properties
* View all rental requests
* Manage property categories
* Monitor platform activities

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript

### Database & ORM

* PostgreSQL
* Prisma ORM
* Neon PostgreSQL

### Authentication & Security

* JSON Web Token (JWT)
* bcrypt
* Role-Based Access Control (RBAC)

### Validation

* Zod

### Payment Gateway

* SSLCommerz

### Development Tools

* npm
* tsx
* dotenv
* Postman / Thunder Client
* Git
* GitHub

---

## 📁 Project Structure

```text
RentNest/
│
├── prisma/
│   ├── schema.prisma
│   └── prisma.ts
│
├── src/
│   ├── app/
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   │
│   │   └── modules/
│   │       ├── admin/
│   │       ├── auth/
│   │       ├── category/
│   │       ├── landlord/
│   │       ├── payment/
│   │       ├── property/
│   │       ├── rental/
│   │       ├── review/
│ 
│   │
│   ├── routes/
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── bcrypt.ts
│   │   ├── catchAsync.ts
│   │   ├── jwt.ts
│   │   └── sendResponse.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .gitignore
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

---

## 👥 User Roles

| Role     | Description                        | Permissions                                                             |
| -------- | ---------------------------------- | ----------------------------------------------------------------------- |
| Tenant   | User looking for rental properties | Browse properties, submit rental requests, make payments, leave reviews |
| Landlord | Property owner                     | Create and manage properties, approve or reject rental requests         |
| Admin    | Platform administrator             | Manage users, properties, rentals, and categories                       |

---

## 🔄 Rental Workflow

```text
Tenant Registration
        ↓
Browse Properties
        ↓
View Property Details
        ↓
Submit Rental Request
        ↓
PENDING
        ↓
Landlord Reviews Request
       / \
      /   \
 APPROVED  REJECTED
     |
     ↓
Make Payment
     |
     ↓
Payment Successful
     |
     ↓
ACTIVE
     |
     ↓
COMPLETED
     |
     ↓
Leave Review
```

---

## 📊 Rental Status

| Status    | Description                                                |
| --------- | ---------------------------------------------------------- |
| PENDING   | Rental request submitted and waiting for landlord response |
| APPROVED  | Landlord approved the rental request                       |
| REJECTED  | Landlord rejected the rental request                       |
| ACTIVE    | Payment completed and rental is active                     |
| COMPLETED | Rental period has been completed                           |

---

## 💳 Payment Status

| Status    | Description                    |
| --------- | ------------------------------ |
| PENDING   | Payment has been initialized   |
| COMPLETED | Payment completed successfully |
| FAILED    | Payment transaction failed     |

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| POST   | `/api/auth/register` | Register a new user        |
| POST   | `/api/auth/login`    | Login user and receive JWT |
| GET    | `/api/auth/me`       | Get authenticated user     |

---

### 🏠 Properties

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| GET    | `/api/properties`     | Get all properties      |
| GET    | `/api/properties/:id` | Get property details    |
| GET    | `/api/categories`     | Get property categories |

Properties can be filtered using supported query parameters such as location, price, and property type.

---

### 🏘️ Landlord

| Method | Endpoint                       | Description               |
| ------ | ------------------------------ | ------------------------- |
| POST   | `/api/landlord/properties`     | Create property           |
| PUT    | `/api/landlord/properties/:id` | Update property           |
| DELETE | `/api/landlord/properties/:id` | Delete property           |
| GET    | `/api/landlord/requests`       | Get rental requests       |
| PATCH  | `/api/landlord/requests/:id`   | Approve or reject request |

---

### 📋 Rental Requests

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| POST   | `/api/rentals`     | Submit rental request      |
| GET    | `/api/rentals`     | Get tenant rental requests |
| GET    | `/api/rentals/:id` | Get rental request details |

---

### 💳 Payments

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| POST   | `/api/payments/create`  | Initialize rental payment |
| POST   | `/api/payments/success` | Handle successful payment |
| POST   | `/api/payments/fail`    | Handle failed payment     |
| POST   | `/api/payments/cancel`  | Handle cancelled payment  |
| GET    | `/api/payments`         | Get payment history       |
| GET    | `/api/payments/:id`     | Get payment details       |

---

### ⭐ Reviews

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| POST   | `/api/reviews` | Create a property review |

> A tenant can submit a review only after the related rental has reached the `COMPLETED` status.

---

### 🛡️ Admin

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| GET    | `/api/admin/users`      | Get all users           |
| PATCH  | `/api/admin/users/:id`  | Ban or unban user       |
| GET    | `/api/admin/properties` | Get all properties      |
| GET    | `/api/admin/rentals`    | Get all rental requests |

---

## 🗄️ Database Models

The RentNest database contains the following main models:

### User

Stores user account and authentication information.

### Category

Stores property categories such as:

* Apartment
* House
* Studio
* Villa

### Property

Stores rental property information and is connected to a landlord and category.

### RentalRequest

Stores rental requests submitted by tenants for properties.

### Payment

Stores payment transaction information, including:

* Transaction ID
* Rental request
* Amount
* Payment provider
* Payment status
* Payment date

### Review

Stores tenant ratings and reviews for completed rentals.

---

## 🔐 Authorization

Protected endpoints require a JWT access token.

Add the token to the request header:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Example:

```text
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Role-based middleware restricts access to Tenant, Landlord, and Admin-specific endpoints.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

DATABASE_URL=your_postgresql_database_url

JWT_ACCESS_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES_IN=7d

STORE_ID=your_sslcommerz_store_id
STORE_PASSWORD=your_sslcommerz_store_password

SERVER_URL=http://localhost:5000

```

> Never commit the `.env` file or expose secret credentials publicly.

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd RentNest
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file and add the required environment variables.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Push Database Schema

```bash
npx prisma db push
```

### 7. Start Development Server

```bash
npm run dev
```

The server will run on:

```text
http://localhost:5000
```

---

## 🧪 API Testing

The API can be tested using:

* Postman
* Thunder Client

For protected routes, include the JWT token in the `Authorization` header.

```text
Bearer YOUR_ACCESS_TOKEN
```

---

## 🔒 Security Features

* Password hashing with bcrypt
* JWT authentication
* Role-based authorization
* Protected API endpoints
* Zod request validation
* Environment variable protection
* Rental ownership validation
* Payment transaction validation
* Completed rental validation for reviews

---

## 🎯 Future Improvements

* Stripe payment integration
* Email notifications
* Rental expiry automation
* Property image upload with Cloudinary
* Wishlist and favorite properties
* Advanced property search
* Property recommendation system
* Admin analytics dashboard
* Payment webhook verification

---

## 👩‍💻 Author

**Fahmida Akter Tanjina**

Full-Stack Web Developer


⭐ If you find this project useful, feel free to give the repository a star.
