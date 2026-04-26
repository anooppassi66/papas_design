"use client";
import Image from "next/image";
import Link from "next/link";
import { OTHER_DEPARTMENTS } from "@/lib/data";

export default function OtherDepartments() {
  return (
    <section className="bg-[#1a1a1a] py-8 md:py-10">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[41px]">
        <h2 className="text-white text-[16px] md:text-[18px] font-semibold tracking-[0.36px] uppercase mb-6">
          Other Departments
        </h2>

        {/* Desktop 5-column */}
        <div className="hidden md:grid grid-cols-5 gap-4">
          {OTHER_DEPARTMENTS.map((dept) => (
            <DeptItem key={dept.id} dept={dept} />
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="md:hidden flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
          {OTHER_DEPARTMENTS.map((dept) => (
            <div key={dept.id} className="snap-start flex-shrink-0 w-[55vw]">
              <DeptItem dept={dept} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeptItem({ dept }: { dept: (typeof OTHER_DEPARTMENTS)[0] }) {
  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-[3px] mb-3" style={{ aspectRatio: "262/190" }}>
        <Image
          src={dept.image}
          alt={dept.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-400"
        />
      </div>
      <h3 className="text-white text-[12px] font-semibold tracking-[0.84px] uppercase mb-2">
        {dept.name}
      </h3>
      <div className="flex items-center gap-4">
        {dept.links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-white text-[11px] font-medium border-b border-white/50 hover:border-white pb-0.5 tracking-[0.45px] uppercase transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
