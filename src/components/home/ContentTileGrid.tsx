"use client";
import Image from "next/image";
import Link from "next/link";

interface TileLink { label: string; href: string; }
interface Tile { id: number; name: string; image: string; links: TileLink[]; }

interface Props {
  title: string;
  tiles: Tile[];
  layout?: "4col" | "2col";
  dark?: boolean;
}

export default function ContentTileGrid({ title, tiles, layout = "4col", dark = true }: Props) {
  return (
    <section className={`py-6 md:py-8 ${dark ? "bg-black" : "bg-[#010101]"}`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-[42px]">
        <h2 className="text-white text-[16px] md:text-[18px] font-semibold tracking-[0.36px] uppercase mb-5">
          {title}
        </h2>

        {/* Desktop grid */}
        <div className={`hidden md:grid gap-3 ${layout === "4col" ? "grid-cols-4" : "grid-cols-2"}`}>
          {tiles.map((tile) => (
            <ContentTile key={tile.id} tile={tile} tall={layout === "4col"} />
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="md:hidden flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              className="snap-start flex-shrink-0"
              style={{ width: layout === "2col" ? "75vw" : "65vw" }}
            >
              <ContentTile tile={tile} tall={layout === "4col"} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContentTile({ tile, tall }: { tile: Tile; tall: boolean }) {
  return (
    <div className="relative group overflow-hidden rounded-[3px]" style={{ aspectRatio: tall ? "336/485" : "684/500" }}>
      {tile.image ? (
        <Image
          src={tile.image}
          alt={tile.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#1e1e21] to-[#333] flex items-center justify-center">
          <span className="text-white/20 text-[11px] tracking-[2px] uppercase font-semibold">{tile.name}</span>
        </div>
      )}
      {/* Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.65) 100%)",
        }}
      />
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white text-[12px] font-semibold tracking-[0.84px] uppercase mb-2">
          {tile.name}
        </h3>
        <div className="flex items-center gap-4">
          {tile.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white text-[11px] font-medium border-b border-white/60 hover:border-white pb-0.5 tracking-[0.45px] uppercase transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
