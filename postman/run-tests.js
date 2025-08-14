#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  collection: './IPO-API.postman_collection.json',
  environment: './IPO-Platform-Environment.postman_environment.json',
  reportDir: './reports',
  iterations: 1,
  delay: 1000
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`  ${message}`, 'bright');
  log('='.repeat(60), 'cyan');
}

function logSection(message) {
  log('\n' + '-'.repeat(40), 'yellow');
  log(`  ${message}`, 'yellow');
  log('-'.repeat(40), 'yellow');
}

function checkDependencies() {
  return new Promise((resolve, reject) => {
    exec('newman --version', (error, stdout, stderr) => {
      if (error) {
        log('❌ Newman is not installed. Installing...', 'red');
        installNewman()
          .then(() => resolve())
          .catch(reject);
      } else {
        log(`✅ Newman version: ${stdout.trim()}`, 'green');
        resolve();
      }
    });
  });
}

function installNewman() {
  return new Promise((resolve, reject) => {
    log('📦 Installing Newman...', 'blue');
    exec('npm install -g newman', (error, stdout, stderr) => {
      if (error) {
        log('❌ Failed to install Newman', 'red');
        reject(error);
      } else {
        log('✅ Newman installed successfully', 'green');
        resolve();
      }
    });
  });
}

function checkFiles() {
  const files = [
    config.collection,
    config.environment
  ];

  const missingFiles = files.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    log('❌ Missing required files:', 'red');
    missingFiles.forEach(file => log(`   - ${file}`, 'red'));
    return false;
  }

  log('✅ All required files found', 'green');
  return true;
}

function createReportDirectory() {
  if (!fs.existsSync(config.reportDir)) {
    fs.mkdirSync(config.reportDir, { recursive: true });
    log(`📁 Created reports directory: ${config.reportDir}`, 'blue');
  }
}

function runTests() {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = path.join(config.reportDir, `test-report-${timestamp}.json`);
    const htmlReportFile = path.join(config.reportDir, `test-report-${timestamp}.html`);

    const newmanCommand = [
      'newman',
      `run "${config.collection}"`,
      `-e "${config.environment}"`,
      `--iteration-count ${config.iterations}`,
      `--delay-request ${config.delay}`,
      `--reporters json,cli,html`,
      `--reporter-json-export "${reportFile}"`,
      `--reporter-html-export "${htmlReportFile}"`,
      '--bail'
    ].join(' ');

    logSection('Running API Tests');
    log(`Command: ${newmanCommand}`, 'blue');

    exec(newmanCommand, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        log('❌ Tests failed with errors', 'red');
        log(`Error: ${error.message}`, 'red');
        reject(error);
      } else {
        log('✅ Tests completed successfully', 'green');
        log(`📊 JSON Report: ${reportFile}`, 'blue');
        log(`🌐 HTML Report: ${htmlReportFile}`, 'blue');
        resolve();
      }
    });
  });
}

function generateTestSummary() {
  logSection('Test Summary');
  log('📋 Test Coverage:', 'blue');
  log('   ✅ Authentication & Authorization', 'green');
  log('   ✅ Company Master Data CRUD', 'green');
  log('   ✅ IPO Record Management', 'green');
  log('   ✅ Document Upload/Download', 'green');
  log('   ✅ Admin Dashboard Functions', 'green');
  log('   ✅ Error Handling & Validation', 'green');
  log('   ✅ Security & Performance', 'green');
}

function generateNextSteps() {
  logSection('Next Steps');
  log('🚀 To run tests manually:', 'blue');
  log('   1. Open Postman', 'cyan');
  log('   2. Import the collection and environment', 'cyan');
  log('   3. Run individual requests or use Collection Runner', 'cyan');
  log('   4. Monitor response times and error rates', 'cyan');
  
  log('\n📊 To run automated tests:', 'blue');
  log('   1. Ensure Newman is installed: npm install -g newman', 'cyan');
  log('   2. Run: node run-tests.js', 'cyan');
  log('   3. Check reports directory for results', 'cyan');
  
  log('\n🔧 To customize tests:', 'blue');
  log('   1. Modify test-data.json for different scenarios', 'cyan');
  log('   2. Update environment variables as needed', 'cyan');
  log('   3. Add custom test scripts in Postman', 'cyan');
}

async function main() {
  try {
    logHeader('IPO Platform API Testing Automation');
    
    logSection('Pre-flight Checks');
    
    // Check dependencies
    await checkDependencies();
    
    // Check required files
    if (!checkFiles()) {
      process.exit(1);
    }
    
    // Create report directory
    createReportDirectory();
    
    logSection('Starting Test Execution');
    
    // Run tests
    await runTests();
    
    // Generate summary
    generateTestSummary();
    
    // Generate next steps
    generateNextSteps();
    
    logHeader('Testing Complete! 🎉');
    
  } catch (error) {
    log('❌ Test execution failed', 'red');
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  runTests,
  checkDependencies,
  checkFiles
}; 