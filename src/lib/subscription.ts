export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isDuplicateSubscriptionError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  const code = typeof error === "object" && error !== null && "code" in error ? String((error as { code?: string }).code ?? "") : "";

  return code === "23505" || /duplicate|already subscribed|unique/i.test(message);
}

export function buildSubscribeErrorMessage(error: unknown) {
  if (isDuplicateSubscriptionError(error)) {
    return "You're already subscribed!";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while subscribing.";
}
