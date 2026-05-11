"use client";
import { useState } from "react";
import Image from 'next/image';

export default function AboutSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="bg-black py-10 md:py-14">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Brand image / placeholder */}
          <div className="overflow-hidden rounded-[3px] w-full h-[200px] md:h-[260px] bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#111] flex items-center justify-center relative">
            {/* <div className="text-center">
              <div className="text-[#f69a39] text-[48px] font-black tracking-widest leading-none">PAPAS</div>
              <div className="text-white text-[16px] tracking-[8px] font-light mt-1">WILLOW</div>
              <div className="mt-3 text-white/40 text-[11px] tracking-widest uppercase">Cricket Store</div>
            </div> */}
            <Image src="/assets/papas_cricket.png" alt="PAPAS Cricket" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 pointer-events-none" />
          </div>

          {/* Text */}
          <div>
            <h2 className="text-white text-[14px] md:text-[16px] font-semibold tracking-[0.36px] uppercase mb-4">
              PAPAS 
            </h2>

            <div className={`overflow-hidden transition-all duration-400 ${expanded ? "max-h-[600px]" : "max-h-[120px]"}`}>
              <p className="text-white/80 text-[12px] leading-[1.8] mb-3">
                From the first net of the season to the biggest games on the calendar, PAPAS Cricket is where players, clubs and supporters come for the gear that shapes performance.
              </p>
              <p className="text-white/70 text-[12px] leading-[1.8] font-medium mb-2">
                Cricket has always been a game of fine margins.
              </p>
              <p className="text-white/70 text-[12px] leading-[1.8] mb-3">
                A fraction later on the pull shot. A touch fuller with the new ball. A clean take standing up to the stumps. The details decide everything, and that is exactly why the right kit matters. At PAPAS Cricket, we bring together the cricket equipment players actually trust, whether you are building an innings on a Saturday, grinding through winter nets, or watching the biggest tournaments with your own game in mind.
              </p>
              <p className="text-white/70 text-[12px] leading-[1.8]">
                This is a sport that asks a lot of you. Technique, patience, power, concentration, bravery. Your gear needs to keep up.
              </p>
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-[#f69a39] text-[12px] underline hover:no-underline transition-all"
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
