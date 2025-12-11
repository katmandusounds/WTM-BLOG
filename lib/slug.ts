const normalize = (value?: string) =>
  (value || 'item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';

const extractVideoId = (embedUrl?: string, videoUrl?: string) => {
  const url = videoUrl || embedUrl || '';
  if (url.includes('watch?v=')) {
    return url.split('watch?v=')[1].split('&')[0];
  }
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1].split(/[?&]/)[0];
  }
  if (url.includes('/embed/')) {
    return url.split('/embed/')[1].split(/[?&]/)[0];
  }
  return '';
};

export const slugForItem = (item: { artist?: string; title?: string; embed_url?: string; video_url?: string }) => {
  const id = extractVideoId(item.embed_url, item.video_url);
  const base = `${normalize(item.artist)}-${normalize(item.title)}`;
  return id ? `${base}-${id}` : base;
};
