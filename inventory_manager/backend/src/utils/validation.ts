export function isNonEmptyString(value: any): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidEmail(email: any): boolean {
  if (typeof email !== "string") return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isValidStatus(status: any): boolean {
  return status === 0 || status === 1 || status === 2;
}
