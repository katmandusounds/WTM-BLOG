# IFUNO — UK Music Release Tracker

Static Next.js 13 site that showcases the latest UK rap, drill, grime, and underground releases. The home page reads from a static `public/data.json` feed, groups tracks by release date, and renders a grid of cards with a modal video player. Extra sections include an about page, a coming-soon shop, a password-gated “Leak” view, and a tech blog entry.

## Stack
- Next.js 13 (App Router) + React 18 + TypeScript
- Tailwind CSS with shadcn/ui primitives and Lucide icons
- Static export (`output: 'export'`) for CDN/Netlify/Vercel static hosting

## Project Structure
- `app/` — App Router pages (`page.tsx` home, `about`, `shop`, `tech`)
- `components/` — Feature components (`MusicGrid`, `VideoModal`) plus shadcn/ui primitives in `components/ui/`
- `public/data.json` — Dated music feed consumed by the home page (`/data.json`)
- `next.config.js` — Enables static export, trailing slashes, unoptimized images, prod asset prefix
- `tailwind.config.ts` / `app/globals.css` — Theme, tokens, and global styles

## Local Setup
```bash
# Node 18+ recommended
npm install
npm run dev
# visit http://localhost:3000
```

## Data Model
- `public/data.json` is keyed by ISO date (`YYYY-MM-DD`) with arrays of items:
  - `source` (`youtube`), `title`, `thumbnail_url`, `embed_url`, `published_at`, `video_url`, `track_title_clean`
- Home and Tech pages are fully static; no environment variables are required.

## Build & Deploy
- `npm run build` produces a static `out/` directory (because `output: 'export'`).
- Host the `out/` folder on any static host (S3 + CDN, Netlify, Vercel static, etc.).
- `npm run start` is not used with static export; serve `out/` instead.

## Notable Features
- Paginated release list by date with modal YouTube player
- Password-gated “Leak” section (default password `123456`; adjust in `app/page.tsx`)
- Coming-soon shop + about page with hero video background and neon styling
- Tech blog page with an example long-form post (all content inline)
- Planned: per-video static detail pages (e.g., `/video/{slug}`) with canonical/OG/schema for better SEO. Cards on the home page would link to these pages; sitemap would list them.
- Planned: analytics/pixels (GA4, Meta, TikTok) with event tracking (pageviews, video opens/plays, outbound clicks) and aggregates like top videos/active users.
- Planned: add Spotify artist profile IDs in the sheet and use Spotify API to build daily/weekly popularity charts alongside YouTube releases.
- Planned: Spotify user login with “Save to Spotify” and optional “Add chart as playlist” actions using OAuth scopes (`user-library-modify`, playlist modify).
- Moderation tools: `public/blacklist.json` to drop items (video/embed URLs) and `public/overrides.json` to tweak fields per item; applied client-side on load.
- Spotify enrichment template: `public/data.spotify-template.json` shows how to extend each item with `spotify_track_id`, `spotify_url`, and `spotify_artist_id` for use with the n8n pipeline.
- Data source override: set `NEXT_PUBLIC_DATA_URL` in `.env.local` to point to a remote `data.json` (e.g., your deployed domain or raw GitHub) so local dev always reads the live feed.

## Data Ingest (n8n + Google Sheets)
- Google Sheet (`sheetId: 1yRL42nDT2U0i268t1ZuiAJGNDjIxexD57wMfM05corQ`, `Sheet1!A:C`) with a column `Youtube Account` holding channel IDs.
- n8n cron (hourly, minute 59) reads the sheet, fetches each channel’s RSS feed, drops Shorts, keeps the last 6 months, and filters for music-video-ish titles (music video/official/visualiser/lyric/topic).
- Dedupes variations by priority (official video > visualiser > lyric > topic/audio), then builds `public/data.json` grouped by `YYYY-MM-DD` with `source`, `title`, `thumbnail_url`, `embed_url`, `published_at`, `video_url`, `track_title_clean`.
- Workflow pushes updates to GitHub at `public/data.json` (`katmandusounds/WTM-BLOG`, commit “Update music-videos.json with latest data”). Keep this context handy when updating feeds or changing the sheet layout.
