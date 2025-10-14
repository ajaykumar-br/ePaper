# eNewspaper Backend API

A modern Node.js backend API with JWT authentication, built with Express.js and Prisma ORM.

## 🏗️ Project Structure

```
src/
├── config/
│   ├── database.js      # Prisma client configuration
│   └── jwt.js          # JWT utilities and configuration
├── constants/
│   └── index.js        # Application constants (messages, status codes, validation rules)
├── middleware/
│   └── auth.js         # JWT authentication middleware
├── routes/
│   ├── auth.js         # Authentication routes (signup, login)
│   └── protected.js    # Protected routes (profile, etc.)
├── utils/
│   └── validation.js   # Input validation utilities
└── index.js           # Main application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   # Create .env file
   DATABASE_URL="postgresql://username:password@localhost:5432/enewspaper"
   JWT_SECRET="your-super-secret-jwt-key"
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/signup`

Create a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "jwt-token"
}
```

#### POST `/api/auth/login`

Authenticate user and get JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "jwt-token"
}
```

### Protected Routes (`/api/protected`)

All protected routes require JWT token in Authorization header:

```
Authorization: Bearer <jwt-token>
```

#### GET `/api/protected/profile`

Get current user's profile information.

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### PUT `/api/protected/profile`

Update user's profile information.

**Request Body:**

```json
{
  "name": "John Smith"
}
```

#### GET `/api/protected/protected`

Example protected route for testing authentication.

## 🔧 Configuration

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `PORT`: Server port (default: 3000)

### Validation Rules

- **Email**: Must be a valid email format
- **Password**: Minimum 8 characters with at least one letter and one number
- **Name**: Minimum 2 characters (optional field)
- **JWT Token**: Expires in 7 days

## 🛡️ Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token-based authentication
- Input validation and sanitization
- Secure error handling
- Password exclusion from API responses

## 📦 Dependencies

- **express**: Web framework
- **@prisma/client**: Database ORM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token handling

## 🔄 Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🧪 Testing the API

You can test the API using tools like Postman, Insomnia, or curl:

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get Profile (replace TOKEN with actual JWT)
curl -X GET http://localhost:3000/api/protected/profile \
  -H "Authorization: Bearer TOKEN"
```

## 📝 License

ISC
