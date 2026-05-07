New-NetFirewallRule -DisplayName "NestJS App Port 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
Write-Host "Firewall rule added successfully! You can now access the app from other devices."
Pause
