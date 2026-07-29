param(
  [Parameter(Mandatory=$true)]
  [string]$Token,
  [string]$ProjectRef = "nzrogsblvvbiowhdpjab"
)

$ErrorActionPreference = 'Stop'

npx supabase login --token $Token --no-browser | Out-Null
npx supabase link --project-ref $ProjectRef
npx supabase functions deploy fetch-news --project-ref $ProjectRef
