export function createWhatsAppShareLink(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
