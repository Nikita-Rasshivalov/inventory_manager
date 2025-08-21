export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export const isEmpty = (value: string | null | undefined): boolean => {
  return value == null || value === "";
};

export const isNullOrEmpty = (value: string | null | undefined): boolean => {
  return value == null || value === "" || value.trim() === "";
};
