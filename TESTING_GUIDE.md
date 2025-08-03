# IPO Platform API Testing Guide

## 🧪 **Comprehensive API Testing Documentation**

This guide provides detailed testing scenarios for all API endpoints in the IPO Platform.

## 📋 **Prerequisites**

1. **Install Postman**: Download from [postman.com](https://www.postman.com/downloads/)
2. **Import Collection**: Import `postman/IPO-API.postman_collection.json`
3. **Set Environment Variables**:
   - `base_url`: `http://localhost:5000`
   - `auth_token`: (will be set automatically after login)

## 🔐 **1. Authentication Testing**

### 1.1 Admin Login Test
```bash
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "email": "admin@ipo-platform.com",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@ipo-platform.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin"
    }
  }
}
```

### 1.2 Invalid Login Test
```bash
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "email": "wrong@email.com",
  "password": "wrongpassword"
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 1.3 Get Current User Test
```bash
GET {{base_url}}/api/auth/me
Authorization: Bearer {{auth_token}}
```

## 🏢 **2. Company Management Testing**

### 2.1 Get All Companies (Public)
```bash
GET {{base_url}}/api/companies?page=1&limit=10
```

**Test Cases:**
- ✅ Should return paginated list of companies
- ✅ Should include IPO count for each company
- ✅ Should filter by search query `?q=tech`
- ✅ Should handle pagination `?page=2&limit=5`

### 2.2 Get Company by ID (Public)
```bash
GET {{base_url}}/api/companies/1
```

**Test Cases:**
- ✅ Should return company details with associated IPOs
- ✅ Should return 404 for non-existent company
- ✅ Should return 400 for invalid ID format

### 2.3 Create Company (Admin Only)
```bash
POST {{base_url}}/api/companies
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "name": "Test Company",
  "description": "A test company for API testing",
  "sector": "Technology",
  "website": "https://testcompany.com",
  "foundedYear": 2020,
  "headquarters": "Test City, TC"
}
```

**Test Cases:**
- ✅ Should create company successfully
- ✅ Should return 401 without authentication
- ✅ Should return 400 for invalid data
- ✅ Should return 400 for duplicate company name

### 2.4 Update Company (Admin Only)
```bash
PUT {{base_url}}/api/companies/1
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "name": "Updated Test Company",
  "description": "Updated description"
}
```

### 2.5 Delete Company (Admin Only)
```bash
DELETE {{base_url}}/api/companies/1
Authorization: Bearer {{auth_token}}
```

**Test Cases:**
- ✅ Should return 400 if company has active IPOs
- ✅ Should mark company as inactive
- ✅ Should return 401 without authentication

## 📈 **3. IPO Management Testing**

### 3.1 Get All IPOs (Public)
```bash
GET {{base_url}}/api/ipos?page=1&limit=10
```

**Test Cases:**
- ✅ Should return paginated list of IPOs
- ✅ Should include company details
- ✅ Should filter by status `?status=upcoming`
- ✅ Should filter by company `?companyId=1`
- ✅ Should search by keyword `?q=tech`

### 3.2 Search IPOs (Public)
```bash
GET {{base_url}}/api/ipos/search?q=tech&limit=5
```

**Test Cases:**
- ✅ Should return 400 if no search query provided
- ✅ Should search in IPO name, description, exchange
- ✅ Should respect limit parameter

### 3.3 Get IPO by ID (Public)
```bash
GET {{base_url}}/api/ipos/1
```

### 3.4 Create IPO (Admin Only)
```bash
POST {{base_url}}/api/ipos
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "companyId": 1,
  "ipoName": "Test IPO 2024",
  "openDate": "2024-06-01T00:00:00.000Z",
  "closeDate": "2024-06-05T00:00:00.000Z",
  "priceRange": "$50-$60",
  "lotSize": 100,
  "totalShares": 1000000,
  "issueSize": 55000000,
  "faceValue": 10,
  "exchange": "NSE",
  "registrar": "Link Intime",
  "leadManager": "Morgan Stanley",
  "description": "Test IPO for API testing"
}
```

**Test Cases:**
- ✅ Should create IPO successfully
- ✅ Should return 400 for invalid company ID
- ✅ Should return 400 for invalid date format
- ✅ Should return 401 without authentication

### 3.5 Update IPO (Admin Only)
```bash
PUT {{base_url}}/api/ipos/1
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "priceRange": "$55-$65",
  "status": "open"
}
```

### 3.6 Delete IPO (Admin Only)
```bash
DELETE {{base_url}}/api/ipos/1
Authorization: Bearer {{auth_token}}
```

## 📄 **4. Document Management Testing**

### 4.1 Upload RHP Document (Admin Only)
```bash
POST {{base_url}}/api/documents/1/upload/rhp
Authorization: Bearer {{auth_token}}
Content-Type: multipart/form-data

