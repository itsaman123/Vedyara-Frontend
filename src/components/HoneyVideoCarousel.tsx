import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiFilm, FiPlay } from "react-icons/fi";
import { useVideos, type Video as ApiVideo } from "../api/videoApi";
import { HoneyVideoCardSkeleton } from "./Skeletons";

/* ─────────────────────────────────────────────────────────────
   Decorative palette — cycles by index so every backend-managed
   video gets a placeholder look without needing design fields.
───────────────────────────────────────────────────────────── */
const PALETTE = [
  { gradient: "linear-gradient(170deg, #7c3200 0%, #b05a00 40%, #d4840a 100%)", accentColor: "#F59E0B", emoji: "🌅" },
  { gradient: "linear-gradient(170deg, #5c1a00 0%, #922d00 45%, #c04a00 100%)", accentColor: "#D4AF37", emoji: "🛡️" },
  { gradient: "linear-gradient(170deg, #3d2000 0%, #7a4500 45%, #b06a00 100%)", accentColor: "#E8C84A", emoji: "🍯" },
  { gradient: "linear-gradient(170deg, #4a1a00 0%, #803000 45%, #b55000 100%)", accentColor: "#D4AF37", emoji: "✨" },
  { gradient: "linear-gradient(170deg, #1a2e10 0%, #2d4a1e 50%, #3d6b2a 100%)", accentColor: "#6B8E23", emoji: "🌿" },
];

/* ─────────────────────────────────────────────────────────────
   YouTube IFrame API — loaded once, lazily, only if a YouTube
   video is actually played (so we don't fetch it for nothing).
───────────────────────────────────────────────────────────── */
type YTPlayer = { destroy?: () => void };
type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: { events: { onStateChange: (e: { data: number }) => void } },
  ) => YTPlayer;
  PlayerState: { ENDED: number };
};
type YTWindow = Window & {
  YT?: YTNamespace;
  onYouTubeIframeAPIReady?: () => void;
};

let ytApiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  const w = window as YTWindow;
  if (w.YT?.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const prevCallback = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      prevCallback?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return ytApiPromise;
}

