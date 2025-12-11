import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Home as HomeIcon, Lock, ShoppingBag, Info } from 'lucide-react';
import { slugForItem } from '@/lib/slug';

type MusicItem = {
  source?: string;
  title?: string;
  artist?: string;
  thumbnail_url?: string;
  embed_url?: string;
  video_url?: string;
  track_title_clean?: string;
  published_at?: string;
  view_count?: string;
};

type MusicData = Record<string, MusicItem[]>;

const DATA_PATH = path.join(process.cwd(), 'public', 'data.json');
const dataUrl = process.env.NEXT_PUBLIC_DATA_URL || '';

const fetchData = async (): Promise<MusicData> => {
  if (dataUrl && dataUrl.startsWith('http')) {
    try {
      const res = await fetch(dataUrl, { cache: 'no-store' });
      if (res.ok) {
        return (await res.json()) as MusicData;
      }
    } catch (err) {
      console.error('Error fetching remote data.json', err);
    }
  }
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw) as MusicData;
  } catch (err) {
    console.error('Error reading local data.json', err);
    return {} as MusicData;
  }
};

const getAllEntries = async (): Promise<Array<{ date: string; item: MusicItem; slug: string }>> => {
  const data = await fetchData();
  const entries: Array<{ date: string; item: MusicItem; slug: string }> = [];
  Object.entries(data).forEach(([date, items]) => {
    (items || []).forEach((item) => {
      entries.push({ date, item, slug: slugForItem(item) });
    });
  });
  return entries;
};

const findBySlug = async (slug: string) => {
  const entries = await getAllEntries();
  return entries.find((entry) => entry.slug === slug) || null;
};

export const generateStaticParams = async () => {
  const entries = await getAllEntries();
  return entries.map(({ slug }) => ({ slug }));
};