Form Data:
- rhp: [PDF file]
```

**Test Cases:**
- ✅ Should upload PDF successfully
- ✅ Should return 400 for non-PDF files
- ✅ Should return 400 for files > 10MB
- ✅ Should return 404 for non-existent IPO
- ✅ Should replace existing file

### 4.2 Upload DRHP Document (Admin Only)
```bash
POST {{base_url}}/api/documents/1/upload/drhp
Authorization: Bearer {{auth_token}}
Content-Type: multipart/form-data

Form Data:
- drhp: [PDF file]
```

### 4.3 Upload Prospectus Document (Admin Only)
```bash
POST {{base_url}}/api/documents/1/upload/prospectus
Authorization: Bearer {{auth_token}}
Content-Type: multipart/form-data

Form Data:
- prospectus: [PDF file]
```

### 4.4 Download RHP Document (Public)
```bash
GET {{base_url}}/api/documents/1/download/rhp
```

**Test Cases:**
- ✅ Should download PDF file
- ✅ Should return 404 if document not available
- ✅ Should return 404 for non-existent IPO

### 4.5 Download DRHP Document (Public)
```bash
GET {{base_url}}/api/documents/1/download/drhp
```

### 4.6 Download Prospectus Document (Public)
```bash
GET {{base_url}}/api/documents/1/download/prospectus
```

### 4.7 Delete Document (Admin Only)
```bash
DELETE {{base_url}}/api/documents/1/delete-doc
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "documentType": "rhp"
}
```

**Test Cases:**
- ✅ Should delete file from filesystem
- ✅ Should update IPO record
- ✅ Should return 400 for invalid document type
- ✅ Should return 404 if document not found

## 📊 **5. Admin Dashboard Testing**

### 5.1 Get Dashboard Stats (Admin Only)
```bash
GET {{base_url}}/api/admin/stats
Authorization: Bearer {{auth_token}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalIPOs": 5,
    "totalCompanies": 5,
    "activeIPOs": 1,
    "upcomingIPOs": 3,
    "recentIPOs": [...],
    "recentLogins": [...],
    "statusDistribution": [...]
  }
}
```

### 5.2 Get Activity Logs (Admin Only)
```bash
GET {{base_url}}/api/admin/logs?page=1&limit=20
Authorization: Bearer {{auth_token}}
```

**Test Cases:**
- ✅ Should return paginated logs
- ✅ Should filter by action `?action=LOGIN`
- ✅ Should filter by user `?userId=1`
- ✅ Should filter by date range `?startDate=2024-01-01&endDate=2024-12-31`

### 5.3 System Health Check (Admin Only)
```bash
GET {{base_url}}/api/admin/health
Authorization: Bearer {{auth_token}}
```

## 🔧 **6. Error Handling Testing**

### 6.1 Authentication Errors
- ✅ Test without token: Should return 401
- ✅ Test with invalid token: Should return 401
- ✅ Test with expired token: Should return 401

### 6.2 Authorization Errors
- ✅ Test admin-only endpoints with user role: Should return 403
- ✅ Test public endpoints: Should work without authentication

### 6.3 Validation Errors
- ✅ Test invalid email format: Should return 400
- ✅ Test invalid date format: Should return 400
- ✅ Test missing required fields: Should return 400
- ✅ Test invalid ID format: Should return 400

### 6.4 Not Found Errors
- ✅ Test non-existent resources: Should return 404
- ✅ Test invalid endpoints: Should return 404

## 📱 **7. Mobile App Integration Testing**

### 7.1 Public Endpoints (Mobile-Friendly)
```bash
# Test all public endpoints work without authentication
GET {{base_url}}/api/ipos
GET {{base_url}}/api/companies
GET {{base_url}}/api/ipos/1
GET {{base_url}}/api/companies/1
GET {{base_url}}/api/documents/1/download/rhp
```

### 7.2 JSON Response Format
- ✅ All responses should be valid JSON
- ✅ Consistent response structure
- ✅ Proper HTTP status codes
- ✅ Meaningful error messages

## 🚀 **8. Performance Testing**

### 8.1 Load Testing with Postman Runner
1. **Setup Postman Runner**:
   - Import the collection
   - Set iterations to 100
   - Set delay to 100ms

2. **Test Endpoints**:
   - GET `/api/ipos` (Public endpoint)
   - GET `/api/companies` (Public endpoint)
   - POST `/api/auth/login` (Authentication)

3. **Monitor Response Times**:
   - Average response time < 500ms
   - 95th percentile < 1000ms
   - No failed requests

### 8.2 Edge Case Testing
- ✅ Large pagination limits
- ✅ Special characters in search queries
- ✅ Very large file uploads
- ✅ Concurrent requests

## 📋 **9. Test Data Setup**

### 9.1 Seed Database
```bash
npm run seed
```

This will create:
- 5 sample companies
- 5 sample IPOs
- 1 admin user

### 9.2 Test Credentials
```
Email: admin@ipo-platform.com
Password: admin123
```

## ✅ **10. Testing Checklist**

### Authentication & Authorization
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Access protected routes with token
- [ ] Access protected routes without token
- [ ] Access public routes without token

### Company Management
- [ ] Get all companies (public)
- [ ] Get company by ID (public)
- [ ] Create company (admin only)
- [ ] Update company (admin only)
- [ ] Delete company (admin only)
- [ ] Search companies
- [ ] Pagination

### IPO Management
- [ ] Get all IPOs (public)
- [ ] Get IPO by ID (public)
- [ ] Create IPO (admin only)
- [ ] Update IPO (admin only)
- [ ] Delete IPO (admin only)
- [ ] Search IPOs
- [ ] Filter by status
- [ ] Filter by company

### Document Management
- [ ] Upload RHP (admin only)
- [ ] Upload DRHP (admin only)
- [ ] Upload Prospectus (admin only)
- [ ] Download RHP (public)
- [ ] Download DRHP (public)
- [ ] Download Prospectus (public)
- [ ] Delete document (admin only)

### Admin Dashboard
- [ ] Get dashboard stats (admin only)
- [ ] Get activity logs (admin only)
- [ ] System health check (admin only)

### Error Handling
- [ ] 400 Bad Request
- [ ] 401 Unauthorized
- [ ] 403 Forbidden
- [ ] 404 Not Found
- [ ] 500 Internal Server Error

### Performance
- [ ] Response time < 500ms
- [ ] Handle concurrent requests
- [ ] File upload limits
- [ ] Search performance

## 🎯 **11. Testing Results Summary**

After completing all tests, document:

1. **Total Tests**: Number of test cases executed
2. **Passed**: Number of successful tests
3. **Failed**: Number of failed tests
4. **Coverage**: Percentage of endpoints tested
5. **Performance**: Average response times
6. **Issues Found**: Any bugs or improvements needed

## 📝 **12. Postman Collection Usage**

1. **Import Collection**: Import `IPO-API.postman_collection.json`
2. **Set Environment**: Create environment with `base_url` variable
3. **Run Tests**: Use Postman Runner for automated testing
4. **Export Results**: Save test results for documentation

---

**Note**: This testing guide ensures comprehensive API validation before frontend integration, reducing debugging time and improving overall system reliability. 