# Run Git Commands Automatically
Write-Host "🚀 Running Git Update Commands Automatically..." -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan

# Change to ipo-platform directory
Set-Location ipo-platform
Write-Host "📁 Changed to ipo-platform directory" -ForegroundColor Yellow

# Add all files
git add .
Write-Host "📁 Added all files to git" -ForegroundColor Yellow

# Commit changes
git commit -m "feat: Complete project update with Postman API testing suite - 100% COMPLETED"
Write-Host "💾 Committed all changes" -ForegroundColor Yellow

# Push to remote
git push origin main
Write-Host "🚀 Pushed to remote repository" -ForegroundColor Yellow

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "✅ Git update completed successfully!" -ForegroundColor Green
Write-Host "🎉 Your project is now updated on git!" -ForegroundColor Green

# Show final status
Write-Host "📊 Final git status:" -ForegroundColor Cyan
git status 