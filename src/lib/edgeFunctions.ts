export function buildEdgeFunctionErrorMessage(functionName: string, message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("failed to send a request") || normalized.includes("fetch failed")) {
    return [
      `Unable to reach the Supabase Edge Function "${functionName}".`,
      "This usually means the function is not deployed, the project URL is incorrect, or the request is blocked by network/CORS settings.",
      "Please verify that the function is deployed in your Supabase project and that the environment variables are configured correctly.",
      "Also confirm that the function has access to the GNEWS_API_KEY and SUPABASE_SERVICE_ROLE_KEY secrets."
    ].join(" ");
  }

  if (normalized.includes("gnews_api_key") || normalized.includes("service_role_key")) {
    return [
      `The Edge Function "${functionName}" is reachable but missing required secrets.`,
      "Set the GNEWS_API_KEY and SUPABASE_SERVICE_ROLE_KEY environment variables in your Supabase project settings."
    ].join(" ");
  }

  return message;
}
