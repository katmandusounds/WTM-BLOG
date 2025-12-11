# Product Requirements Document (PRD)
# IFUNO — UK Music Release Tracker

**Version:** 0.1 (Draft)  
**Last Updated:** Feb 2025  
**Status:** Planning  
**Owner:** Product/Eng (IFUNO)

---

## Executive Summary

### Product Overview
IFUNO is a static Next.js site that surfaces the latest UK rap, drill, grime, and underground releases. Data is fetched hourly from YouTube channel RSS feeds defined in a Google Sheet and rendered as date-grouped grids with inline video playback. The goal of this PRD is to harden data ingest, improve browsing performance, and add basic observability/QA so the site stays fresh without manual babysitting.

### Problem Statement
- Data freshness is fragile: a broken sheet row or RSS fetch can silently remove releases.
- Duplicates/low-quality items can slip in when titles are messy.
- Failures in n8n/GitHub push are invisible until a user notices.
- The frontend is static; there’s no surfaced metadata about last update or counts.
- No lightweight moderation tools for quick fixes when an item is wrong.

### Proposed Solution
1. Make ingest resilient (validation, retries, alerts) and keep historical backups.
2. Improve data quality (stronger filters, dedupe, blacklist/whitelist).
3. Expose freshness and counts to users and operators.
4. Add a simple moderation layer for hotfixes without redeploying the pipeline.
5. Ship lightweight analytics and SEO/accessibility improvements to keep organic traffic healthy.

---

## Objectives & Success Metrics
- **Freshness:** 95% of hourly runs succeed; data updated in <90 minutes of YouTube publish for eligible channels.
- **Quality:** <2% duplicate/irrelevant entries per week (sampled manually).
- **Robustness:** Zero data loss incidents; ability to roll back to any of the last 7 days of feeds.
- **Observability:** Alert sent on any failed run or GitHub push; daily run report delivered.
- **UX:** Home page largest contentful paint (LCP) <2.5s on 4G; clear “Last updated” indicator.

---

## Scope
**In Scope**
- n8n workflow hardening (validation, retries, alerts, backups).
- Data quality rules (dedupe, heuristics, blacklist).
- Frontend freshness indicators and pagination performance.
- Basic moderation hooks (manual overrides without changing the sheet).
- SEO/accessibility and lightweight analytics.

**Out of Scope**
- Adding new data providers beyond YouTube RSS.
- Full CMS or user accounts.
- Payment/commerce (shop remains “coming soon”).

---

## Users & Use Cases
- **Fans:** Check today’s releases quickly; trust that data is current and not spammy.
- **Curators/Operators:** Add/edit channels; review run health; hotfix bad items fast.
- **Search/SEO:** Pages are discoverable, fast, and have valid metadata.

Key jobs to be done:
- “Show me what dropped today with playable embeds.”
- “Ensure the feed didn’t break overnight; if it did, fix it in minutes.”
- “Remove/replace a bad entry without redeploying the whole site.”

---

## Requirements

### 1) Data Ingest Robustness
- **Validation on read:** Reject sheet rows missing `Youtube Account` or malformed IDs; log and continue.
- **Per-channel retries:** 3 retries with backoff on RSS fetch; skip, don’t fail the whole run.
- **Run health metrics:** Track counts: channels attempted, successes, failures, items collected, items filtered.
- **Alerts:** On failure (ingest or GitHub push), send an email/webhook (e.g., to Slack/Discord) with run summary.
- **Backups:** After each successful run, store `data.json` snapshot with timestamp (keep 7 days) to a backups branch or S3 bucket.
- **Time window:** Keep current 6-month window; make window configurable in one place.

### 2) Data Quality
- **Heuristics:** Strengthen allow-list terms (music video, official, visualiser, lyric) and keep Shorts exclusion.
- **Dedupe:** Keep highest-priority variant per track (official > visualiser > lyric > topic/audio).
- **Blacklist/override:** Support a small static blacklist of video IDs/titles and a whitelist to force-include edge cases.
- **Normalization:** Trim/clean `track_title_clean` consistently (strip brackets/parentheses, normalize case).

