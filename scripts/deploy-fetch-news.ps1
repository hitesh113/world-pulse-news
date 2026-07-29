param(
  [string]$Token,
  [string]$ProjectRef = "nzrogsblvvbiowhdpjab"
)

$ErrorActionPreference = 'Stop'

if (-not $Token) {
  $Token = $env:SUPABASE_ACCESS_TOKEN
}

if (-not $Token) {
  Write-Host "No Supabase access token was provided."
  Write-Host "Create one in the Supabase dashboard at https://supabase.com/dashboard/account/tokens"
  Write-Host "Then run: .\\scripts\\deploy-fetch-news.ps1 -Token YOUR_TOKEN"
  exit 1
}

npx supabase login --token $Token --no-browser | Out-Null
npx supabase link --project-ref $ProjectRef
npx supabase functions deploy fetch-news --project-ref $ProjectRef
