# IPO Platform API Testing Suite

This directory contains a comprehensive API testing suite for the IPO Platform using Postman and Newman CLI tools.

## 🚀 Quick Start

### Prerequisites
- [Postman](https://www.postman.com/downloads/) installed
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) package manager
- IPO Platform backend running on `localhost:5000`

### 1. Import Postman Collection
1. Open Postman
2. Click "Import" button
3. Import `IPO-API.postman_collection.json`
4. Import `IPO-Platform-Environment.postman_environment.json`

### 2. Configure Environment
- Select "IPO Platform - Development" environment
- Verify `base_url` is set to `http://localhost:5000`
- Ensure `admin_email` and `admin_password` are set

### 3. Run Tests
- **Manual**: Use Postman Collection Runner
- **Automated**: Use the provided scripts (see below)

## 📁 File Structure

```
postman/
├── IPO-API.postman_collection.json          # Main Postman collection
├── IPO-Platform-Environment.postman_environment.json  # Environment variables
├── test-data.json                           # Sample test data
├── run-tests.js                             # Node.js automation script
├── execute-tests.ps1                        # PowerShell automation script
├── package.json                             # Node.js dependencies
├── API-TESTING-GUIDE.md                    # Comprehensive testing guide
└── README.md                                # This file
```

## 🧪 Testing Scenarios

### Authentication & Authorization
- ✅ Admin login/logout
- ✅ JWT token validation
- ✅ Role-based access control
- ✅ Protected route access

### Company Master Data
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Data validation
- ✅ Business rule enforcement
- ✅ Duplicate prevention

### IPO Record Management
- ✅ IPO lifecycle management
- ✅ Search and filtering
- ✅ Pagination
- ✅ Date validation
- ✅ Price range validation

### Document Management
- ✅ File upload (RHP, DRHP, Prospectus)
- ✅ File download
- ✅ File validation
- ✅ Storage management

### Admin Dashboard
- ✅ Statistics and metrics
- ✅ Activity logging
- ✅ System health monitoring
- ✅ User management

## 🔧 Automated Testing

### Using Node.js Script

```bash
# Navigate to postman directory
cd ipo-platform/postman

# Install dependencies
npm install

# Run tests
npm test

# Or run directly
node run-tests.js
```

### Using PowerShell Script (Windows)

```powershell
# Navigate to postman directory
cd ipo-platform/postman

# Show help
.\execute-tests.ps1 -Help

# Run basic tests
.\execute-tests.ps1

# Install Newman and run with reports
.\execute-tests.ps1 -InstallNewman -GenerateReports

# Run with custom parameters
.\execute-tests.ps1 -Iterations 3 -Delay 2000 -GenerateReports
```

### Using Newman CLI Directly

```bash
# Install Newman globally
npm install -g newman

# Run collection
newman run ./IPO-API.postman_collection.json -e ./IPO-Platform-Environment.postman_environment.json

# Generate HTML report
newman run ./IPO-API.postman_collection.json -e ./IPO-Platform-Environment.postman_environment.json --reporters html --reporter-html-export ./reports/report.html

# Run with multiple iterations
newman run ./IPO-API.postman_collection.json -e ./IPO-Platform-Environment.postman_environment.json --iteration-count 5
```

## 📊 Test Reports

### Report Types
- **CLI Output**: Real-time console output
- **JSON Report**: Detailed test results in JSON format
- **HTML Report**: Visual test results with charts and graphs

### Report Location
Reports are generated in the `./reports/` directory with timestamps:
- `test-report-YYYY-MM-DD-HH-MM-SS.json`
- `test-report-YYYY-MM-DD-HH-MM-SS.html`

## 🎯 Test Coverage

| Category | Endpoints | Test Cases | Status |
|----------|-----------|------------|---------|
| Authentication | 3 | 12 | ✅ Complete |
| Companies | 5 | 20 | ✅ Complete |
| IPOs | 6 | 25 | ✅ Complete |
| Documents | 7 | 18 | ✅ Complete |
| Admin | 3 | 9 | ✅ Complete |
| System | 1 | 3 | ✅ Complete |

**Total**: 25 endpoints, 87 test cases

## 🔒 Security Testing

### Authentication Tests
- JWT token expiration
- Invalid token handling
- Role-based access control
- Session management

### Input Validation Tests
- SQL injection prevention
- XSS protection
- File upload security
- Data sanitization

### Authorization Tests
- Admin-only endpoints
- User permission levels
- Resource access control

## 📈 Performance Testing

### Load Testing
- Multiple concurrent requests
- Response time monitoring
- Throughput measurement
- Resource utilization

### Stress Testing
- Large payload handling
- Invalid data processing
- Memory usage monitoring
- Error rate tracking

## 🚨 Error Handling

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **204**: No Content
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

### Validation Errors
- Required field validation
- Data type validation
- Business rule validation
- File format validation

## 🛠️ Customization

### Adding New Tests
1. Create new request in Postman collection
2. Add test scripts using JavaScript
3. Update environment variables if needed
4. Add to automation scripts

### Modifying Test Data
Edit `test-data.json` to:
- Add new test companies
- Create different IPO scenarios
- Test various user roles
- Validate edge cases

### Environment Variables
Update `IPO-Platform-Environment.postman_environment.json`:
- Change base URL for different environments
- Update test credentials
- Modify test file paths
- Add new variables as needed

## 🔍 Troubleshooting

### Common Issues

#### Newman Not Found
```bash
# Install Newman globally
npm install -g newman

# Verify installation
newman --version
```

#### Collection Import Errors
- Ensure JSON files are valid
- Check file paths in collection
- Verify environment variable references

#### Test Failures
- Check backend server status
- Verify database connectivity
- Check environment variables
- Review server logs

#### File Upload Issues
- Verify upload directory permissions
- Check file size limits
- Ensure correct file types
- Validate file paths

### Debug Steps
1. Check server logs for errors
2. Verify environment configuration
3. Test individual endpoints manually
4. Check database connectivity
5. Validate file system permissions

## 📚 Additional Resources

### Documentation
- [Postman Learning Center](https://learning.postman.com/)
- [Newman CLI Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/)
- [IPO Platform API Docs](./API-TESTING-GUIDE.md)

### Support
- Check server logs for backend errors
- Review Postman console for request/response details
- Use Newman verbose mode for detailed output
- Consult API testing guide for specific scenarios

## 🎉 Success Criteria

A successful test run should:
- ✅ Execute all 87 test cases
- ✅ Pass authentication and authorization
- ✅ Complete CRUD operations successfully
- ✅ Handle file uploads and downloads
- ✅ Generate comprehensive reports
- ✅ Complete within acceptable time limits
- ✅ Show 0% error rate

## 🔄 Continuous Integration

### GitHub Actions
```yaml
- name: Run API Tests
  run: |
    cd ipo-platform/postman
    npm install
    npm test
```

### Jenkins Pipeline
```groovy
stage('API Testing') {
    steps {
        dir('ipo-platform/postman') {
            sh 'npm install'
            sh 'npm test'
        }
    }
}
```

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: IPO Platform Team 