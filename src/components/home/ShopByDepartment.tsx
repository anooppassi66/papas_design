"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Dept { id: number; name: string; image: string; href: string; }

interface Props { departments: Dept[]; }

export default function ShopByDepartment({ departments }: Props) {
  const [startIdx, setStartIdx] = useState(0);
  const visibleCount = 4;

  const prev = () => setStartIdx(i => Math.max(0, i - 1));
  const next = () => setStartIdx(i => Math.min(departments.length - visibleCount, i + 1));

  return (
    <section className="bg-[#f69a39] py-5 md:py-6">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[43px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-[20px] md:text-[20px] font-semibold tracking-[0.36px]">Shop by Department</h2>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={prev} className="w-[22px] h-[22px] bg-[#fff5ec] rounded-full flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity" aria-label="Previous">
              <svg className="w-3 h-3 text-[#1e1e21]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={next} className="w-[22px] h-[22px] bg-[#fff5ec] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" aria-label="Next">
              <svg className="w-3 h-3 text-[#1e1e21]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-4 gap-3">
          {departments.slice(startIdx, startIdx + visibleCount).map(dept => <DeptCard key={dept.id} dept={dept} />)}
        </div>
        <div className="md:hidden flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {departments.map(dept => (
            <div key={dept.id} className="snap-start flex-shrink-0 w-[220px]"><DeptCard dept={dept} /></div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeptCard({ dept }: { dept: Dept }) {
  return (
    <Link href={dept.href} className="flex items-center gap-3 bg-[#fff5ec] rounded-[4px] p-2 hover:bg-white transition-colors group">
      <div className="w-[80px] h-[80px] flex-shrink-0 rounded-[4px] overflow-hidden bg-white">
        {dept.image
          ? <Image src={dept.image} alt={dept.name} width={80} height={80} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full bg-[#f0f0f0] flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
        }
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[#1e1e21] text-[16px] font-semibold tracking-[1.1px] uppercase leading-tight line-clamp-2">{dept.name}</span>
        <span className="text-[#484a4c] text-[16px]">Shop Now</span>
      </div>
    </Link>
  );
}
