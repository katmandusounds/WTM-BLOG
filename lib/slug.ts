export function generateSlug(artist: string, title: string, publishedAt: string): string {
  const year = new Date(publishedAt).getFullYear();
  const cleanTitle = title.replace(/^-\s*/, '').trim();
  return `${artist}-${cleanTitle}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}