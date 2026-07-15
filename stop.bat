@echo off
echo កំពុងបិទ Khmer Typing servers (port 4000 និង 5173)...

for /f "tokens=5" %%p in ('netstat -ano ^| findstr :4000 ^| findstr LISTENING') do (
  taskkill /PID %%p /F >nul 2>&1
)
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
  taskkill /PID %%p /F >nul 2>&1
)

echo បានបិទរួចរាល់។
pause
