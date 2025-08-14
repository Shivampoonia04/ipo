# IPO Platform API Testing Guide

## Overview
This guide covers comprehensive API testing for the IPO Platform using Postman, including authentication, CRUD operations, file uploads, and automated testing scenarios.

## Prerequisites
- Postman installed
- IPO Platform backend running on localhost:5000
- Database configured and running
- Test data prepared

## Setup Instructions

### 1. Import Postman Collection
1. Open Postman
2. Click "Import" button
3. Import `IPO-API.postman_collection.json`
4. Import `IPO-Platform-Environment.postman_environment.json`

### 2. Configure Environment
- Select "IPO Platform - Development" environment
- Verify `base_url` is set to `http://localhost:5000`
- Ensure `admin_email` and `admin_password` are set

## Testing Scenarios

### Authentication & Authorization Testing

#### 1. Admin Login
- **Endpoint**: `POST /api/auth/login`
- **Test Cases**:
  - ✅ Valid admin credentials
  - ❌ Invalid email format
  - ❌ Wrong password
  - ❌ Inactive user account

#### 2. Token Validation
- **Endpoint**: `GET /api/auth/me`
- **Test Cases**:
  - ✅ Valid JWT token
  - ❌ Missing token
  - ❌ Expired token
  - ❌ Invalid token format

#### 3. Logout
- **Endpoint**: `POST /api/auth/logout`
- **Test Cases**:
  - ✅ Valid logout with token
  - ❌ Logout without token

### Company Master Data Testing

#### 1. Company CRUD Operations
- **Create Company**: `POST /api/companies`
- **Read Companies**: `GET /api/companies`
- **Update Company**: `PUT /api/companies/:id`
- **Delete Company**: `DELETE /api/companies/:id`

#### 2. Validation Testing
- **Required Fields**: name, sector
- **Data Types**: foundedYear (number), website (URL)
- **Business Rules**: No duplicate company names

### IPO Record Management Testing

#### 1. IPO CRUD Operations
- **Create IPO**: `POST /api/ipos`
- **Read IPOs**: `GET /api/ipos`
- **Update IPO**: `PUT /api/ipos/:id`
- **Delete IPO**: `DELETE /api/ipos/:id`

#### 2. Search and Filtering
- **Search by keyword**: `GET /api/ipos/search?q=tech`
- **Filter by status**: `GET /api/ipos?status=upcoming`
- **Pagination**: `GET /api/ipos?page=1&limit=10`

#### 3. Business Logic Validation
- **Date Validation**: openDate < closeDate
- **Price Range**: Valid format (e.g., "$50-$60")
- **Lot Size**: Positive integer

### Document Management Testing

#### 1. File Upload Endpoints
- **RHP Upload**: `POST /api/documents/:ipoId/upload/rhp`
- **DRHP Upload**: `POST /api/documents/:ipoId/upload/drhp`
- **Prospectus Upload**: `POST /api/documents/:ipoId/upload/prospectus`

#### 2. File Validation
- **File Type**: PDF only
- **File Size**: Max 10MB
- **Required Fields**: ipoId, document type

#### 3. Download Endpoints
- **Download RHP**: `GET /api/documents/:ipoId/download/rhp`
- **Download DRHP**: `GET /api/documents/:ipoId/download/drhp`
- **Download Prospectus**: `GET /api/documents/:ipoId/download/prospectus`

### Admin Dashboard Testing

#### 1. Dashboard Statistics
- **Endpoint**: `GET /api/admin/stats`
- **Test Cases**:
  - ✅ Admin access with valid token
  - ❌ Non-admin access
  - ❌ Missing token

#### 2. Activity Logs
- **Endpoint**: `GET /api/admin/logs`
- **Test Cases**:
  - ✅ Pagination parameters
  - ✅ Filter by date range
  - ✅ Admin-only access

#### 3. System Health
- **Endpoint**: `GET /api/admin/health`
- **Test Cases**:
  - ✅ Database connectivity
  - ✅ File system access
  - ✅ Memory usage

## Automated Testing with Postman Runner

