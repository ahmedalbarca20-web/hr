$body = '{"email":"superadmin@hr-demo.local","password":"LocalHr#2026!Alpha"}'
Invoke-RestMethod -Uri 'http://localhost:3114/api/auth/login' -Method Post -Body $body -ContentType 'application/json'
