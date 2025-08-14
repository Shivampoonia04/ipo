# IPO Platform API Testing Script for Windows
# This script automates the execution of Postman collection tests

param(
    [string]$Environment = "development",
    [int]$Iterations = 1,
    [int]$Delay = 1000,
    [switch]$InstallNewman,
    [switch]$GenerateReports,
    [switch]$Help
)

# Function to display help
function Show-Help {
    Write-Host @"
IPO Platform API Testing Script

Usage: .\execute-tests.ps1 [options]

Options:
    -Environment <env>      Environment to test (default: development)
    -Iterations <num>       Number of test iterations (default: 1)
    -Delay <ms>            Delay between requests in milliseconds (default: 1000)
    -InstallNewman         Install Newman CLI tool
    -GenerateReports       Generate HTML and JSON reports
    -Help                  Show this help message

Examples:
    .\execute-tests.ps1
    .\execute-tests.ps1 -Environment staging -Iterations 3
    .\execute-tests.ps1 -InstallNewman -GenerateReports

"@ -ForegroundColor Cyan
}

# Function to write colored output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Function to check if Newman is installed
function Test-NewmanInstalled {
    try {
        $null = Get-Command newman -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

# Function to install Newman
function Install-Newman {
    Write-ColorOutput "Installing Newman CLI tool..." "Yellow"
    try {
        npm install -g newman
        if (Test-NewmanInstalled) {
            Write-ColorOutput "✅ Newman installed successfully" "Green"
            return $true
        } else {
            Write-ColorOutput "❌ Newman installation failed" "Red"
            return $false
        }
    }
    catch {
        Write-ColorOutput "❌ Error installing Newman: $($_.Exception.Message)" "Red"
        return $false
    }
}

# Function to check required files
function Test-RequiredFiles {
    $requiredFiles = @(
        "IPO-API.postman_collection.json",
        "IPO-Platform-Environment.postman_environment.json"
    )
    
    $missingFiles = @()
    foreach ($file in $requiredFiles) {
        if (-not (Test-Path $file)) {
            $missingFiles += $file
        }
    }
    
    if ($missingFiles.Count -gt 0) {
        Write-ColorOutput "❌ Missing required files:" "Red"
        foreach ($file in $missingFiles) {
            Write-ColorOutput "   - $file" "Red"
        }
        return $false
    }
    
    Write-ColorOutput "✅ All required files found" "Green"
    return $true
}

# Function to create reports directory
function New-ReportsDirectory {
    $reportsDir = ".\reports"
    if (-not (Test-Path $reportsDir)) {
        New-Item -ItemType Directory -Path $reportsDir -Force | Out-Null
        Write-ColorOutput "📁 Created reports directory: $reportsDir" "Blue"
    }
}

# Function to run tests
function Invoke-TestExecution {
    param(
        [string]$Environment,
        [int]$Iterations,
        [int]$Delay,
        [bool]$GenerateReports
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd-HH-mm-ss"
    $collectionFile = ".\IPO-API.postman_collection.json"
    $environmentFile = ".\IPO-Platform-Environment.postman_environment.json"
    
    # Build Newman command
    $newmanArgs = @(
        "run",
        "`"$collectionFile`"",
        "-e",
        "`"$environmentFile`"",
        "--iteration-count",
        $Iterations,
        "--delay-request",
        $Delay
    )
    
    if ($GenerateReports) {
        $reportsDir = ".\reports"
        $jsonReport = "$reportsDir\test-report-$timestamp.json"
        $htmlReport = "$reportsDir\test-report-$timestamp.html"
        
        $newmanArgs += @(
            "--reporters",
            "json,cli,html",
            "--reporter-json-export",
            "`"$jsonReport`"",
            "--reporter-html-export",
            "`"$htmlReport`""
        )
    }
    
    $newmanArgs += "--bail"
    
    Write-ColorOutput "🚀 Executing API tests..." "Blue"
    Write-ColorOutput "Command: newman $($newmanArgs -join ' ')" "Cyan"
    
    try {
        $process = Start-Process -FilePath "newman" -ArgumentList $newmanArgs -NoNewWindow -Wait -PassThru
        
        if ($process.ExitCode -eq 0) {
            Write-ColorOutput "✅ Tests completed successfully" "Green"
            if ($GenerateReports) {
                Write-ColorOutput "📊 JSON Report: $jsonReport" "Blue"
                Write-ColorOutput "🌐 HTML Report: $htmlReport" "Blue"
            }
            return $true
        } else {
            Write-ColorOutput "❌ Tests failed with exit code: $($process.ExitCode)" "Red"
            return $false
        }
    }
    catch {
        Write-ColorOutput "❌ Error executing tests: $($_.Exception.Message)" "Red"
        return $false
    }
}

# Function to display test summary
function Show-TestSummary {
    Write-ColorOutput "`n📋 Test Coverage:" "Blue"
    Write-ColorOutput "   ✅ Authentication & Authorization" "Green"
    Write-ColorOutput "   ✅ Company Master Data CRUD" "Green"
    Write-ColorOutput "   ✅ IPO Record Management" "Green"
    Write-ColorOutput "   ✅ Document Upload/Download" "Green"
    Write-ColorOutput "   ✅ Admin Dashboard Functions" "Green"
    Write-ColorOutput "   ✅ Error Handling & Validation" "Green"
    Write-ColorOutput "   ✅ Security & Performance" "Green"
}

# Function to display next steps
function Show-NextSteps {
    Write-ColorOutput "`n🚀 Next Steps:" "Blue"
    Write-ColorOutput "1. Open Postman and import the collection" "Cyan"
    Write-ColorOutput "2. Run individual requests or use Collection Runner" "Cyan"
    Write-ColorOutput "3. Monitor response times and error rates" "Cyan"
    Write-ColorOutput "4. Check reports directory for detailed results" "Cyan"
}

# Main execution
function Main {
    # Show help if requested
    if ($Help) {
        Show-Help
        return
    }
    
    Write-ColorOutput "=" * 60 "Cyan"
    Write-ColorOutput "  IPO Platform API Testing Automation" "White"
    Write-ColorOutput "=" * 60 "Cyan"
    
    # Check if Newman is installed
    if (-not (Test-NewmanInstalled)) {
        if ($InstallNewman) {
            if (-not (Install-Newman)) {
                Write-ColorOutput "❌ Cannot proceed without Newman" "Red"
                exit 1
            }
        } else {
            Write-ColorOutput "❌ Newman is not installed. Use -InstallNewman to install it." "Red"
            exit 1
        }
    }
    
    # Check required files
    if (-not (Test-RequiredFiles)) {
        Write-ColorOutput "❌ Cannot proceed without required files" "Red"
        exit 1
    }
    
    # Create reports directory if needed
    if ($GenerateReports) {
        New-ReportsDirectory
    }
    
    # Execute tests
    $success = Invoke-TestExecution -Environment $Environment -Iterations $Iterations -Delay $Delay -GenerateReports $GenerateReports
    
    if ($success) {
        Show-TestSummary
        Show-NextSteps
        Write-ColorOutput "`n🎉 Testing Complete!" "Green"
    } else {
        Write-ColorOutput "`n❌ Testing Failed" "Red"
        exit 1
    }
}

# Execute main function
Main 