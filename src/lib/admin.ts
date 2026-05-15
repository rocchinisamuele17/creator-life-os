export const ADMIN_EMAILS = [
  "liveprodigi@gmail.com",
  "rocchinisamuele17@gmail.com"
];

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}
