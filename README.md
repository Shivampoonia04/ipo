# IPO Platform - REST API

A robust backend API for managing IPO listings, company information, and document handling with JWT authentication and role-based access control.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Company Management**: Full CRUD operations for company information
- **IPO Management**: Complete IPO lifecycle management with status tracking
- **Document Handling**: Secure upload/download of RHP, DRHP, and Prospectus PDFs
- **Admin Dashboard**: Comprehensive statistics and activity logging
- **Search & Filtering**: Advanced search capabilities for IPOs and companies
- **File Storage**: Local file storage with proper security measures
- **Mobile-Friendly**: JSON-based REST APIs optimized for mobile integration

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer with PDF validation
- **Validation**: Express-validator
- **Security**: bcryptjs for password hashing

## 📋 Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 12.x
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd ipo-platform
npm install
```

### 2. Environment Setup

Copy the environment example file and configure your settings:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ipo_platform
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Admin Default Credentials
ADMIN_EMAIL=admin@ipo-platform.com
ADMIN_PASSWORD=admin123

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 3. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE ipo_platform;
```

### 4. Run the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | Admin login | Public |
| POST | `/api/auth/logout` | Logout | Admin |
| GET | `/api/auth/me` | Get current user | Admin |

### Companies

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/companies` | List all companies | Public |
| GET | `/api/companies/:id` | Get company details | Public |
| POST | `/api/companies` | Add new company | Admin |
| PUT | `/api/companies/:id` | Update company | Admin |
| DELETE | `/api/companies/:id` | Delete company | Admin |

### IPOs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/ipos` | Get all IPOs | Public |
| GET | `/api/ipos/search` | Search IPOs | Public |
| GET | `/api/ipos/:id` | Get IPO details | Public |
| POST | `/api/ipos` | Create new IPO | Admin |
| PUT | `/api/ipos/:id` | Update IPO | Admin |
| DELETE | `/api/ipos/:id` | Delete IPO | Admin |

### Documents

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/documents/:id/upload/rhp` | Upload RHP | Admin |
| POST | `/api/documents/:id/upload/drhp` | Upload DRHP | Admin |
| POST | `/api/documents/:id/upload/prospectus` | Upload Prospectus | Admin |
| GET | `/api/documents/:id/download/rhp` | Download RHP | Public |
| GET | `/api/documents/:id/download/drhp` | Download DRHP | Public |
| GET | `/api/documents/:id/download/prospectus` | Download Prospectus | Public |
| DELETE | `/api/documents/:id/delete-doc` | Delete document | Admin |

### Admin

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/stats` | Dashboard statistics | Admin |
| GET | `/api/admin/logs` | Activity logs | Admin |
| GET | `/api/admin/health` | System health | Admin |

## 🔐 Authentication

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ipo-platform.com",
    "password": "admin123"
  }'
```

### Using JWT Token

```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📁 Project Structure

```
ipo-platform/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── validation.js        # Input validation
│   ├── upload.js            # File upload handling
│   └── logger.js            # Activity logging
├── models/
│   ├── index.js             # Model associations
│   ├── User.js              # User model
│   ├── Company.js           # Company model
│   ├── IPO.js               # IPO model
│   └── ActivityLog.js       # Activity log model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── companies.js         # Company routes
│   ├── ipos.js              # IPO routes
│   ├── documents.js         # Document routes
│   └── admin.js             # Admin routes
├── postman/
│   └── IPO-API.postman_collection.json  # API test collection
├── uploads/                 # File storage directory
├── server.js                # Main application file
├── package.json             # Dependencies
└── README.md               # This file
```

## 🧪 Testing

### Using Postman

1. Import the Postman collection: `postman/IPO-API.postman_collection.json`
2. Set the `base_url` variable to `http://localhost:5000`
3. Run the "Admin Login" request to get a JWT token
4. The token will be automatically set in the collection variables
5. Test all other endpoints

### Manual Testing

```bash
# Health check
curl http://localhost:5000/health

# Get all IPOs
curl http://localhost:5000/api/ipos

# Get all companies
curl http://localhost:5000/api/companies
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm run migrate     # Run database migrations
npm run seed        # Seed database with sample data
```

### Database Migrations

```bash
# Create a new migration
npx sequelize-cli migration:generate --name migration-name

# Run migrations
npm run migrate

# Undo last migration
npx sequelize-cli db:migrate:undo
```

## 🚀 Deployment

### Environment Variables

Ensure all required environment variables are set in production:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET` (use a strong, unique secret)
- `NODE_ENV=production`
- `PORT` (if not using default 5000)

### Production Considerations

1. **Database**: Use a managed PostgreSQL service
2. **File Storage**: Consider using AWS S3 for file storage
3. **Security**: 
   - Use HTTPS in production
   - Set strong JWT secrets
   - Configure proper CORS origins
   - Implement rate limiting
4. **Monitoring**: Add application monitoring and logging
5. **Backup**: Regular database backups

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t ipo-platform .
docker run -p 5000:5000 ipo-platform
```

## 📊 API Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if applicable)
  ]
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin and public access levels
- **Input Validation**: Comprehensive request validation
- **File Security**: PDF-only uploads with size limits
- **SQL Injection Protection**: Sequelize ORM with parameterized queries
- **CORS Configuration**: Configurable cross-origin requests
- **Password Hashing**: bcryptjs for secure password storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the API documentation
- Review the Postman collection for examples

---

**Note**: This is a production-ready API with comprehensive features for IPO management. Make sure to configure your environment variables and database before running in production.
