"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, ASSETS } from "@/lib/data";
import ProductCard from "@/components/shared/ProductCard";

// ── Extra PDP images from Figma detailed product page ─────────────────────
const PDP_ASSETS = {
  mainImg:    "https://www.figma.com/api/mcp/asset/077d9d6d-b419-49cd-88ff-81286bbbdd2c",
  gallery1:   "https://www.figma.com/api/mcp/asset/84419d56-194f-4866-96c1-15a3818565e4",
  gallery2:   "https://www.figma.com/api/mcp/asset/98f45335-e8d3-4fc5-a88d-fc0a535f0737",
  mainThumb:  "https://www.figma.com/api/mcp/asset/9bffb990-4475-4166-8e64-27aade75c13e",
  trustStar1: "https://www.figma.com/api/mcp/asset/1299e69c-3b00-462a-9664-b22df798f90c",
  logoImg:    "https://www.figma.com/api/mcp/asset/3d7cb05e-7ef6-4f53-ae33-29902267fe31",
};

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find((p) => p.slug === params.slug) || PRODUCTS[0];
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 5);

  // Use product images + PDP gallery images combined
  const allImages = [
    product.image,
    PDP_ASSETS.mainImg,
    PDP_ASSETS.gallery1,
    PDP_ASSETS.gallery2,
    product.images[1] || product.image,
    product.images[2] || product.image,
  ];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "features" | "reviews">("description");
  const [descExpanded, setDescExpanded] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  const savings = product.originalPrice - product.price;
  const savingsPercent = Math.round((savings / product.originalPrice) * 100);

  const handleAddToCart = () => {
    if (!selectedSize) {
      // Flash the size section
      document.getElementById("size-picker")?.classList.add("ring-2", "ring-[#f69a39]");
      setTimeout(() => document.getElementById("size-picker")?.classList.remove("ring-2", "ring-[#f69a39]"), 1200);
      return;
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const scrollThumb = (dir: "up" | "down") => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ top: dir === "down" ? 200 : -200, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[#fafafa] border-b border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-2.5">
          <nav className="flex items-center gap-1.5 text-[11px] text-[#888] flex-wrap">
            <Link href="/" className="hover:text-[#f69a39] transition-colors">Home</Link>
            <span className="text-[#ccc]">/</span>
            <Link href="/cricket" className="hover:text-[#f69a39] transition-colors">Cricket</Link>
            <span className="text-[#ccc]">/</span>
            <Link href={`/cricket/${product.category.toLowerCase()}`} className="hover:text-[#f69a39] transition-colors capitalize">{product.category}</Link>
            <span className="text-[#ccc]">/</span>
            <span className="text-[#1e1e21] font-medium truncate max-w-[200px] md:max-w-none">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Main Product Grid ───────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row min-h-[680px]">

          {/* ═══ LEFT: Gallery ════════════════════════════════════════ */}
          <div className="flex-1 lg:max-w-[calc(100%-390px)] relative bg-[#f7f7f7]">
            <div className="flex h-full">

              {/* Thumbnails strip */}
              <div className="hidden lg:flex flex-col items-center w-[80px] pt-4 pb-4 relative">
                <button
                  onClick={() => scrollThumb("up")}
                  className="w-6 h-6 flex items-center justify-center text-[#aaa] hover:text-[#1e1e21] transition-colors mb-2 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>

                <div ref={galleryRef} className="flex flex-col gap-2 overflow-y-auto flex-1 w-full px-2 scrollbar-hide">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative aspect-square w-full rounded-[3px] overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImage === idx ? "border-[#f69a39] shadow-sm" : "border-transparent hover:border-[#ccc]"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => scrollThumb("down")}
                  className="w-6 h-6 flex items-center justify-center text-[#aaa] hover:text-[#1e1e21] transition-colors mt-2 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7 7 7" />
                  </svg>
                </button>
              </div>

              {/* Main image */}
              <div className="relative flex-1">
                <div className="sticky top-0 h-screen max-h-[680px] bg-[#f7f7f7]">
                  <div className="relative w-full h-full">
                    <Image
                      src={allImages[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-contain p-6"
                      priority
                    />
                    {/* Zoom icon */}
                    <button className="absolute bottom-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm border border-[#ddd] rounded-[3px] flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                      <svg className="w-4 h-4 text-[#555]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </button>
                    {/* Sale tag */}
                    {product.discount && (
                      <div className="absolute top-4 left-4 bg-[#f69a39] text-white text-[10px] font-bold tracking-wide px-2 py-1 rounded-[2px]">
                        -{savingsPercent}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile thumbnail row */}
                <div className="lg:hidden flex gap-2 p-3 overflow-x-auto scrollbar-hide">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-14 h-14 flex-shrink-0 rounded-[3px] overflow-hidden border-2 ${
                        selectedImage === idx ? "border-[#f69a39]" : "border-[#e5e5e5]"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ═══ RIGHT: Product Info Panel ════════════════════════════ */}
          <div className="w-full lg:w-[390px] flex-shrink-0 bg-black border-l border-[#1a1a1a]">
            <div className="p-6 lg:p-7 space-y-4">

              {/* Sale badge */}
              {product.discount && (
                <div className="inline-flex">
                  <span className="bg-[#1e1e1e] border border-[#f69a39]/30 text-[#f69a39] text-[10px] font-semibold tracking-[0.5px] uppercase px-2.5 py-1 rounded-[2px]">
                    {product.discount}
                  </span>
                </div>
              )}

              {/* Brand + Name */}
              <div>
                <Link href={`/brands/${product.brand.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-[11px] text-[#888] font-medium uppercase tracking-[0.84px] hover:text-[#f69a39] transition-colors">
                  {product.brand}
                </Link>
                <h1 className="text-white text-[18px] font-semibold leading-snug mt-1">
                  {product.name}
                </h1>
              </div>

              {/* Color selector */}
              {product.colors.length > 0 && (
                <p className="text-[#888] text-[11px]">
                  <span className="text-[#aaa] uppercase tracking-wide">Color: </span>
                  <span className="text-white">{selectedColor}</span>
                </p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-[#f69a39] text-[24px] font-bold">${product.price}.00</span>
                {product.originalPrice > product.price && (
                  <span className="text-[#666] text-[15px] line-through">${product.originalPrice}.00</span>
                )}
              </div>

              {/* Trustpilot micro */}
              <div className="flex items-center gap-3 bg-[#111] rounded-[3px] px-3 py-2">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-white font-medium">Excellent</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className="w-3 h-3 text-[#00b67a]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <Image src={PDP_ASSETS.logoImg} alt="Trustpilot" width={60} height={14} className="h-3.5 w-auto opacity-80" />
              </div>

              {/* Size picker */}
              <div id="size-picker" className="rounded-[3px] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#aaa] uppercase tracking-wide">Size</span>
                  <button className="text-[11px] text-[#f69a39] underline hover:no-underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] h-[30px] px-3 border rounded-[3px] text-[11px] font-medium transition-all ${
                        selectedSize === size
                          ? "border-[#f69a39] bg-[#f69a39] text-white"
                          : "border-[#333] text-[#aaa] hover:border-[#f69a39] hover:text-[#f69a39]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty + ATC */}
              <div className="flex gap-2">
                <div className="flex items-center border border-[#333] rounded-[40px] overflow-hidden bg-[#111]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-[38px] flex items-center justify-center text-white text-lg hover:text-[#f69a39] transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-[13px] font-medium text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-[38px] flex items-center justify-center text-white text-lg hover:text-[#f69a39] transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 h-[38px] rounded-[40px] text-[12px] font-semibold tracking-[0.5px] uppercase transition-all duration-200 border ${
                    addedToCart
                      ? "bg-[#1a9e50] border-[#1a9e50] text-white"
                      : selectedSize
                      ? "bg-[#f69a39] border-[#f69a39] text-white hover:bg-[#e8880d]"
                      : "bg-transparent border-[#f69a39] text-[#f69a39] hover:bg-[#f69a39] hover:text-white"
                  }`}
                >
                  {addedToCart ? "✓ Added!" : selectedSize ? "Add to Cart" : "Select Size"}
                </button>
              </div>

              {/* PayPal */}
              <div className="bg-[#111] rounded-[3px] px-3 py-2.5 text-[11px] text-[#aaa] leading-relaxed">
                <span className="text-white font-medium">PayPal</span>
                {" "}Pay in 3 interest-free payments of ${Math.round(product.price / 3)}.
                {" "}<span className="text-[#0070ba] underline cursor-pointer">Learn more</span>
              </div>

              {/* Hassle-free returns banner */}
              <div className="border border-[#f69a39]/40 rounded-[3px] px-3 py-3">
                <p className="text-white text-[12px] font-semibold mb-1">Hassle-Free Online Returns</p>
                <p className="text-[#888] text-[11px] leading-relaxed">
                  Shop with confidence with hassle-free ONLINE returns within 28 days of date of delivery.
                </p>
              </div>

              {/* Wishlist + wishlist count */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className={`flex items-center gap-2 text-[11px] font-medium transition-colors ${
                    wishlisted ? "text-[#f69a39]" : "text-[#888] hover:text-white"
                  }`}
                >
                  <svg className={`w-4 h-4 ${wishlisted ? "fill-[#f69a39] text-[#f69a39]" : ""}`} fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {wishlisted ? "Saved to wishlist" : "Add to wishlist"}
                </button>
              </div>

              {/* CTA ghost buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <button className="w-full border-2 border-white text-white text-[11px] font-semibold tracking-[0.45px] uppercase py-2.5 rounded-[40px] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  Product Reviews
                </button>
                <button className="w-full border-2 border-white text-white text-[11px] font-semibold tracking-[0.45px] uppercase py-2.5 rounded-[40px] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                  Customer Service
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Description Section ══════════════════════════════════════ */}
        <div className="bg-black border-t border-[#1a1a1a]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-8">

            {/* Tab bar */}
            <div className="flex gap-0 border-b border-[#222] mb-6">
              {(["description", "features", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.8px] border-b-2 transition-colors -mb-px ${
                    activeTab === tab
                      ? "border-[#f69a39] text-[#f69a39]"
                      : "border-transparent text-[#666] hover:text-[#aaa]"
                  }`}
                >
                  {tab === "reviews" ? `Reviews (${product.reviewCount})` : tab}
                </button>
              ))}
            </div>

            <div className="max-w-[900px]">
              {activeTab === "description" && (
                <div>
                  <div className={`overflow-hidden transition-all duration-300 ${descExpanded ? "max-h-[600px]" : "max-h-[80px]"}`}>
                    <p className="text-[#aaa] text-[13px] leading-[1.9]">{product.description}</p>
                  </div>
                  <button
                    onClick={() => setDescExpanded(!descExpanded)}
                    className="mt-3 text-[11px] font-semibold text-[#f69a39] uppercase tracking-[0.5px] underline hover:no-underline"
                  >
                    {descExpanded ? "Show less" : "See full features"}
                  </button>
                </div>
              )}

              {activeTab === "features" && (
                <ul className="space-y-3">
                  {product.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-[13px] text-[#aaa]">
                      <span className="text-[#f69a39] mt-0.5 flex-shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-5">
                  {/* Score summary */}
                  <div className="flex items-start gap-8 bg-[#111] rounded-[4px] p-5 border border-[#222]">
                    <div className="text-center flex-shrink-0">
                      <p className="text-[48px] font-bold text-white leading-none">{product.rating}</p>
                      <div className="flex justify-center gap-0.5 my-2">
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} className={`w-4 h-4 ${s <= Math.floor(product.rating) ? "text-[#f69a39]" : "text-[#333]"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                      <p className="text-[11px] text-[#666]">{product.reviewCount} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5,4,3,2,1].map(n => (
                        <div key={n} className="flex items-center gap-3">
                          <span className="text-[11px] text-[#666] w-8 text-right">{n}★</span>
                          <div className="flex-1 bg-[#222] rounded-full h-1.5 overflow-hidden">
                            <div className="bg-[#f69a39] h-full rounded-full transition-all duration-500" style={{ width: `${n===5?72:n===4?18:n===3?7:n===2?2:1}%` }} />
                          </div>
                          <span className="text-[10px] text-[#555] w-6">{n===5?72:n===4?18:n===3?7:n===2?2:1}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample reviews */}
                  {[
                    { name: "Ravi S.", title: "Excellent quality bat!", body: "Amazing bat – absolutely loved the sweet spot. Played my first century with this. Delivery was fast and packaging was excellent. Highly recommend!", rating: 5, date: "April 2025", verified: true },
                    { name: "James T.", title: "Great value for money", body: "Solid construction and feels great in the hand. The balance is perfect for my style of play. Delivery was really quick too.", rating: 4, date: "March 2025", verified: true },
                  ].map((review) => (
                    <div key={review.name} className="border border-[#222] rounded-[4px] p-4 hover:border-[#333] transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-white text-[13px] font-semibold">{review.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(s=>(
                                <svg key={s} className={`w-3 h-3 ${s<=review.rating?"text-[#f69a39]":"text-[#333]"}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                              ))}
                            </div>
                            {review.verified && <span className="text-[10px] text-[#1a9e50] font-medium">✓ Verified Purchase</span>}
                          </div>
                        </div>
                        <p className="text-[11px] text-[#555] flex-shrink-0 ml-4">{review.date}</p>
                      </div>
                      <p className="text-[#888] text-[13px] leading-relaxed">{review.body}</p>
                      <p className="text-[11px] text-[#555] mt-2 font-medium">— {review.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ You May Also Like ═════════════════════════════════════════ */}
        <div className="bg-white border-t border-[#f0f0f0] py-8 md:py-10">
          <div className="max-w-[1440px] mx-auto px-4 md:px-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-semibold text-[#1e1e21] uppercase tracking-[0.8px]">
                You May Also Like
              </h2>
              <Link href="/products" className="text-[11px] text-[#f69a39] font-semibold uppercase tracking-wide hover:underline">
                View All →
              </Link>
            </div>

            {/* Desktop 5-col / Mobile 2-col */}
            <div className="hidden md:grid grid-cols-5 gap-3">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="md:hidden flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
              {relatedProducts.map((p) => (
                <div key={p.id} className="snap-start flex-shrink-0 w-[60vw]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Sticky ATC Bar ────────────────────────────────────── */}
      <div className="mobile-atc-bar lg:hidden">
        <div className="flex flex-col min-w-0">
          <p className="text-[11px] font-medium text-[#1e1e21] truncate leading-tight">{product.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[#f69a39] text-[14px] font-bold">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-[#aaa] text-[11px] line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          className={`flex-shrink-0 h-11 px-5 rounded-[40px] text-[12px] font-semibold tracking-[0.5px] uppercase transition-all ${
            addedToCart
              ? "bg-[#1a9e50] text-white"
              : "bg-[#f69a39] text-white hover:bg-[#e8880d]"
          }`}
        >
          {addedToCart ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
