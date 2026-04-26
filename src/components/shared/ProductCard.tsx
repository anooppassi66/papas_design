"use client";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";

interface Props {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: Props) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group bg-white block overflow-hidden rounded-[3px] hover:shadow-lg transition-shadow duration-200 ${className}`}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Wishlist button */}
        <button
          className="absolute top-2 right-2 w-[26px] h-[26px] bg-white border border-[#dbdbdb] rounded-full flex items-center justify-center hover:bg-[#f69a39] group/heart transition-all duration-200 z-10 shadow-sm"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          aria-label="Add to wishlist"
        >
          <svg className="w-3 h-3 text-[#666] group-hover/heart:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Sale badge */}
        {product.discount && (
          <div className="absolute bottom-2 left-2 bg-white rounded-[1.5px] px-1.5 py-0.5 shadow-sm">
            <span className="text-[9px] font-medium text-[#1e1e21] tracking-[0.45px] uppercase">
              {product.discount}
            </span>
          </div>
        )}

        {/* New badge */}
        {product.badge === "NEW" && (
          <div className="absolute top-2 left-2 bg-[#f69a39] rounded-[1.5px] px-1.5 py-0.5">
            <span className="text-[9px] font-bold text-white tracking-[0.45px] uppercase">NEW</span>
          </div>
        )}
      </div>

      <div className="p-3">
        {/* Product name */}
        <h3 className="text-black text-[12px] font-medium leading-tight mb-1.5 line-clamp-2 min-h-[30px]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-2.5 h-2.5 ${star <= Math.floor(product.rating) ? "text-[#f69a39]" : "text-gray-200"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[9px] text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-[#f69a39] text-[13px] font-semibold">${product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-[#999] text-[11px] line-through">${product.originalPrice}</span>
          )}
        </div>

        {/* Brand */}
        <p className="text-[10px] text-[#888] mt-1 uppercase tracking-wide">{product.brand}</p>
      </div>
    </Link>
  );
}
