$body = '{"email":"admin@demo.com","password":"Demo@123456"}'
$uri = "https://mfouxdfxmgeuyvxgfzef.supabase.co/auth/v1/token?grant_type=password"
$headers = @{
    "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mb3V4ZGZ4bWdldXl2eGdmemVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMDEzNzEsImV4cCI6MjA4NjU3NzM3MX0.OnfpWx1VSBJVlaPwUm34C0qfitYr0pLX7rilYZolrLg"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri $uri -Method POST -Body $body -Headers $headers
    Write-Host "SUCCESS!"
    Write-Host "Access Token: $($response.access_token.Substring(0, 50))..."
    Write-Host "User Email: $($response.user.email)"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)"
    }
}