/* ─────────────────────────────────────────────────────────────
   SINGLE VIDEO CARD (9:16 portrait)
───────────────────────────────────────────────────────────── */
function VideoCard({
  item,
  palette,
  isActive,
  onEnded,
}: {
  item: ApiVideo;
  palette: (typeof PALETTE)[0];
  isActive: boolean;
  onEnded: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasVideo = Boolean(item.ytId || item.videoSrc);
  // Only actually shows/plays while this slide is the one in view —
  // scrolling away hides it without needing an effect to reset state.
  const showPlaying = isActive && playing;

  // Wire the YouTube IFrame API's onStateChange -> auto-advance on end
  useEffect(() => {
    if (!showPlaying || !item.ytId) return;
    let cancelled = false;
    let player: YTPlayer | null = null;

    loadYouTubeApi().then(() => {
      if (cancelled || !iframeRef.current) return;
      const YT = (window as YTWindow).YT!;
      player = new YT.Player(iframeRef.current, {
        events: {
          onStateChange: (e: { data: number }) => {
            if (e.data === YT.PlayerState.ENDED) onEnded();
          },
        },
      });
    });

    return () => {
      cancelled = true;
      player?.destroy?.();
    };
  }, [showPlaying, item.ytId, onEnded]);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden select-none bg-black">
      {item.ytId && showPlaying ? (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube-nocookie.com/embed/${item.ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
          title={item.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : item.videoSrc && showPlaying ? (
        <video
          src={item.videoSrc}
          poster={item.thumbnail || undefined}
          autoPlay
          playsInline
          controls
          onEnded={onEnded}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        /* ── Placeholder card ── */
        <>
          <div className="absolute inset-0" style={{ background: palette.gradient }} />

          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0 34L0 84V66l28 16 28-16v18L28 100z' fill='none' stroke='%23F59E0B' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: "56px 100px",
            }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-5">
            <motion.div
              animate={isActive ? { y: [-4, 4, -4] } : undefined}
              transition={isActive ? { repeat: Infinity, duration: 3, ease: "easeInOut" } : undefined}
              className="relative flex items-center justify-center"
              style={{
                width: 88,
                height: 88,
                background: `radial-gradient(circle, ${palette.accentColor}30 0%, ${palette.accentColor}08 70%)`,
                borderRadius: "50%",
                boxShadow: `0 0 40px ${palette.accentColor}40`,
              }}
            >
              <span style={{ fontSize: 44 }}>{palette.emoji}</span>
            </motion.div>

            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-0.5 rounded-full"
                  style={{ background: palette.accentColor, opacity: 0.4 }}
                  animate={isActive ? { height: [8, 18, 8] } : undefined}
                  transition={isActive ? { repeat: Infinity, duration: 1.5, delay: i * 0.2, ease: "easeInOut" } : undefined}
                />
              ))}
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-10"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: palette.accentColor }}>
              Honey Benefit
            </p>
            <h3 className="font-serif font-bold text-white text-base leading-snug mb-1.5">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-[11px] leading-relaxed text-white/60 line-clamp-3">
                {item.description}
              </p>
            )}
          </div>

          {hasVideo && (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(8px)",
                  border: "2px solid rgba(255,255,255,0.4)",
                }}
              >
                <FiPlay size={22} style={{ color: "#fff", marginLeft: 3 }} />
              </div>
            </button>
          )}

          {!hasVideo && (
            <div
              className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              Video Coming Soon
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CAROUSEL — one video visible at a time; swipe/scroll or use
   the arrows/dots; auto-advances to the next when a video ends.
───────────────────────────────────────────────────────────── */
export default function HoneyVideoCarousel() {
  const { data, isLoading } = useVideos();
  const videos = data ?? [];
  const total = videos.length;

  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollTo = useCallback((idx: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const clamped = Math.max(0, Math.min(total - 1, idx));
    container.scrollTo({ left: clamped * container.clientWidth, behavior: "smooth" });
  }, [total]);

  // Sync activeIdx while the user drags/swipes the track manually
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!scrollRef.current || !scrollRef.current.clientWidth) return;
      const idx = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      setActiveIdx((prev) => (prev === idx ? prev : Math.max(0, Math.min(total - 1, idx))));
    });
  }, [total]);

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  const handleEnded = useCallback(() => {
    scrollTo(activeIdx + 1 >= total ? 0 : activeIdx + 1);
  }, [activeIdx, total, scrollTo]);

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0f0a05 0%, #1a0e04 50%, #0f0a05 100%)" }}
    >
      {/* Ambient honeycomb dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0 34L0 84V66l28 16 28-16v18L28 100z' fill='none' stroke='%23D4AF37' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "56px 100px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "80vw", height: "80vw",
          background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14"
        >
          {/* Hex badge */}
          <div className="inline-flex items-center gap-2 mb-5">
            <div
              className="w-8 h-8 flex items-center justify-center"
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                background: "linear-gradient(135deg, #D4AF37, #e8c84a)",
              }}
            >
              <span style={{ fontSize: 14 }}>🍯</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#D4AF37" }}>
              Honey in Action
            </span>
          </div>

          <h2
            className="font-serif font-bold text-white mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)" }}
          >
            See What Pure Honey{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #D4AF37, #e8c84a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Can Do
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Real use-cases, real benefits — how Vedyara Multi Flora Honey transforms everyday wellness moments.
          </p>
        </motion.div>

        {/* Carousel track — single slide visible at a time */}
        <div className="relative max-w-[380px] sm:max-w-[420px] mx-auto">
          {total > 1 && (
            <>
              <button
                onClick={() => scrollTo(activeIdx - 1)}
                disabled={activeIdx === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 z-20 w-11 h-11 rounded-full items-center justify-center transition-all duration-200 disabled:opacity-20 hidden md:flex"
                style={{
                  background: "rgba(212,175,55,0.12)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  color: "#D4AF37",
                }}
              >
                <FiChevronLeft size={20} />
              </button>

              <button
                onClick={() => scrollTo(activeIdx + 1)}
                disabled={activeIdx >= total - 1}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 z-20 w-11 h-11 rounded-full items-center justify-center transition-all duration-200 disabled:opacity-20 hidden md:flex"
                style={{
                  background: "rgba(212,175,55,0.12)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  color: "#D4AF37",
                }}
              >
                <FiChevronRight size={20} />
              </button>
            </>
          )}

          {isLoading ? (
            <div style={{ aspectRatio: "9 / 16" }}>
              <HoneyVideoCardSkeleton />
            </div>
          ) : total === 0 ? (
            <div
              className="flex flex-col items-center justify-center text-center gap-3 rounded-3xl px-6"
              style={{ aspectRatio: "9 / 16", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.15)" }}
            >
              <FiFilm size={28} style={{ color: "rgba(212,175,55,0.4)" }} />
              <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
                Videos coming soon
              </p>
            </div>
          ) : (
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto"
              style={{
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                aspectRatio: "9 / 16",
              }}
            >
              {videos.map((v, i) => (
                <div
                  key={v._id}
                  className="flex-shrink-0 w-full h-full"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <VideoCard
                    item={v}
                    palette={PALETTE[i % PALETTE.length]}
                    isActive={i === activeIdx}
                    onEnded={handleEnded}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dot indicators */}
        {total > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: activeIdx === i ? 28 : 8,
                  height: 8,
                  background: activeIdx === i
                    ? "linear-gradient(90deg, #D4AF37, #e8c84a)"
                    : "rgba(212,175,55,0.25)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