### 3) Frontend Freshness & UX
- **Last updated badge:** Display the last successful ingest timestamp (from `data.json` header or separate meta file).
- **Item counts:** Show count of releases on the current page/date.
- **Pagination performance:** Ensure client paging doesn’t re-fetch; pre-sort server-side (already static export) and lazy-render long lists if needed.
- **Error fallback:** If `data.json` is missing/corrupt, show a friendly error and fallback message instead of a blank screen.

### 4) Moderation & Hotfixes
- **Manual overrides file:** Support a `public/overrides.json` that can remove or replace specific items by video ID or date+title, merged at build time or client load.
- **Blacklist file:** `public/blacklist.json` checked in by operators; pipeline respects it to drop items.
- **Dry-run mode:** n8n dry-run that produces a report without pushing to GitHub.

### 5) Observability & Reporting
- **Run report:** Daily summary (success/fail, counts) delivered to an email/webhook.
- **Logging:** Persist minimal logs for last 20 runs (status, failures, counts).
- **Heartbeat:** Simple uptime check for the static site (HTTP 200 on `/`) with alert if down.

### 6) SEO, Performance, Accessibility
- **Metadata:** Ensure canonical, OG, Twitter tags are accurate and domain-specific.
- **Images:** Keep unoptimized images but consider fixed aspect ratios to avoid CLS.
- **Accessibility:** Keyboard navigation for modal; focus trap; aria labels on buttons; color contrast check for neon palette.
- **Analytics:** Lightweight privacy-friendly pageview tracking (e.g., Plausible/Umami) to monitor traffic.

### 7) Per-Video SEO Pages
- **Static detail pages:** Generate a dedicated static page per video (e.g., `/video/{slug}`) during export using `data.json`.
- **Slug & canonical:** Stable slug from title + video ID; set canonical, OG, Twitter tags per page.
- **Schema markup:** Add `VideoObject` schema with publish date, thumbnail, embed URL, duration if available.
- **Internal linking:** Link cards on the home page to their detail pages; add breadcrumbs/back-to-list.
- **Sitemap:** Include per-video URLs in the sitemap to improve indexation.

### 8) Instrumentation & Audience Tracking
- **Pixels:** Support GA4, Meta Pixel, and TikTok Pixel snippets (opt-in via env/config) loaded once with consent banner.
- **Events:** Track pageviews, video modal opens/plays, outbound clicks (YouTube/Spotify), section nav, and leak unlocks.
- **Dashboards:** Basic aggregates: top videos by views, clicks, and watch attempts; current online users if available from analytics provider.
- **Retargeting readiness:** Ensure pixel IDs configurable without code changes; document where to inject in layout.

### 9) AI-Assisted SEO Content
- **Topic pages:** Generate/update SEO landing pages for high-intent queries (e.g., “UK underground music”, “biggest UK drill artist”, “UK rap trends”) sourced from current data.
- **Summaries/snippets:** Per-video short summaries and entity extraction (artist, tags, location) to enrich per-video pages and internal linking.
- **FAQ blocks:** Auto-generate FAQ schema for key topics; review before publish.
- **Keywords & interlinking:** Dynamically inject related links between videos, topic pages, and blog content to strengthen coverage.
- **Governance:** Human approval before publishing AI-generated copy; store generated content separately from raw data.json.

### 10) Spotify User Login & Save Actions
- **Auth:** Implement Spotify Authorization Code Flow (PKCE if browser) for “Log in with Spotify”; store access/refresh tokens server-side keyed to session.
- **Scopes:** Start with `user-library-modify`, optionally `playlist-modify-public`/`playlist-modify-private`, `user-read-email`, `user-read-private`.
- **Actions:** On charts/per-video pages, render “Save to Spotify” to add tracks to a user’s Liked Songs (`PUT /v1/me/tracks`). Optional “Add to playlist” (choose existing or create weekly chart playlist and fill it).
- **Session refresh:** Auto-refresh access tokens when expired using refresh_token.
- **UI:** Show connected state (user id/email); prompt login if unauthenticated. Provide “Save this chart as a playlist” that creates a playlist and inserts tracks in rank order.

