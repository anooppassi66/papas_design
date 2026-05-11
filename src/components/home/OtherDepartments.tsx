"use client";
import Image from "next/image";
import Link from "next/link";

interface DeptLink { label: string; href: string; }
interface Dept { id: number; name: string; image: string; links: DeptLink[]; }

interface Props { departments: Dept[]; }

const GRADIENTS = [
  "from-[#1a3a2a] to-[#0d1f15]",
  "from-[#1a1a3a] to-[#0d0d1f]",
  "from-[#2a1a10] to-[#150d08]",
  "from-[#3a1a1a] to-[#1f0d0d]",
  "from-[#1a2a3a] to-[#0d151f]",
];

export default function OtherDepartments({ departments }: Props) {
  return (
    <section className="bg-[#1a1a1a] py-8 md:py-10">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[41px]">
        <h2 className="text-white text-[16px] md:text-[18px] font-semibold tracking-[0.36px] uppercase mb-6">
          Other Departments
        </h2>

        <div className="hidden md:grid grid-cols-5 gap-4">
          {departments.map((dept, i) => <DeptItem key={dept.id} dept={dept} gradientIdx={i} />)}
        </div>

        <div className="md:hidden flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
          {departments.map((dept, i) => (
            <div key={dept.id} className="snap-start flex-shrink-0 w-[55vw]">
              <DeptItem dept={dept} gradientIdx={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeptItem({ dept, gradientIdx }: { dept: Dept; gradientIdx: number }) {
  const gradient = GRADIENTS[gradientIdx % GRADIENTS.length];
  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-[3px] mb-3" style={{ aspectRatio: "262/190" }}>
        {dept.image ? (
          <Image
            src={dept.image}
            alt={dept.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-400"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-400`}>
            <span className="text-white/30 text-[11px] tracking-[2px] uppercase font-semibold text-center px-2">
              {dept.name}
            </span>
          </div>
        )}
      </div>
      <h3 className="text-white text-[12px] font-semibold tracking-[0.84px] uppercase mb-2">{dept.name}</h3>
      <div className="flex items-center gap-4">
        {dept.links.map(link => (
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
