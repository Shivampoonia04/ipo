@echo off
echo 🚀 Running Git Update Commands Automatically...
echo ===============================================

cd ipo-platform
echo 📁 Changed to ipo-platform directory

git add .
echo 📁 Added all files to git

git commit -m "feat: Complete project update with Postman API testing suite - 100%% COMPLETED"
echo 💾 Committed all changes

git push origin main
echo 🚀 Pushed to remote repository

echo ===============================================
echo ✅ Git update completed successfully!
echo 🎉 Your project is now updated on git!
pause 