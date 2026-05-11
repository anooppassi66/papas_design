"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ASSETS, SPORTS_NAV, CRICKET_NAV } from "@/lib/data";
import { getCart, cartCount, UPLOADS } from "@/lib/customerApi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

// ── Types for mega menu JSON data ─────────────────────────────────────────────
interface MegaLink { label: string; href: string; active?: boolean }
interface MegaCol  { heading?: string; links: MegaLink[] }
interface MegaTab  { sidebar?: MegaLink[]; cols: MegaCol[] }
// v2 format (visual builder)
interface BuilderItem { id: string; label: string; href: string; depth: number }
interface MegaData {
  // v2 (visual builder)
  version?: number;
  items?: BuilderItem[];
  // v1 (legacy JSON)
  tabs?: string[];
  content?: Record<string, MegaTab>;
  sidebar?: MegaLink[];
  cols?: MegaCol[];
}
interface ApiMenuItem { id: number; title: string; slug: string; data: string | MegaData; is_active: boolean; sort_order: number }

interface SearchResult {
  id: number; name: string; slug: string; image: string | null;
  brand_name: string; sell_price: number;
}

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [activeMegaTab, setActiveMegaTab] = useState<Record<string, string>>({});
  const [megaMenus, setMegaMenus] = useState<Record<string, MegaData>>({});
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setSuggestions([]); return; }
    setSearchLoading(true);
    try {
      const res = await fetch(`${API}/customer/products?q=${encodeURIComponent(q.trim())}&limit=6`);
      const data = await res.json();
      setSuggestions(data.products || []);
    } catch { setSuggestions([]); }
    finally { setSearchLoading(false); }
  }, []);

  const handleSearchInput = (val: string, isMobile = false) => {
    if (isMobile) { setMobileSearchQuery(val); setShowMobileSuggestions(true); }
    else { setSearchQuery(val); setShowSuggestions(true); }
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => fetchSuggestions(val), 280);
  };

  const handleSearchSubmit = (q: string) => {
    if (!q.trim()) return;
    setShowSuggestions(false);
    setShowMobileSuggestions(false);
    window.location.href = `/products?q=${encodeURIComponent(q.trim())}`;
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) setShowSuggestions(false);
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) setShowMobileSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Live cart count
  useEffect(() => {
    setCount(cartCount(getCart()));
    const handler = () => setCount(cartCount(getCart()));
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

  // Fetch mega menu from API
  const loadMegaMenu = useCallback(async () => {
    try {
      const res = await fetch(`${API}/mega-menu`);
      const items: ApiMenuItem[] = await res.json();
      const map: Record<string, MegaData> = {};
      for (const item of items) {
        if (!item.is_active) continue;
        const data: MegaData = typeof item.data === "string" ? JSON.parse(item.data) : item.data;
        map[item.title] = data;
      }
      setMegaMenus(map);
    } catch { /* keep empty — no mega dropdowns */ }
  }, []);

  useEffect(() => { loadMegaMenu(); }, [loadMegaMenu]);

  const getTab = (cat: string) => {
    const data = megaMenus[cat];
    return activeMegaTab[cat] ?? (data?.tabs?.[0] ?? "");
  };

  const openMega = (label: string) => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    if (megaMenus[label]) setActiveMega(label);
    else setActiveMega(null);
  };
  const closeMega = () => { megaTimeout.current = setTimeout(() => setActiveMega(null), 160); };
  const stayMega  = () => { if (megaTimeout.current) clearTimeout(megaTimeout.current); };

  return (
    <>
      {/* ── Desktop: Sports Strip ──────────────────────────────────── */}
      <div className="bg-[#1e1e21] hidden md:block">
        <div className="max-w-[1440px] mx-auto px-[42px]">
          <nav className="flex items-center gap-[14px] h-[30px]">
            {SPORTS_NAV.map((item) => (
              <Link key={item.label} href={item.href}
                className={`text-[11px] tracking-[0.525px] uppercase transition-colors whitespace-nowrap ${
                  item.active ? "text-[#f69a39] font-semibold" : "text-[#a5a7a8] font-normal hover:text-white"
                }`}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Main Header ───────────────────────────────────────────── */}
      <header className="bg-black sticky top-0 z-50 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[42px]">
          <div className="flex items-center gap-4 h-[72px] md:h-[80px]">
            {/* Mobile hamburger */}
            <button className="md:hidden flex flex-col gap-[5px] w-6 h-6 justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              <span className={`block h-[2px] bg-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block h-[2px] bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-[2px] bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image src={ASSETS.logo} alt="PAPAS Willow Cricket Store"
                width={337} height={115} className="h-[40px] md:h-[50px] w-auto object-contain" priority />
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 mx-8">
              <div ref={desktopSearchRef} className="relative w-full max-w-[745px]">
                <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(searchQuery); }}>
                  <div className="flex items-center border border-[#dbdbdb] rounded-lg bg-white h-[44px] overflow-hidden">
                    <div className="pl-3 pr-2 flex items-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      onFocus={() => { if (searchQuery.length >= 2) setShowSuggestions(true); }}
                      onKeyDown={(e) => e.key === "Escape" && setShowSuggestions(false)}
                      placeholder="Search for products, brands..."
                      className="flex-1 h-full px-2 text-[14px] text-gray-700 outline-none bg-transparent"
                      autoComplete="off"
                    />
                    {searchLoading && (
                      <div className="px-3">
                        <div className="w-4 h-4 border-2 border-[#f69a39] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <button type="submit" className="h-full px-4 bg-[#f69a39] text-white text-sm font-medium hover:bg-[#e8880d] transition-colors flex-shrink-0">
                      Search
                    </button>
                  </div>
                </form>

                {/* Suggestions dropdown */}
                {showSuggestions && searchQuery.trim().length >= 2 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-[#e5e5e5] z-[200] overflow-hidden">
                    {suggestions.length > 0 ? (
                      <>
                        <div className="py-1">
                          {suggestions.map((p) => {
                            const imgSrc = p.image ? (p.image.startsWith("/uploads/") ? `${UPLOADS}${p.image}` : p.image) : null;
                            return (
                              <Link
                                key={p.id}
                                href={`/products/${p.slug}`}
                                onClick={() => { setShowSuggestions(false); setSearchQuery(""); }}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#fff8f0] transition-colors group"
                              >
                                <div className="w-11 h-11 flex-shrink-0 rounded-[4px] overflow-hidden bg-[#f5f5f5] border border-[#eee]">
                                  {imgSrc
                                    ? <Image src={imgSrc} alt={p.name} width={44} height={44} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center text-lg">🏏</div>
                                  }
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] font-medium text-[#1e1e21] truncate group-hover:text-[#f69a39] transition-colors">{p.name}</p>
                                  <p className="text-[11px] text-[#999]">{p.brand_name}</p>
                                </div>
                                <p className="text-[13px] font-semibold text-[#f69a39] flex-shrink-0">${Number(p.sell_price || 0).toFixed(2)}</p>
                              </Link>
                            );
                          })}
                        </div>
                        <div className="border-t border-[#f0f0f0]">
                          <Link
                            href={`/products?q=${encodeURIComponent(searchQuery.trim())}`}
                            onClick={() => { setShowSuggestions(false); setSearchQuery(""); }}
                            className="flex items-center justify-between px-4 py-3 bg-[#fafafa] hover:bg-[#fff8f0] transition-colors"
                          >
                            <span className="text-[12px] text-[#555]">View all results for <span className="font-semibold text-[#1e1e21]">&ldquo;{searchQuery}&rdquo;</span></span>
                            <svg className="w-4 h-4 text-[#f69a39]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                          </Link>
                        </div>
                      </>
                    ) : !searchLoading ? (
                      <div className="px-4 py-5 text-center">
                        <p className="text-[13px] text-[#888]">No results for <span className="font-semibold text-[#1e1e21]">&ldquo;{searchQuery}&rdquo;</span></p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1 ml-auto">
              <button className="md:hidden p-2 text-white hover:text-[#f69a39] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <Link href="/account" className="p-2 text-white hover:text-[#f69a39] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link href="/wishlist" className="p-2 text-white hover:text-[#f69a39] transition-colors hidden sm:block">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
              <Link href="/cart" className="relative p-2 text-white hover:text-[#f69a39] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z" />
                </svg>
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#f69a39] text-white text-[9px] rounded-full w-[16px] h-[16px] flex items-center justify-center font-bold">
                    {count}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <div ref={mobileSearchRef} className="relative">
              <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(mobileSearchQuery); }}>
                <div className="flex items-center border border-[#333] rounded-lg bg-[#111] h-[40px] overflow-hidden">
                  <div className="pl-3 pr-2 flex items-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={mobileSearchQuery}
                    onChange={(e) => handleSearchInput(e.target.value, true)}
                    onFocus={() => { if (mobileSearchQuery.length >= 2) setShowMobileSuggestions(true); }}
                    onKeyDown={(e) => e.key === "Escape" && setShowMobileSuggestions(false)}
                    placeholder="Search..."
                    className="flex-1 h-full px-2 text-[13px] text-white outline-none bg-transparent placeholder-gray-500"
                    autoComplete="off"
                  />
                  {searchLoading && <div className="px-2"><div className="w-3.5 h-3.5 border-2 border-[#f69a39] border-t-transparent rounded-full animate-spin" /></div>}
                </div>
              </form>

              {/* Mobile suggestions dropdown */}
              {showMobileSuggestions && mobileSearchQuery.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-[#e5e5e5] z-[200] overflow-hidden">
                  {suggestions.length > 0 ? (
                    <>
                      <div className="py-1">
                        {suggestions.map((p) => {
                          const imgSrc = p.image ? (p.image.startsWith("/uploads/") ? `${UPLOADS}${p.image}` : p.image) : null;
                          return (
                            <Link
                              key={p.id}
                              href={`/products/${p.slug}`}
                              onClick={() => { setShowMobileSuggestions(false); setMobileSearchQuery(""); }}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#fff8f0] transition-colors group"
                            >
                              <div className="w-10 h-10 flex-shrink-0 rounded-[4px] overflow-hidden bg-[#f5f5f5] border border-[#eee]">
                                {imgSrc
                                  ? <Image src={imgSrc} alt={p.name} width={40} height={40} className="w-full h-full object-cover" />
                                  : <div className="w-full h-full flex items-center justify-center text-base">🏏</div>
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-medium text-[#1e1e21] truncate">{p.name}</p>
                                <p className="text-[11px] text-[#999]">{p.brand_name}</p>
                              </div>
                              <p className="text-[12px] font-semibold text-[#f69a39] flex-shrink-0">${Number(p.sell_price || 0).toFixed(2)}</p>
                            </Link>
                          );
                        })}
                      </div>
                      <div className="border-t border-[#f0f0f0]">
                        <Link
                          href={`/products?q=${encodeURIComponent(mobileSearchQuery.trim())}`}
                          onClick={() => { setShowMobileSuggestions(false); setMobileSearchQuery(""); }}
                          className="flex items-center justify-between px-3 py-2.5 bg-[#fafafa] hover:bg-[#fff8f0] transition-colors"
                        >
                          <span className="text-[11px] text-[#555]">View all results for <span className="font-semibold text-[#1e1e21]">&ldquo;{mobileSearchQuery}&rdquo;</span></span>
                          <svg className="w-3.5 h-3.5 text-[#f69a39]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                      </div>
                    </>
                  ) : !searchLoading ? (
                    <div className="px-3 py-4 text-center">
                      <p className="text-[12px] text-[#888]">No results for <span className="font-semibold text-[#1e1e21]">&ldquo;{mobileSearchQuery}&rdquo;</span></p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Desktop Cricket Sub-nav + Mega Menu ──────────────────── */}
        <div className="hidden md:block border-t border-b border-[#dbdbdb] bg-white relative z-40">
          <div className="max-w-[1440px] mx-auto px-[41px]">
            <nav className="flex items-center gap-[20px] h-[31px]">
              {CRICKET_NAV.map((item) => (
                <div key={item.label} className="relative h-full flex items-center"
                  onMouseEnter={() => openMega(item.label)} onMouseLeave={closeMega}>
                  <Link href={item.href}
                    className={`text-[11px] tracking-[0.225px] whitespace-nowrap transition-colors hover:text-[#f69a39] h-full flex items-center border-b-2 ${
                      item.highlight ? "text-[#f69a39] font-semibold border-[#f69a39]"
                        : activeMega === item.label ? "text-[#f69a39] border-[#f69a39]"
                        : "text-black border-transparent"
                    }`}>
                    {item.label}
                    {megaMenus[item.label] && (
                      <svg className="ml-0.5 w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Mega-menu dropdown */}
          {activeMega && megaMenus[activeMega] && (
            <div className="absolute left-0 right-0 top-full z-50 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
              style={{ background: "#1a1a1a" }}
              onMouseEnter={stayMega} onMouseLeave={closeMega}>
              <div className="h-[2px] bg-[#f69a39] w-full" />
              <div className="max-w-[1440px] mx-auto">

                {/* Tab strip */}
                {megaMenus[activeMega].tabs && (
                  <div className="flex items-center border-b border-[#333] px-0">
                    {megaMenus[activeMega].tabs!.map((tab) => (
                      <button key={tab}
                        onClick={() => setActiveMegaTab((prev) => ({ ...prev, [activeMega]: tab }))}
                        className={`px-6 py-2.5 text-[12px] font-semibold tracking-wide transition-colors border-b-2 -mb-px ${
                          getTab(activeMega) === tab
                            ? "border-[#f69a39] text-white"
                            : "border-transparent text-[#888] hover:text-white"
                        }`}>
                        {tab}
                      </button>
                    ))}
                  </div>
                )}

                {/* Main panel */}
                <div className="flex min-h-0">
                  <MegaPanel
                    data={megaMenus[activeMega]}
                    activeTab={getTab(activeMega)}
                    onClose={() => setActiveMega(null)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Mobile Slide-out Menu ──────────────────────────────────── */}
      <div className={`fixed inset-0 z-[100] transition-all duration-300 md:hidden ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute top-0 left-0 bottom-0 w-[280px] bg-[#1a1a1a] transition-transform duration-300 overflow-y-auto ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between p-4 border-b border-[#333]">
            <Image src={ASSETS.logo} alt="PAPAS" width={337} height={115} className="h-9 w-auto object-contain" />
            <button onClick={() => setMobileMenuOpen(false)} className="text-white p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 border-b border-[#333]">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Sports</p>
            {SPORTS_NAV.map((item) => (
              <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 text-[13px] tracking-wide uppercase border-b border-[#2a2a2a] transition-colors ${
                  item.active ? "text-[#f69a39] font-semibold" : "text-[#ccc] hover:text-white"
                }`}>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="p-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Cricket Categories</p>
            {CRICKET_NAV.map((item) => (
              <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 text-[13px] tracking-[0.225px] border-b border-[#2a2a2a] transition-colors ${
                  item.highlight ? "text-[#f69a39] font-semibold" : "text-[#ccc] hover:text-white"
                }`}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Mega panel renderer ────────────────────────────────────────────────────────
function MegaPanel({ data, activeTab, onClose }: { data: MegaData; activeTab: string; onClose: () => void }) {
  // v2 format from visual builder
  if (data.version === 2 && data.items) {
    const cols: { heading: string; href: string; links: MegaLink[] }[] = [];
    let cur: (typeof cols)[0] | null = null;
    for (const item of data.items) {
      if (item.depth === 0) { cur = { heading: item.label, href: item.href, links: [] }; cols.push(cur); }
      else if (cur) cur.links.push({ label: item.label, href: item.href });
    }
    return (
      <div className="flex-1 px-6 py-5">
        <div className="flex gap-8 flex-wrap">
          {cols.map((col, i) => (
            <div key={i} className="min-w-[140px]">
              {col.heading && <MegaHeading>{col.heading}</MegaHeading>}
              <ul className="space-y-1">
                {col.links.map((link, j) => (
                  <li key={j}><MegaLink href={link.href} onClose={onClose}>{link.label}</MegaLink></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // v1 legacy format
  const tabContent: MegaTab | undefined =
    data.tabs && data.content ? data.content[activeTab] : { sidebar: data.sidebar, cols: data.cols ?? [] };
  if (!tabContent) return null;
  return (
    <>
      {tabContent.sidebar && tabContent.sidebar.length > 0 && (
        <div className="w-[200px] flex-shrink-0 border-r border-[#333] py-4 px-4 space-y-2">
          {tabContent.sidebar.map((item) => (
            <Link key={item.href} href={item.href} onClick={onClose}
              className={`block px-3 py-2 text-[12px] font-semibold transition-colors ${
                item.active ? "bg-[#f69a39] text-white" : "border border-[#555] text-white hover:border-[#f69a39] hover:text-[#f69a39]"
              }`}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
      <div className="flex-1 px-6 py-5">
        <div className="flex gap-8 flex-wrap">
          {tabContent.cols.map((col, i) => (
            <div key={i} className="min-w-[140px]">
              {col.heading && <MegaHeading>{col.heading}</MegaHeading>}
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <MegaLink href={link.href} onClose={onClose}>{link.label}</MegaLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function MegaHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2.5">
      <p className="text-[13px] font-bold text-[#f69a39] tracking-wide whitespace-nowrap">{children}</p>
      <div className="h-[2px] bg-[#f69a39] mt-1 w-full" />
    </div>
  );
}

function MegaLink({ href, children, onClose }: { href: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <Link href={href} onClick={onClose}
      className="block text-[11px] text-white border border-[#444] px-2.5 py-1.5 whitespace-nowrap hover:border-[#f69a39] hover:text-[#f69a39] transition-colors">
      {children}
    </Link>
  );
}
