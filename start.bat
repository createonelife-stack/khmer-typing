@echo off
setlocal
cd /d %~dp0

echo ==============================================
echo  Khmer Typing Master - ចាប់ផ្តើមកម្មវិធី
echo ==============================================

echo.
echo [1/2] កំពុងបើក Backend...
start "Khmer Typing - Backend (kom bit)" cmd /k "cd /d %~dp0backend && if not exist node_modules npm install && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] កំពុងបើក Frontend...
start "Khmer Typing - Frontend (kom bit)" cmd /k "cd /d %~dp0frontend && if not exist node_modules npm install && npm run dev"

echo.
echo ចាំបន្តិច រួចមើលបង្អួច Frontend សម្រាប់តំណភ្ជាប់ (ធម្មតាជា http://localhost:5173)
echo បើកតំណនោះក្នុង browser របស់អ្នក។
echo.
echo ចុច key ណាមួយ ដើម្បីបិទបង្អួចនេះ (backend/frontend នៅតែដំណើរការក្នុងបង្អួចដាច់ដោយឡែក)
pause >nul
