"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ASSETS, SPORTS_NAV, CRICKET_NAV } from "@/lib/data";

// Tab labels per mega menu
const MEGA_MENU_TABS: Record<string, string[]> = {
  Bats: ["Adult", "Kids"],
  Shoes: ["Adult", "Kids"],
  "Batting Equipment": ["Adult", "Kids"],
  Helmets: ["Adult", "Kids"],
  "Wicket Keeping": ["Adult", "Kids"],
};

// Full mega menu data — keyed by category then tab
const MEGA_MENUS: Record<string, Record<string, {
  sidebar: { label: string; href: string; active?: boolean }[];
  cols: { heading: string; links: { label: string; href: string }[] }[];
}>> = {
  Bats: {
    Adult: {
      sidebar: [
        { label: "Adult Cricket Bat", href: "/cricket/bats/adult", active: true },
        { label: "All Adult Cricket Bat", href: "/cricket/bats/adult/all" },
        { label: "Bat Guide", href: "/cricket/bats/guide" },
      ],
      cols: [
        {
          heading: "Cricket Bats",
          links: [
            { label: "TON Cricket Bat Finder", href: "/cricket/bats/ton-finder" },
            { label: "English Willow Bats", href: "/cricket/bats/english-willow" },
            { label: "Alternative Willow Bats", href: "/cricket/bats/alternative-willow" },
            { label: "Kashmir Willow Bats", href: "/cricket/bats/kashmir-willow" },
            { label: "Soft Tennis Ball Bats", href: "/cricket/bats/tennis-ball" },
            { label: "Training Bats", href: "/cricket/bats/training" },
            { label: "Autograph Bats", href: "/cricket/bats/autograph" },
            { label: "Junior Cricket Bats", href: "/cricket/bats/junior" },
            { label: "Cricket Bat Covers", href: "/cricket/bats/covers" },
          ],
        },
        {
          heading: "English Willow Bats",
          links: [
            { label: "SS TON", href: "/cricket/bats/ss-ton" },
            { label: "CA", href: "/cricket/bats/ca" },
            { label: "GM", href: "/cricket/bats/gm" },
            { label: "SCC", href: "/cricket/bats/scc" },
            { label: "DSC", href: "/cricket/bats/dsc" },
            { label: "Laver Wood", href: "/cricket/bats/laver-wood" },
            { label: "Focus", href: "/cricket/bats/focus" },
            { label: "BAS", href: "/cricket/bats/bas" },
            { label: "CEAT", href: "/cricket/bats/ceat" },
            { label: "EM", href: "/cricket/bats/em" },
            { label: "Batman Chicago BS", href: "/cricket/bats/batman-chicago" },
            { label: "CP", href: "/cricket/bats/cp" },
            { label: "Soni", href: "/cricket/bats/soni" },
          ],
        },
        {
          heading: "",
          links: [
            { label: "SG", href: "/cricket/bats/sg" },
            { label: "Kookaburra", href: "/cricket/bats/kookaburra" },
            { label: "Gray Nicolls", href: "/cricket/bats/gray-nicolls" },
            { label: "MRF", href: "/cricket/bats/mrf" },
            { label: "New Balance", href: "/cricket/bats/new-balance" },
            { label: "Kingsbury", href: "/cricket/bats/kingsbury" },
            { label: "Newbery", href: "/cricket/bats/newbery" },
            { label: "MB", href: "/cricket/bats/mb" },
            { label: "BDM", href: "/cricket/bats/bdm" },
            { label: "Adidas", href: "/cricket/bats/adidas" },
            { label: "Hound", href: "/cricket/bats/hound" },
            { label: "Mongoose", href: "/cricket/bats/mongoose" },
            { label: "HS", href: "/cricket/bats/hs" },
          ],
        },
        {
          heading: "Size",
          links: [
            { label: "Short Handle", href: "/cricket/bats/size/sh" },
            { label: "Long Handle", href: "/cricket/bats/size/lh" },
            { label: "Long Blade", href: "/cricket/bats/size/lb" },
            { label: "Small Adult", href: "/cricket/bats/size/small-adult" },
            { label: "Harrow", href: "/cricket/bats/size/harrow" },
            { label: "Size 6", href: "/cricket/bats/size/6" },
            { label: "Size 5", href: "/cricket/bats/size/5" },
            { label: "Size 4", href: "/cricket/bats/size/4" },
            { label: "Size 3", href: "/cricket/bats/size/3" },
            { label: "Size 2", href: "/cricket/bats/size/2" },
            { label: "Size 1", href: "/cricket/bats/size/1" },
          ],
        },
        {
          heading: "Grade",
          links: [
            { label: "Players Grade", href: "/cricket/bats/grade/players" },
            { label: "Grade", href: "/cricket/bats/grade/1" },
            { label: "Grade", href: "/cricket/bats/grade/2" },
            { label: "Grade", href: "/cricket/bats/grade/3" },
            { label: "Grade", href: "/cricket/bats/grade/4" },
            { label: "Grade", href: "/cricket/bats/grade/5" },
            { label: "Grade", href: "/cricket/bats/grade/6" },
          ],
        },
      ],
    },
    Kids: {
      sidebar: [
        { label: "Kids Cricket Bat", href: "/cricket/bats/kids", active: true },
        { label: "All Kids Cricket Bat", href: "/cricket/bats/kids/all" },
        { label: "Bat Guide", href: "/cricket/bats/guide" },
      ],
      cols: [
        {
          heading: "Cricket Bats",
          links: [
            { label: "English Willow Bats", href: "/cricket/bats/kids/english-willow" },
            { label: "Kashmir Willow Bats", href: "/cricket/bats/kids/kashmir-willow" },
            { label: "Soft Tennis Ball Bats", href: "/cricket/bats/kids/tennis-ball" },
            { label: "Training Bats", href: "/cricket/bats/kids/training" },
            { label: "Junior Cricket Bats", href: "/cricket/bats/kids/junior" },
            { label: "Cricket Bat Covers", href: "/cricket/bats/kids/covers" },
          ],
        },
        {
          heading: "Brands",
          links: [
            { label: "Gray Nicolls", href: "/cricket/bats/kids/gray-nicolls" },
            { label: "Kookaburra", href: "/cricket/bats/kids/kookaburra" },
            { label: "SS TON", href: "/cricket/bats/kids/ss-ton" },
            { label: "GM", href: "/cricket/bats/kids/gm" },
            { label: "SG", href: "/cricket/bats/kids/sg" },
            { label: "New Balance", href: "/cricket/bats/kids/new-balance" },
          ],
        },
        {
          heading: "Size",
          links: [
            { label: "Harrow", href: "/cricket/bats/kids/harrow" },
            { label: "Size 6", href: "/cricket/bats/kids/6" },
            { label: "Size 5", href: "/cricket/bats/kids/5" },
            { label: "Size 4", href: "/cricket/bats/kids/4" },
            { label: "Size 3", href: "/cricket/bats/kids/3" },
            { label: "Size 2", href: "/cricket/bats/kids/2" },
            { label: "Size 1", href: "/cricket/bats/kids/1" },
          ],
        },
      ],
    },
  },
  Shoes: {
    Adult: {
      sidebar: [
        { label: "Adult Cricket Shoes", href: "/cricket/shoes/adult", active: true },
        { label: "All Adult Shoes", href: "/cricket/shoes/adult/all" },
        { label: "Shoe Guide", href: "/cricket/shoes/guide" },
      ],
      cols: [
        {
          heading: "Cricket Shoes",
          links: [
            { label: "Cricket Spikes", href: "/cricket/shoes/spikes" },
            { label: "Rubber Sole Shoes", href: "/cricket/shoes/rubber" },
            { label: "Training Shoes", href: "/cricket/shoes/training" },
            { label: "Wicket Keeping Shoes", href: "/cricket/shoes/wk" },
            { label: "Wide Fit Shoes", href: "/cricket/shoes/wide-fit" },
          ],
        },
        {
          heading: "Brands",
          links: [
            { label: "Adidas", href: "/cricket/shoes/adidas" },
            { label: "New Balance", href: "/cricket/shoes/new-balance" },
            { label: "Puma", href: "/cricket/shoes/puma" },
            { label: "Kookaburra", href: "/cricket/shoes/kookaburra" },
            { label: "Asics", href: "/cricket/shoes/asics" },
            { label: "GM", href: "/cricket/shoes/gm" },
          ],
        },
        {
          heading: "Size",
          links: [
            { label: "Size 7", href: "/cricket/shoes/size/7" },
            { label: "Size 8", href: "/cricket/shoes/size/8" },
            { label: "Size 9", href: "/cricket/shoes/size/9" },
            { label: "Size 10", href: "/cricket/shoes/size/10" },
            { label: "Size 11", href: "/cricket/shoes/size/11" },
            { label: "Size 12", href: "/cricket/shoes/size/12" },
          ],
        },
      ],
    },
    Kids: {
      sidebar: [
        { label: "Kids Cricket Shoes", href: "/cricket/shoes/kids", active: true },
        { label: "All Kids Shoes", href: "/cricket/shoes/kids/all" },
      ],
      cols: [
        {
          heading: "Cricket Shoes",
          links: [
            { label: "Junior Spikes", href: "/cricket/shoes/kids/spikes" },
            { label: "Junior Rubber Sole", href: "/cricket/shoes/kids/rubber" },
            { label: "Junior Training", href: "/cricket/shoes/kids/training" },
          ],
        },
        {
          heading: "Brands",
          links: [
            { label: "Adidas", href: "/cricket/shoes/kids/adidas" },
            { label: "New Balance", href: "/cricket/shoes/kids/new-balance" },
            { label: "Puma", href: "/cricket/shoes/kids/puma" },
          ],
        },
      ],
    },
  },
  "Batting Equipment": {
    Adult: {
      sidebar: [
        { label: "Adult Batting Equipment", href: "/cricket/batting-equipment/adult", active: true },
        { label: "All Batting Equipment", href: "/cricket/batting-equipment/adult/all" },
      ],
      cols: [
        {
          heading: "Protective Gear",
          links: [
            { label: "Batting Pads", href: "/cricket/batting-equipment/pads" },
            { label: "Batting Gloves", href: "/cricket/batting-equipment/gloves" },
            { label: "Thigh Pads", href: "/cricket/batting-equipment/thigh-pads" },
            { label: "Arm Guards", href: "/cricket/batting-equipment/arm-guards" },
            { label: "Chest Guards", href: "/cricket/batting-equipment/chest-guards" },
            { label: "Rib Guards", href: "/cricket/batting-equipment/rib-guards" },
          ],
        },
        {
          heading: "Brands",
          links: [
            { label: "Gray Nicolls", href: "/cricket/batting-equipment/gray-nicolls" },
            { label: "Kookaburra", href: "/cricket/batting-equipment/kookaburra" },
            { label: "SS TON", href: "/cricket/batting-equipment/ss-ton" },
            { label: "GM", href: "/cricket/batting-equipment/gm" },
            { label: "SG", href: "/cricket/batting-equipment/sg" },
          ],
        },
      ],
    },
    Kids: {
      sidebar: [
        { label: "Kids Batting Equipment", href: "/cricket/batting-equipment/kids", active: true },
        { label: "All Kids Equipment", href: "/cricket/batting-equipment/kids/all" },
      ],
      cols: [
        {
          heading: "Protective Gear",
          links: [
            { label: "Junior Batting Pads", href: "/cricket/batting-equipment/kids/pads" },
            { label: "Junior Batting Gloves", href: "/cricket/batting-equipment/kids/gloves" },
            { label: "Junior Thigh Pads", href: "/cricket/batting-equipment/kids/thigh-pads" },
          ],
        },
      ],
    },
  },
  Helmets: {
    Adult: {
      sidebar: [
        { label: "Adult Helmets", href: "/cricket/helmets/adult", active: true },
        { label: "All Adult Helmets", href: "/cricket/helmets/adult/all" },
      ],
      cols: [
        {
          heading: "Helmets",
          links: [
            { label: "Steel Grille Helmets", href: "/cricket/helmets/steel" },
            { label: "Titanium Grille Helmets", href: "/cricket/helmets/titanium" },
            { label: "Helmet Accessories", href: "/cricket/helmets/accessories" },
            { label: "Helmet Grilles", href: "/cricket/helmets/grilles" },
          ],
        },
        {
          heading: "Brands",
          links: [
            { label: "Gray Nicolls", href: "/cricket/helmets/gray-nicolls" },
            { label: "Shrey", href: "/cricket/helmets/shrey" },
            { label: "Masuri", href: "/cricket/helmets/masuri" },
            { label: "GM", href: "/cricket/helmets/gm" },
          ],
        },
      ],
    },
    Kids: {
      sidebar: [
        { label: "Kids Helmets", href: "/cricket/helmets/kids", active: true },
        { label: "All Kids Helmets", href: "/cricket/helmets/kids/all" },
      ],
      cols: [
        {
          heading: "Helmets",
          links: [
            { label: "Junior Steel Grille", href: "/cricket/helmets/kids/steel" },
            { label: "Junior Titanium Grille", href: "/cricket/helmets/kids/titanium" },
          ],
        },
      ],
    },
  },
  "Wicket Keeping": {
    Adult: {
      sidebar: [
        { label: "Adult WK Equipment", href: "/cricket/wicket-keeping/adult", active: true },
        { label: "All WK Equipment", href: "/cricket/wicket-keeping/adult/all" },
      ],
      cols: [
        {
          heading: "Wicket Keeping",
          links: [
            { label: "WK Gloves", href: "/cricket/wicket-keeping/gloves" },
            { label: "WK Pads", href: "/cricket/wicket-keeping/pads" },
            { label: "WK Inners", href: "/cricket/wicket-keeping/inners" },
          ],
        },
      ],
    },
    Kids: {
      sidebar: [
        { label: "Kids WK Equipment", href: "/cricket/wicket-keeping/kids", active: true },
        { label: "All Kids WK", href: "/cricket/wicket-keeping/kids/all" },
      ],
      cols: [
        {
          heading: "Wicket Keeping",
          links: [
            { label: "Junior WK Gloves", href: "/cricket/wicket-keeping/kids/gloves" },
            { label: "Junior WK Pads", href: "/cricket/wicket-keeping/kids/pads" },
          ],
        },
      ],
    },
  },
};

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount] = useState(0);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [activeMegaTab, setActiveMegaTab] = useState<Record<string, string>>({});
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getTab = (cat: string) => activeMegaTab[cat] ?? (MEGA_MENU_TABS[cat]?.[0] ?? "Adult");

  const openMega = (label: string) => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    if (MEGA_MENUS[label]) setActiveMega(label);
    else setActiveMega(null);
  };
  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setActiveMega(null), 160);
  };
  const stayMega = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
  };

  return (
    <>
      {/* ── Desktop: Sports Strip ────────────────────────────────────── */}
      <div className="bg-[#1e1e21] hidden md:block">
        <div className="max-w-[1440px] mx-auto px-[42px]">
          <nav className="flex items-center gap-[14px] h-[30px]">
            {SPORTS_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-[11px] tracking-[0.525px] uppercase transition-colors whitespace-nowrap ${
                  item.active
                    ? "text-[#f69a39] font-semibold"
                    : "text-[#a5a7a8] font-normal hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Main Header ──────────────────────────────────────────────── */}
      <header className="bg-black sticky top-0 z-50 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[42px]">
          <div className="flex items-center gap-4 h-[72px] md:h-[80px]">
            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-[5px] w-6 h-6 justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block h-[2px] bg-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block h-[2px] bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-[2px] bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src={ASSETS.logo}
                alt="PAPAS Willow Cricket Store"
                width={200}
                height={54}
                className="h-[48px] md:h-[60px] w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 mx-8">
              <div className="relative w-full max-w-[745px]">
                <div className="flex items-center border border-[#dbdbdb] rounded-lg bg-white h-[44px] overflow-hidden">
                  <div className="pl-3 pr-2 flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search for products, brands..."
                    className="flex-1 h-full px-2 text-[14px] text-gray-700 outline-none bg-transparent"
                  />
                  <button className="h-full px-4 bg-[#f69a39] text-white text-sm font-medium hover:bg-[#e8880d] transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Mobile search icon */}
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
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#f69a39] text-white text-[9px] rounded-full w-[16px] h-[16px] flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <div className="flex items-center border border-[#333] rounded-lg bg-[#111] h-[40px] overflow-hidden">
              <div className="pl-3 pr-2 flex items-center">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 h-full px-2 text-[13px] text-white outline-none bg-transparent placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* ── Desktop Cricket Sub-nav + Mega Menu ─────────────────── */}
        <div className="hidden md:block border-t border-b border-[#dbdbdb] bg-white relative z-40">
          <div className="max-w-[1440px] mx-auto px-[41px]">
            <nav className="flex items-center gap-[20px] h-[31px]">
              {CRICKET_NAV.map((item) => (
                <div
                  key={item.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => openMega(item.label)}
                  onMouseLeave={closeMega}
                >
                  <Link
                    href={item.href}
                    className={`text-[11px] tracking-[0.225px] whitespace-nowrap transition-colors hover:text-[#f69a39] h-full flex items-center border-b-2 ${
                      item.highlight
                        ? "text-[#f69a39] font-semibold border-[#f69a39]"
                        : activeMega === item.label
                        ? "text-[#f69a39] border-[#f69a39]"
                        : "text-black border-transparent"
                    }`}
                  >
                    {item.label}
                    {MEGA_MENUS[item.label] && (
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
          {activeMega && MEGA_MENUS[activeMega] && (
            <div
              className="absolute left-0 right-0 top-full z-50 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
              style={{ background: "#1a1a1a" }}
              onMouseEnter={stayMega}
              onMouseLeave={closeMega}
            >
              {/* Blue top border like Figma */}
              <div className="h-[2px] bg-[#3b82f6] w-full" />

              <div className="max-w-[1440px] mx-auto">

                {/* ── Adult / Kids tab strip ── */}
                {MEGA_MENU_TABS[activeMega] && (
                  <div className="flex items-center border-b border-[#333] px-0">
                    {MEGA_MENU_TABS[activeMega].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveMegaTab((prev) => ({ ...prev, [activeMega]: tab }))}
                        className={`px-6 py-2.5 text-[12px] font-semibold tracking-wide transition-colors border-b-2 -mb-px ${
                          getTab(activeMega) === tab
                            ? "border-[#f69a39] text-white"
                            : "border-transparent text-[#888] hover:text-white"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}

                {/* ── Main panel ── */}
                <div className="flex min-h-0">

                  {/* Left sidebar */}
                  {MEGA_MENUS[activeMega][getTab(activeMega)]?.sidebar && (
                    <div className="w-[200px] flex-shrink-0 border-r border-[#333] py-4 px-4 space-y-2">
                      {MEGA_MENUS[activeMega][getTab(activeMega)].sidebar.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setActiveMega(null)}
                          className={`block px-3 py-2 text-[12px] font-semibold transition-colors ${
                            item.active
                              ? "bg-[#f69a39] text-white"
                              : "border border-[#555] text-white hover:border-[#f69a39] hover:text-[#f69a39]"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* ── Content columns ── */}
                  <div className="flex-1 px-6 py-5">
                    {activeMega === "Bats" && getTab(activeMega) === "Adult" ? (
                      /* Bats Adult — special 2-row layout matching screenshot exactly */
                      <div className="flex gap-8">

                        {/* Col 1: Cricket Bats + Profile below */}
                        <div className="flex flex-col gap-6">
                          {/* Cricket Bats */}
                          <div>
                            <MegaHeading>Cricket Bats</MegaHeading>
                            <ul className="space-y-1 w-[230px]">
                              {[
                                { label: "TON Cricket Bat Finder", href: "/cricket/bats/ton-finder" },
                                { label: "English Willow Bats",    href: "/cricket/bats/english-willow" },
                                { label: "Alternative Willow Bats",href: "/cricket/bats/alternative-willow" },
                                { label: "Kashmir Willow Bats",    href: "/cricket/bats/kashmir-willow" },
                                { label: "Soft Tennis Ball Bats",  href: "/cricket/bats/tennis-ball" },
                                { label: "Training Bats",          href: "/cricket/bats/training" },
                                { label: "Autograph Bats",         href: "/cricket/bats/autograph" },
                                { label: "Junior Cricket Bats",    href: "/cricket/bats/junior" },
                                { label: "Cricket Bat Covers",     href: "/cricket/bats/covers" },
                              ].map((l) => (
                                <li key={l.href}>
                                  <MegaLink href={l.href} onClose={() => setActiveMega(null)}>{l.label}</MegaLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* Profile */}
                          <div>
                            <MegaHeading>Profile</MegaHeading>
                            <ul className="space-y-1 w-[230px]">
                              {[
                                { label: "Extended Mid Swell Position", href: "/cricket/bats/profile/extended-mid-swell" },
                                { label: "Low Swell Position",          href: "/cricket/bats/profile/low-swell" },
                                { label: "Reebok Mid Swell Position",   href: "/cricket/bats/profile/reebok-mid-swell" },
                                { label: "Mid High Position",           href: "/cricket/bats/profile/mid-high" },
                                { label: "Mid To Low",                  href: "/cricket/bats/profile/mid-to-low" },
                              ].map((l) => (
                                <li key={l.href}>
                                  <MegaLink href={l.href} onClose={() => setActiveMega(null)}>{l.label}</MegaLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Col 2: English Willow Bats (2 sub-cols side by side) */}
                        <div>
                          <MegaHeading>English Willow Bats</MegaHeading>
                          <div className="flex gap-2">
                            {/* Sub-col A */}
                            <ul className="space-y-1 w-[110px]">
                              {[
                                { label: "SS TON",          href: "/cricket/bats/ss-ton" },
                                { label: "CA",              href: "/cricket/bats/ca" },
                                { label: "GM",              href: "/cricket/bats/gm" },
                                { label: "SCC",             href: "/cricket/bats/scc" },
                                { label: "DSC",             href: "/cricket/bats/dsc" },
                                { label: "Laver Wood",      href: "/cricket/bats/laver-wood" },
                                { label: "Focus",           href: "/cricket/bats/focus" },
                                { label: "BAS",             href: "/cricket/bats/bas" },
                                { label: "CEAT",            href: "/cricket/bats/ceat" },
                                { label: "EM",              href: "/cricket/bats/em" },
                                { label: "Batman Chicago BS", href: "/cricket/bats/batman-chicago" },
                                { label: "CP",              href: "/cricket/bats/cp" },
                                { label: "Somi",            href: "/cricket/bats/somi" },
                              ].map((l) => (
                                <li key={l.href}>
                                  <MegaLink href={l.href} onClose={() => setActiveMega(null)}>{l.label}</MegaLink>
                                </li>
                              ))}
                            </ul>
                            {/* Sub-col B */}
                            <ul className="space-y-1 w-[110px]">
                              {[
                                { label: "SG",          href: "/cricket/bats/sg" },
                                { label: "Kookaburra",  href: "/cricket/bats/kookaburra" },
                                { label: "Gray Nicolls",href: "/cricket/bats/gray-nicolls" },
                                { label: "MRF",         href: "/cricket/bats/mrf" },
                                { label: "New Balance", href: "/cricket/bats/new-balance" },
                                { label: "Kingsbury",   href: "/cricket/bats/kingsbury" },
                                { label: "Newbery",     href: "/cricket/bats/newbery" },
                                { label: "MB",          href: "/cricket/bats/mb" },
                                { label: "BDM",         href: "/cricket/bats/bdm" },
                                { label: "Adidas",      href: "/cricket/bats/adidas" },
                                { label: "Hound",       href: "/cricket/bats/hound" },
                                { label: "Mongoose",    href: "/cricket/bats/mongoose" },
                                { label: "HS",          href: "/cricket/bats/hs" },
                              ].map((l) => (
                                <li key={l.href}>
                                  <MegaLink href={l.href} onClose={() => setActiveMega(null)}>{l.label}</MegaLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Col 3: Size */}
                        <div>
                          <MegaHeading>Size</MegaHeading>
                          <ul className="space-y-1 w-[150px]">
                            {[
                              { label: "Short Handle", href: "/cricket/bats/size/sh" },
                              { label: "Long Handle",  href: "/cricket/bats/size/lh" },
                              { label: "Long Blade",   href: "/cricket/bats/size/lb" },
                              { label: "Small Adult",  href: "/cricket/bats/size/small-adult" },
                              { label: "Harrow",       href: "/cricket/bats/size/harrow" },
                              { label: "Size 6",       href: "/cricket/bats/size/6" },
                              { label: "Size 5",       href: "/cricket/bats/size/5" },
                              { label: "Size 4",       href: "/cricket/bats/size/4" },
                              { label: "Size 3",       href: "/cricket/bats/size/3" },
                              { label: "Size 2",       href: "/cricket/bats/size/2" },
                              { label: "Size 1",       href: "/cricket/bats/size/1" },
                            ].map((l) => (
                              <li key={l.href}>
                                <MegaLink href={l.href} onClose={() => setActiveMega(null)}>{l.label}</MegaLink>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Col 4: Grade + Quick Search stacked */}
                        <div className="flex flex-col gap-6">
                          {/* Grade */}
                          <div>
                            <MegaHeading>Grade</MegaHeading>
                            <ul className="space-y-1 w-[180px]">
                              {[
                                { label: "Players Grade", href: "/cricket/bats/grade/players" },
                                { label: "Grade 1",       href: "/cricket/bats/grade/1" },
                                { label: "Grade 2",       href: "/cricket/bats/grade/2" },
                                { label: "Grade 3",       href: "/cricket/bats/grade/3" },
                                { label: "Grade 4",       href: "/cricket/bats/grade/4" },
                                { label: "Grade 5",       href: "/cricket/bats/grade/5" },
                                { label: "Grade 6",       href: "/cricket/bats/grade/6" },
                              ].map((l) => (
                                <li key={l.href}>
                                  <MegaLink href={l.href} onClose={() => setActiveMega(null)}>{l.label}</MegaLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* Quick Search */}
                          <div>
                            <MegaHeading>Quick Search</MegaHeading>
                            <ul className="space-y-1 w-[180px]">
                              {[
                                { label: "Scoop Bats",        href: "/cricket/bats/search/scoop" },
                                { label: "Collector Edition", href: "/cricket/bats/search/collector" },
                                { label: "Super Light Bats",  href: "/cricket/bats/search/super-light" },
                                { label: "Actual Player Bats",href: "/cricket/bats/search/player" },
                                { label: "Under 200",         href: "/cricket/bats/search/under-200" },
                              ].map((l) => (
                                <li key={l.href}>
                                  <MegaLink href={l.href} onClose={() => setActiveMega(null)}>{l.label}</MegaLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                      </div>
                    ) : (
                      /* Generic layout for all other categories / tabs */
                      <div className="flex gap-8">
                        {MEGA_MENUS[activeMega][getTab(activeMega)]?.cols.map((col, colIdx) => (
                          <div key={colIdx} className="min-w-[140px]">
                            {col.heading && <MegaHeading>{col.heading}</MegaHeading>}
                            <ul className="space-y-1">
                              {col.links.map((link) => (
                                <li key={link.href + link.label}>
                                  <MegaLink href={link.href} onClose={() => setActiveMega(null)}>
                                    {link.label}
                                  </MegaLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Mobile Slide-out Menu ────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-300 md:hidden ${
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-[280px] bg-[#1a1a1a] transition-transform duration-300 overflow-y-auto ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-[#333]">
            <Image src={ASSETS.logo} alt="PAPAS" width={120} height={40} className="h-8 w-auto object-contain" />
            <button onClick={() => setMobileMenuOpen(false)} className="text-white p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sports nav */}
          <div className="p-4 border-b border-[#333]">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Sports</p>
            {SPORTS_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 text-[13px] tracking-wide uppercase border-b border-[#2a2a2a] transition-colors ${
                  item.active ? "text-[#f69a39] font-semibold" : "text-[#ccc] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Cricket sub-nav */}
          <div className="p-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Cricket Categories</p>
            {CRICKET_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 text-[13px] tracking-[0.225px] border-b border-[#2a2a2a] transition-colors ${
                  item.highlight ? "text-[#f69a39] font-semibold" : "text-[#ccc] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Shared sub-components for mega menu ──────────────────────────────────── */

function MegaHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2.5">
      <p className="text-[13px] font-bold text-[#f69a39] tracking-wide whitespace-nowrap">
        {children}
      </p>
      <div className="h-[2px] bg-[#f69a39] mt-1 w-full" />
    </div>
  );
}

function MegaLink({
  href,
  children,
  onClose,
}: {
  href: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="block text-[11px] text-white border border-[#444] px-2.5 py-1.5 whitespace-nowrap hover:border-[#f69a39] hover:text-[#f69a39] transition-colors"
    >
      {children}
    </Link>
  );
}