---

## Non-Functional Requirements
- **Reliability:** Ingest runs hourly; failures alert within 10 minutes; auto-recovery next run.
- **Performance:** LCP <2.5s on mid-tier mobile; JSON payload kept lean (6 months of data).
- **Security:** No secret keys on frontend; GitHub token scoped to repo file writes only.
- **Maintainability:** All config (sheet ID, time window, priority lists) lives in a single config node/file.

---

## Milestones & Phasing
- **Phase 1 (Hardening):** Validation, retries, alerts, run metrics, backups, blacklist/whitelist, stronger dedupe/filters.
- **Phase 2 (UX/Moderation):** Last-updated badge, counts, error fallback, overrides/blacklist files consumption in frontend, dry-run mode; pixel/analytics injection and event tracking.
- **Phase 3 (SEO/Perf/Obs):** Per-video detail pages + sitemap, accessibility fixes, CLS/LCP tuning, daily reports, heartbeat monitor; dashboard for top videos/active users; initial AI-assisted topic/FAQ content.

---

## Open Questions
- Preferred alert channel (email vs Slack/Discord webhook)?
- Where to store backups (GitHub branch vs S3/Spaces)?
- Is 6 months the right window, or should we cap by item count instead?
- Do we need manual curation for the “Leak” section, or keep it static?
- Which domain/canonical URL should be set for production?
- Do we want per-video pages to include related videos and tags for better internal linking?
- Which analytics provider for “live users” (GA4, Plausible, Meta/TikTok pixels)?
- Which AI model/provider and review flow for generated SEO copy?
- Any constraints on Spotify scopes (liked songs vs playlist creation) or persistence model for tokens?

---

## IFUNO — Master System Specification (Summary)
High-level system to extend IFUNO beyond the static site into a multi-platform music intelligence pipeline.

**Artist Database**
- Core fields: name, Spotify Artist ID/profile URL; optional YouTube channel ID, Deezer/Apple/Amazon IDs; follower count; discovery source; tier/segment; approval status.
- Ingest via manual entry, Spotify search, or related-artists (filtered by followers/genre/tier).

**Multi-Platform Release Detection**
- Spotify: fetch latest albums/singles, release date, track metadata, album art, track popularity, artist follower count; daily job writes “Day Folder.”
- YouTube: new uploads for tracked channels; title/thumbnail/publish date/views/engagement.
- Deezer: new releases using `rank` as popularity metric.
- Apple/Amazon: metadata only (no public popularity); mainly destinations.

**Promotional Image Generation**
- For each new song, create 9:16 vertical asset (album art center, top “ARTIST – TRACK”, bottom “OUT NOW”) via Bannerbear/Cloudinary/custom. Store under `/drops/YYYY-MM-DD/` for manual upload to Shorts/Reels/TikTok.

**Weekly Charts (Percentile-Based)**
- Collect weekly releases; pick popularity metric (Spotify popularity, YouTube engagement, Deezer rank).
- Sort DESC and assign percentile = (rank/total)*100, map to Diamond/Platinum/Gold/Silver bands; scales to any volume.

**Weekly Spotify Playlists**
- Create playlists per band (“IFUNO Diamond – Week X”, etc.) with ranked tracks; requires Spotify user token (Authorization Code Flow).

**Storage & Rates**
- Data footprint minimal (~2–5 MB/week for ~10k artists); API rate limits are the constraint—use batching/backoff/cron spreading.

**Known API Gaps (Spotify)**
- No monthly listeners/stream counts/artist popularity score; use track popularity, followers, and average top-track popularity instead.

**Discovery via Related Artists**
- For each artist, fetch related artists; filter by followers/genre/not in DB; add with discovery_source=related_artist and depth level; optional human approval.

**Search**
- Spotify Search API for artist name → id, followers, URL; add to DB.

**System Goals**
- Automate tracking for underground/emerging artists; detect daily releases; build weekly percentile charts; generate playlists/promos; grow catalog via related-artists; keep lightweight and automation-friendly.