export const generateMetadata = async ({ params }: { params: { slug: string } }): Promise<Metadata> => {
  const found = await findBySlug(params.slug);
  if (!found) return {};
  const { item } = found;
  const titleText = `${item.artist || 'Artist'} – ${item.title || 'Track'} | IFUNO`;
  const description = `Watch ${item.artist || 'artist'} - ${item.title || 'track'} on IFUNO. Latest UK rap, drill, grime, and underground releases.`;
  const canonical = `https://ifuno.uk/video/${params.slug}`;

  return {
    title: titleText,
    description,
    alternates: { canonical },
    openGraph: {
      title: titleText,
      description,
      type: 'video.other',
      url: canonical,
      images: item.thumbnail_url ? [{ url: item.thumbnail_url, alt: `${item.artist} - ${item.title}` }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: titleText,
      description,
      images: item.thumbnail_url ? [item.thumbnail_url] : undefined,
    },
  };
};

export default async function VideoDetail({ params }: { params: { slug: string } }) {
  const found = await findBySlug(params.slug);

  if (!found) {
    notFound();
  }

  const { item, date } = found!;
  const displayTitle = item.title || 'Untitled';
  const displayArtist = item.artist || '';
  const publishedDate = item.published_at
    ? new Date(item.published_at).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : date;

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-black/90 border-b border-ifuno-pink/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">
            <div className="flex items-center space-x-6 justify-start">
              <Link
                href="/"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-ifuno-green text-black hover:bg-ifuno-pink hover:text-white transition-all duration-200 text-sm font-medium uppercase"
              >
                <HomeIcon className="w-4 h-4" />
                <span>New</span>
              </Link>
              <Link
                href="/?section=leak"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-ifuno-pink transition-all duration-200 text-sm font-medium uppercase"
              >
                <Lock className="w-4 h-4" />
                <span>Leak</span>
              </Link>
            </div>

            <div className="flex justify-center">
              <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
                <img
                  src="https://ik.imagekit.io/vv1coyjgq/IFUKNO%20large%20gap%202025.png?updatedAt=1751549577754"
                  alt="IFUNO Logo"
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </div>

            <div className="flex items-center space-x-6 justify-end">
              <Link
                href="/shop"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-ifuno-pink transition-all duration-200 text-sm font-medium uppercase"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-ifuno-pink transition-all duration-200 text-sm font-medium uppercase"
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="space-y-1">
          <p className="text-xs text-gray-400 uppercase tracking-wide">IFUNO • UK Releases</p>
          <h1 className="text-3xl sm:text-4xl font-black title-stroke mt-2">{displayTitle}</h1>
          {displayArtist && <p className="text-ifuno-green text-sm mt-1">{displayArtist}</p>}
          <p className="text-gray-400 text-xs mt-1">Published: {publishedDate}</p>
          {item.view_count && (
            <p className="text-gray-400 text-xs mt-1">Views: {item.view_count}</p>
          )}
        </div>

        <div className="bg-black/60 border border-ifuno-pink rounded-2xl overflow-hidden shadow-xl">
          <div className="aspect-video bg-black">
            <iframe
              src={item.embed_url || ''}
              title={`${displayArtist || 'Artist'} - ${displayTitle}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="flex justify-center">
          <details className="w-full max-w-3xl mt-4 text-gray-300 text-xs bg-black/40 border border-ifuno-pink/40 rounded-lg p-3">
            <summary className="cursor-pointer text-ifuno-green text-[11px] font-semibold text-center">
              Platform overview
            </summary>
            <div className="mt-2 space-y-2 text-gray-300 leading-relaxed">
              <p>
                ifuno.uk is a modern hub built for fans of UK Rap, UK Drill, UK Hip-Hop and the wider UK Urban scene. We focus heavily on Underground Rap, Underground Drill, UK Trap and Grime, giving space to both established names and rising underground talent. Our aim is to create a home for the culture, the sound and the artists shaping the UK Scene today.
              </p>
              <p>
                We cover a wide range of music formats, including Official Releases, Clean Versions, Radio Edits, Instrumentals, Acapellas, Remixes, Extended Mixes, Sped Up and Slowed Down edits, Reverb versions, Bass Boosted tracks, Mashups, Freestyles, Cyphers and Dub sessions. This variety ensures listeners can enjoy every version of the tracks they love, in the style they prefer.
              </p>
              <p>
                ifuno.uk stays connected across all major platforms, featuring music and updates linked to YouTube Topic, Spotify, Apple Music, Amazon Music, SoundCloud, Audiomack, TikTok Sound and VEVO. We also highlight content from key UK cultural pillars such as GRM Daily, Mixtape Madness, Link Up TV, PressPlay, SBTV, COLORS, Fumez The Engineer, Plugged In, Daily Duppy, Mad About Bars, HB Freestyle and Blackbox.
              </p>
              <p>
                Visitors can explore everything from Lyrics, Lyric Videos, Visualisers, Music Videos, Official Videos and Performance Videos to Type Beats, Live Performances, Karaoke versions, Reactions, Meaning Explained content and Behind The Scenes footage. We also feature Snippets, Previews, Full Versions, Extended edits, 8D Audio, 3D Audio and HD/4K visuals, giving fans access to every angle of a release.
              </p>
              <p>
                Whether you're looking for New Songs, New Music, New Releases, Trending tracks, Viral tunes, Exclusives or fresh Underground leaks, ifuno.uk offers a clean, organised and culture-focused space dedicated to showcasing the best of the UK sound.
              </p>
            </div>
          </details>
        </div>

        {/* Visually hidden SEO tags */}
        <div className="sr-only">
          {[
            displayArtist,
            displayTitle,
            'instrumental',
            'type beat',
            'cover version',
            'acapella',
            'sped up',
            'slowed down',
            'speed up',
            'slow',
            'clean version',
            'radio edit',
            'spotify release',
            'official release',
            'net video',
            'youtube topic',
            'amazon music',
            'spotify',
            'apple music',
            'itunes',
            'uk rap',
            'uk drill',
            'uk underground',
            'ug underground music',
            'grm daily',
            'bouncer hub',
            'mixtape madness',
            'link up tv',
            'press play',
            'new song',
            'music',
          ]
            .filter(Boolean)
            .join(' ')}
        </div>
      </div>
    </div>
  );
}
