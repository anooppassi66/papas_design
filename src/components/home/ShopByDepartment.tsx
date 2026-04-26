"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DEPARTMENTS } from "@/lib/data";

export default function ShopByDepartment() {
  const [startIdx, setStartIdx] = useState(0);
  const visibleCount = 4;

  const prev = () => setStartIdx((i) => Math.max(0, i - 1));
  const next = () => setStartIdx((i) => Math.min(DEPARTMENTS.length - visibleCount, i + 1));

  return (
    <section className="bg-[#f69a39] py-5 md:py-6">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[43px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-[16px] md:text-[18px] font-semibold tracking-[0.36px] uppercase">
            Shop by Department
          </h2>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={prev}
              className="w-[22px] h-[22px] bg-[#fff5ec] rounded-full flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
              aria-label="Previous"
            >
              <svg className="w-3 h-3 text-[#1e1e21]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="w-[22px] h-[22px] bg-[#fff5ec] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Next"
            >
              <svg className="w-3 h-3 text-[#1e1e21]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-4 gap-3">
          {DEPARTMENTS.slice(startIdx, startIdx + visibleCount).map((dept) => (
            <DeptCard key={dept.id} dept={dept} />
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="md:hidden flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {DEPARTMENTS.map((dept) => (
            <div key={dept.id} className="snap-start flex-shrink-0 w-[220px]">
              <DeptCard dept={dept} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeptCard({ dept }: { dept: (typeof DEPARTMENTS)[0] }) {
  return (
    <Link
      href={dept.href}
      className="flex items-center gap-3 bg-[#fff5ec] rounded-[4px] p-2 hover:bg-white transition-colors group"
    >
      <div className="w-[80px] h-[80px] flex-shrink-0 rounded-[4px] overflow-hidden bg-white">
        <Image
          src={dept.image}
          alt={dept.name}
          width={80}
          height={80}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[#1e1e21] text-[12px] font-semibold tracking-[1.1px] uppercase leading-tight line-clamp-2">
          {dept.name}
        </span>
        <span className="text-[#484a4c] text-[12px]">Shop Now</span>
      </div>
    </Link>
  );
}
