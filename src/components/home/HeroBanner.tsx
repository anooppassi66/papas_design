"use client";
import Image from "next/image";
import Link from "next/link";
import { ASSETS } from "@/lib/data";

export default function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "clamp(400px, 55vw, 650px)" }}>
      {/* Background image */}
      <Image
        src={ASSETS.heroBanner}
        alt="New Balance Footwear"
        fill
        className="object-cover object-top"
        priority
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-10 pb-10 md:pb-14">
        <p className="text-white text-[12px] md:text-[13px] font-normal tracking-wide mb-3">
          New Balance Footwear
        </p>
        <Link
          href="/cricket/shoes/new-balance"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full backdrop-blur-[10px] bg-white/30 border border-white/40 text-white text-[11px] md:text-[12px] font-medium tracking-[0.6px] uppercase w-fit hover:bg-white/50 transition-all duration-200"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
