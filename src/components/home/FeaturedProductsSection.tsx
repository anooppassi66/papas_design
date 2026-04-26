"use client";
import Image from "next/image";
import Link from "next/link";
import { ASSETS, PRODUCTS } from "@/lib/data";

export default function FeaturedProductsSection() {
  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <section className="bg-black">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Left: sticky player image */}
          <div className="hidden md:block w-[50%] relative min-h-[700px]">
            <div className="sticky top-0 h-screen overflow-hidden">
              <Image
                src={ASSETS.playerImage}
                alt="Cricket player"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Right: products */}
          <div className="flex-1 px-4 md:px-10 py-8">
            <div className="text-center mb-6">
              <h2 className="text-white text-[22px] md:text-[26px] font-semibold tracking-[0.54px] uppercase">
                Gray-Nicolls Havoc
              </h2>
              <p className="text-white/70 text-[13px] mt-2 leading-relaxed max-w-[500px] mx-auto">
                Engineered for aggressive stroke play and dynamic performance. Crafted for players who dominate the game, Havoc offers unmatched power, strong presence, and total confidence at the crease.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: (typeof PRODUCTS)[0] }) {
  return (
    <Link href={`/products/${product.slug}`} className="group bg-white block overflow-hidden rounded-[3px]">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-400"
        />
        {/* Wishlist */}
        <button
          className="absolute top-2 right-2 w-[22px] h-[22px] bg-white border border-[#dbdbdb] rounded-full flex items-center justify-center hover:bg-[#f69a39] group/heart transition-colors z-10"
          onClick={(e) => e.preventDefault()}
          aria-label="Add to wishlist"
        >
          <svg className="w-3 h-3 text-[#666] group-hover/heart:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {/* Discount badge */}
        {product.discount && (
          <div className="absolute bottom-2 left-2 bg-white rounded-[1.5px] px-2 py-0.5">
            <span className="text-[9px] font-medium text-[#1e1e21] tracking-[0.45px] uppercase whitespace-nowrap">
              {product.discount}
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-black text-[11px] font-medium leading-tight mb-1.5 line-clamp-2">{product.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-[#f69a39] text-[12px] font-medium">${product.price}</span>
          <span className="text-[#1e1e21] text-[11px] line-through opacity-60">${product.originalPrice}</span>
        </div>
      </div>
    </Link>
  );
}
