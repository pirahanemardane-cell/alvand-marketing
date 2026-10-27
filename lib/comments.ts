/** جلوگیری از لینک در نظرات */
const LINK_PATTERN =
  /(?:https?:\/\/|www\.|t\.me\/|telegram\.me\/|bit\.ly\/|instagram\.com\/|linkedin\.com\/|@\w+\.\w+|[\w.-]+\.(?:com|ir|org|net|io|co|me|info|app)\b)/i;

export function containsLink(text: string): boolean {
  return LINK_PATTERN.test(text);
}

export function sanitizeCommentBody(text: string): string {
  return text.trim().replace(/\s+/g, " ").slice(0, 1000);
}
