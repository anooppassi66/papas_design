"use client";
import Image from "next/image";
import Link from "next/link";

interface FeaturedProduct { id: number; name: string; slug: string; sell_price: number; image: string | null; }
interface FeaturedBrand {
  id: number;
  brand_name: string;
  brand_image: string | null;
  products: FeaturedProduct[];
}

interface Props { brand: FeaturedBrand; }

export default function FeaturedProductsSection({ brand }: Props) {
  return (
    <section className="bg-black">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Left: brand image or fallback */}
          <div className="hidden md:block w-[50%] relative min-h-[700px]">
            <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
              {brand.brand_image ? (
                <Image
                  src={brand.brand_image}
                  alt={brand.brand_name}
                  fill
                  className="object-contain p-12"
                />
              ) : (
                <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] w-full h-full flex items-center justify-center">
                  <div className="text-center px-8">
                    <div className="text-[#f69a39] text-[64px] font-black leading-none mb-2">🏏</div>
                    <div className="text-white text-[18px] font-semibold tracking-widest uppercase">{brand.brand_name}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: products */}
          <div className="flex-1 px-4 md:px-10 py-8">
            <div className="text-center mb-6">
              <h2 className="text-white text-[22px] md:text-[26px] font-semibold tracking-[0.54px] uppercase">
                {brand.brand_name}
              </h2>
              <p className="text-white/70 text-[13px] mt-2 leading-relaxed max-w-[500px] mx-auto">
                Engineered for aggressive stroke play and dynamic performance. Crafted for players who dominate the game with total confidence at the crease.
              </p>
            </div>

            {brand.products.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {brand.products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-center text-sm py-12">No products found for this brand.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: FeaturedProduct }) {
  return (
    <Link href={`/products/${product.slug}`} className="group bg-white block overflow-hidden rounded-[3px]">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-400"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <button
          className="absolute top-2 right-2 w-[22px] h-[22px] bg-white border border-[#dbdbdb] rounded-full flex items-center justify-center hover:bg-[#f69a39] group/heart transition-colors z-10"
          onClick={e => e.preventDefault()}
          aria-label="Add to wishlist"
        >
          <svg className="w-3 h-3 text-[#666] group-hover/heart:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="p-3">
        <p className="text-black text-[11px] font-medium leading-tight mb-1.5 line-clamp-2">{product.name}</p>
        <span className="text-[#f69a39] text-[12px] font-medium">${Number(product.sell_price).toFixed(2)}</span>
      </div>
    </Link>
  );
}