### 1. Test Data Setup
```json
{
  "companies": [
    {
      "name": "Test Company 1",
      "sector": "Technology",
      "website": "https://test1.com"
    }
  ],
  "ipos": [
    {
      "companyId": 1,
      "ipoName": "Test IPO 1",
      "openDate": "2024-06-01T00:00:00.000Z",
      "closeDate": "2024-06-05T00:00:00.000Z"
    }
  ]
}
```

### 2. Test Scripts

#### Authentication Test Script
```javascript
// Test successful login
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.token).to.exist;
    
    // Store token for subsequent requests
    if (response.data.token) {
        pm.collectionVariables.set("auth_token", response.data.token);
    }
});
```

#### Company Creation Test Script
```javascript
// Test company creation
pm.test("Company created successfully", function () {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.id).to.exist;
    
    // Store company ID for subsequent tests
    if (response.data.id) {
        pm.collectionVariables.set("test_company_id", response.data.id);
    }
});
```

#### IPO Creation Test Script
```javascript
// Test IPO creation
pm.test("IPO created successfully", function () {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.id).to.exist;
    
    // Store IPO ID for subsequent tests
    if (response.data.id) {
        pm.collectionVariables.set("test_ipo_id", response.data.id);
    }
});
```

### 3. Error Handling Tests

#### Invalid Data Test
```javascript
// Test validation errors
pm.test("Validation error returned", function () {
    pm.response.to.have.status(400);
    const response = pm.response.json();
    pm.expect(response.success).to.be.false;
    pm.expect(response.message).to.include("validation");
});
```

#### Unauthorized Access Test
```javascript
// Test unauthorized access
pm.test("Unauthorized access blocked", function () {
    pm.response.to.have.status(401);
    const response = pm.response.json();
    pm.expect(response.success).to.be.false;
    pm.expect(response.message).to.include("Unauthorized");
});
```

## Performance Testing

### 1. Load Testing
- Use Postman Runner with multiple iterations
- Test concurrent requests
- Monitor response times

### 2. Stress Testing
- Send large payloads
- Test with invalid data
- Check memory usage

## Security Testing

### 1. Authentication
- JWT token expiration
- Role-based access control
- Session management

### 2. Input Validation
- SQL injection prevention
- XSS protection
- File upload security

### 3. Rate Limiting
- API rate limits
- Brute force protection

## Test Execution Order

1. **System Health Check**
   - Verify API is running
   - Check database connectivity

2. **Authentication Flow**
   - Admin login
   - Token validation
   - Logout

3. **Data Creation**
   - Create test companies
   - Create test IPOs
   - Upload test documents

4. **CRUD Operations**
   - Read operations
   - Update operations
   - Delete operations

5. **Search and Filtering**
   - Test search functionality
   - Test pagination
   - Test filters

6. **Error Scenarios**
   - Invalid data
   - Unauthorized access
   - Missing resources

7. **Cleanup**
   - Remove test data
   - Verify cleanup

## Expected Results

### Success Responses
- **200**: Successful GET/PUT operations
- **201**: Successful POST operations
- **204**: Successful DELETE operations

### Error Responses
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

## Monitoring and Reporting

### 1. Response Time Monitoring
- Track API response times
- Identify performance bottlenecks
- Monitor database query performance

### 2. Error Rate Tracking
- Monitor error response rates
- Track validation failures
- Log security violations

### 3. Test Results Summary
- Generate test execution reports
- Track test coverage
- Document failed test cases

## Troubleshooting

### Common Issues
1. **Database Connection**: Check database configuration
2. **File Uploads**: Verify upload directory permissions
3. **Authentication**: Check JWT secret configuration
4. **CORS**: Verify CORS origin settings

### Debug Steps
1. Check server logs
2. Verify environment variables
3. Test database connectivity
4. Check file system permissions

## Conclusion

This comprehensive testing approach ensures:
- All API endpoints are thoroughly tested
- Security measures are validated
- Performance requirements are met
- Error handling is robust
- Integration is smooth

Regular testing should be performed during development and before production deployment to maintain API quality and reliability. 