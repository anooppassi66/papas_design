"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ASSETS, TRUST_BADGES } from "@/lib/data";

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <>
      {/* ── Trust Badges Strip ─────────────────────────────────────── */}
      <div className="bg-[#f69a39] border-t border-b border-[#dbdbdb]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-4">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  <Image src={badge.icon} alt={badge.title} width={28} height={28} className="w-7 h-7 object-contain" />
                </div>
                <p className="text-[10px] text-black font-medium leading-tight">{badge.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Footer ───────────────────────────────────────────── */}
      <footer className="bg-black text-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">

            {/* Newsletter */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Image src={ASSETS.logo} alt="PAPAS" width={160} height={54} className="h-12 w-auto object-contain mb-6" />

              <h3 className="text-[11px] font-semibold tracking-[0.85px] uppercase mb-4">
                Join our Newsletter for Exclusive<br />Offers &amp; Deals
              </h3>

              <div className="mb-4">
                <span className="text-[10px] text-[#f69a39] font-medium tracking-[0.45px] uppercase mb-2 block">EMAIL</span>
                <div className="flex items-center border border-[#f69a39] rounded-[3px] overflow-hidden">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="flex-1 px-3 py-2 bg-transparent text-white text-[12px] placeholder-[#f69a39]/60 outline-none"
                  />
                  <button className="px-3 py-2 text-[#f69a39] text-[11px] underline font-medium">Submit</button>
                </div>
              </div>

              <Link
                href="/gift-cards"
                className="flex items-center gap-3 bg-[#f6f6f6]/10 hover:bg-[#f6f6f6]/20 rounded-[2px] px-3 py-2 transition-colors mt-4"
              >
                <div className="w-8 h-8 bg-[#f69a39] rounded-sm flex items-center justify-center flex-shrink-0">
                  <Image src={ASSETS.giftCard} alt="Gift Card" width={20} height={20} className="w-5 h-5 object-contain" />
                </div>
                <span className="text-[10px] text-[#f69a39] font-semibold">PAPAS Gift Cards</span>
              </Link>
            </div>

            {/* Help & Info */}
            <div>
              <h3 className="text-[11px] font-semibold tracking-[0.85px] uppercase mb-5 text-white">Help &amp; Info</h3>
              <ul className="space-y-3">
                {["Help & FAQs", "Delivery", "Returns", "Orders", "Our Stores"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-[11px] text-white/70 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* My Account */}
            <div>
              <h3 className="text-[11px] font-semibold tracking-[0.85px] uppercase mb-5 text-white">My Account</h3>
              <ul className="space-y-3">
                {["My Orders", "My Addresses", "My Preferences", "Terms and Conditions", "Privacy Policy"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-[11px] text-white/70 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About + Social */}
            <div>
              <h3 className="text-[11px] font-semibold tracking-[0.85px] uppercase mb-5 text-white">About PAPAS</h3>
              <ul className="space-y-3 mb-6">
                {["Family owned and run since 1981", "In the Company of Kings & Queens", "Over 100,000 5 Star Reviews on Trustpilot"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-[11px] text-white/70 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social Image + Handle */}
              <div className="border-b border-white/20 pb-4 mb-4">
                <div className="overflow-hidden rounded-sm mb-3">
                  <Image
                    src={ASSETS.socialImage}
                    alt="PAPAS Instagram"
                    width={138}
                    height={185}
                    className="w-full h-[140px] object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-[10px] font-semibold tracking-[0.85px] uppercase text-white mb-1">
                  Boots. Players. Culture.
                </h4>
              </div>

              <Link href="https://instagram.com" className="flex items-center gap-2 group">
                <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="text-[10px] font-medium tracking-[0.45px] uppercase text-white/70 group-hover:text-white transition-colors">PAPAS</span>
                <svg className="w-3 h-3 text-[#f69a39]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[10px] text-white/40 tracking-[0.45px] uppercase">
              POWERED BY PAPAS CRICKET
            </p>
            <p className="text-[10px] text-white/40">
              © {new Date().getFullYear()} PAPAS Willow Cricket Store. All rights reserved.
            </p>
          </div>
        </div>

        {/* Back to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-[#f69a39] hover:text-white transition-all duration-200 z-40"
          aria-label="Back to top"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </footer>
    </>
  );
}
