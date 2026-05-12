"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ASSETS } from "@/lib/data";
import { UPLOADS } from "@/lib/customerApi";

interface Slide { id: number; image: string; label: string; cta: string; href: string; }

const STATIC_SLIDES: Slide[] = [
  { id: 1, image: ASSETS.heroBanner,    label: "New Balance Footwear",       cta: "Shop Now", href: "/cricket/shoes" },
  { id: 2, image: ASSETS.secondBanner,  label: "Gray-Nicolls Cricket Bats",  cta: "Shop Now", href: "/cricket/bats" },
  { id: 3, image: ASSETS.thirdBanner,   label: "Premium Batting Gloves",     cta: "Shop Now", href: "/cricket/batting-equipment" },
];

const AUTOPLAY_INTERVAL = 4500;

export default function HeroBanner() {
  const [slides, setSlides] = useState<Slide[]>(STATIC_SLIDES);
  const [current, setCurrent]     = useState(0);
  const [previous, setPrevious]   = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused]   = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`)
      .then((r) => r.json())
      .then((banners: { id: number; image: string; title: string; link: string }[]) => {
        if (banners?.length) {
          setSlides(banners.map((b) => ({
            id: b.id,
            image: `${UPLOADS}${b.image}`,
            label: b.title || "Shop Now",
            cta: "Shop Now",
            href: b.link || "/products",
          })));
          setCurrent(0);
        }
      })
      .catch(() => {});
  }, []);

  const goTo = useCallback(
    (index: number, dir: "next" | "prev" = "next") => {
      if (isAnimating) return;
      setDirection(dir);
      setPrevious(current);
      setCurrent(index);
      setIsAnimating(true);
      setTimeout(() => { setPrevious(null); setIsAnimating(false); }, 700);
    },
    [isAnimating, current]
  );

  const next = useCallback(() => goTo((current + 1) % slides.length, "next"), [current, goTo, slides.length]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length, "prev"), [current, goTo, slides.length]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    timerRef.current = setTimeout(next, AUTOPLAY_INTERVAL);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, isPaused, next, slides.length]);

  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };

  const getSlideStyle = (idx: number): React.CSSProperties => {
    if (idx === current) return { transform: "translateX(0)", opacity: 1, zIndex: 2, transition: "transform 700ms cubic-bezier(0.25,0.46,0.45,0.94), opacity 700ms ease" };
    if (idx === previous) return { transform: direction === "next" ? "translateX(-100%)" : "translateX(100%)", opacity: 0, zIndex: 1, transition: "transform 700ms cubic-bezier(0.25,0.46,0.45,0.94), opacity 700ms ease" };
    return { transform: direction === "next" ? "translateX(100%)" : "translateX(-100%)", opacity: 0, zIndex: 0, transition: "none" };
  };

  const slide = slides[current] || STATIC_SLIDES[0];

  return (
    <section className="relative w-full overflow-hidden select-none" style={{ height: `calc(80vh - 40px)` }}
      onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} aria-label="Hero banner slider">
      {slides.map((s, idx) => (
        <div key={s.id} className="absolute inset-0" style={getSlideStyle(idx)} aria-hidden={idx !== current}>
          <Image src={s.image} alt={s.label} fill priority={idx === 0} className="object-cover" style={{ objectPosition: "center center" }} sizes="100vw" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.75) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%)" }} />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-12 pb-12 md:pb-16 z-10 pointer-events-none">
        <p key={`label-${current}`} className="text-white text-[13px] md:text-[15px] font-light tracking-[0.04em] mb-4 drop-shadow-md animate-[fadeSlideUp_0.6s_ease_forwards]">{slide.label}</p>
        <Link href={slide.href} key={`cta-${current}`} className="pointer-events-auto inline-flex items-center justify-center px-7 py-3 rounded-full bg-white/20 backdrop-blur-[8px] border border-white/50 text-white text-[11px] md:text-[12px] font-semibold tracking-[0.12em] uppercase w-fit hover:bg-white hover:text-[#1e1e21] transition-all duration-300 ease-out drop-shadow-lg animate-[fadeSlideUp_0.7s_0.1s_ease_forwards] opacity-0" style={{ animationFillMode: "forwards" }}>{slide.cta}</Link>
      </div>

      {/* <button onClick={prev} aria-label="Previous slide" className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-[6px] border border-white/20 flex items-center justify-center text-white hover:bg-black/60 hover:border-white/50 transition-all duration-200" style={{ opacity: isPaused ? 1 : undefined }}>
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={next} aria-label="Next slide" className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-[6px] border border-white/20 flex items-center justify-center text-white hover:bg-black/60 hover:border-white/50 transition-all duration-200">
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button> */}

      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button key={idx} onClick={() => goTo(idx, idx > current ? "next" : "prev")} aria-label={`Go to slide ${idx + 1}`} className="relative overflow-hidden rounded-full transition-all duration-400" style={{ width: idx === current ? "28px" : "8px", height: "8px", background: idx === current ? "#f69a39" : "rgba(255,255,255,0.45)" }}>
              {idx === current && !isPaused && <span className="absolute inset-y-0 left-0 bg-white/40 rounded-full" style={{ animation: `slideProgress ${AUTOPLAY_INTERVAL}ms linear forwards` }} />}
            </button>
          ))}
        </div>
      )}

      {/* <div className="absolute top-4 right-4 md:top-5 md:right-6 z-20 text-white/60 text-[11px] font-mono tracking-[0.1em] bg-black/25 backdrop-blur-[4px] px-2.5 py-1 rounded-full">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div> */}

      <button onClick={() => setIsPaused((p) => !p)} aria-label={isPaused ? "Play" : "Pause"} className="absolute bottom-5 right-5 md:right-6 z-20 w-8 h-8 rounded-full bg-black/30 backdrop-blur-[6px] border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 transition-all duration-200">
        {isPaused
          ? <svg className="w-3 h-3 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          : <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
        }
      </button>

      <style>{`
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideProgress { from { width:0%; } to { width:100%; } }
      `}</style>
    </section>
  );
}
