"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UPLOADS, addToCart, getUser, isLoggedIn, customerApi } from "@/lib/customerApi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

interface Variant { id: number; size: string; color: string; sku: string; actual_price: number; selling_price: number; offer_price: number | null; total_stock: number; parent_stock: number; }
interface Review { id: number; rating: number; title: string; body: string; reviewer_name: string; is_verified_purchase: boolean; created_at: string; }
interface RelatedProduct { id: number; name: string; slug: string; image: string | null; brand_name: string; sell_price: number; }
interface Product {
  id: number; name: string; slug: string; description: string; images: string[];
  brand_name: string; brand_id: number; category_id: string; sell_price: number;
  avg_rating: number; rating_count: number; variants: Variant[]; reviews: Review[]; related: RelatedProduct[];
}

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`${sz} ${s <= Math.round(rating) ? "text-[#f69a39]" : "text-[#e0e0e0]"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API}/customer/products/${slug}`)
      .then((r) => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then((data: Product | null) => {
        if (!data) return;
        setProduct(data);
        setReviews(data.reviews || []);
        if (data.variants?.length) setSelectedVariant(data.variants[0]);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      document.getElementById("variant-picker")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    addToCart({
      product_id: product.id,
      product_variant_id: selectedVariant.id,
      product_name: product.name,
      product_slug: product.slug,
      product_image: product.images[0] || null,
      brand_name: product.brand_name,
      variant_size: selectedVariant.size || "",
      variant_color: selectedVariant.color || "",
      unit_price: selectedVariant.offer_price || selectedVariant.selling_price || product.sell_price,
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn()) { window.location.href = "/account"; return; }
    setReviewSubmitting(true);
    try {
      await customerApi.post("/reviews", { product_id: product?.id, rating: reviewRating, title: reviewTitle, body: reviewBody });
      setReviewSuccess(true);
      setShowReviewForm(false);
      const refreshed = await fetch(`${API}/customer/products/${slug}/reviews`).then((r) => r.json());
      setReviews(refreshed);
    } catch { /* ignore */ }
    finally { setReviewSubmitting(false); }
  };

  const scrollThumb = (dir: "up" | "down") => {
    galleryRef.current?.scrollBy({ top: dir === "down" ? 200 : -200, behavior: "smooth" });
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#f69a39] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound || !product) return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center text-center px-4">
      <div><h1 className="text-[24px] font-semibold text-[#1e1e21] mb-2">Product not found</h1>
      <Link href="/products" className="text-[#f69a39] underline text-[14px]">Browse all products</Link></div>
    </div>
  );

  const allImages = product.images.length ? product.images.map((img) => img.startsWith("/uploads/") ? `${UPLOADS}${img}` : img) : ["/placeholder-product.jpg"];
  const offerPrice = selectedVariant?.offer_price ?? null;
  const price = offerPrice ?? selectedVariant?.selling_price ?? product.sell_price ?? 0;
  const originalPrice = offerPrice ? (selectedVariant?.selling_price || product.sell_price || 0) : null;
  const discountPct = offerPrice && originalPrice ? Math.round((1 - offerPrice / originalPrice) * 100) : null;
  const inStock = (selectedVariant?.total_stock ?? 0) > 0;
  const uniqueSizes = Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean)));
  const uniqueColors = Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean)));

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[#fafafa] border-b border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-2.5">
          <nav className="flex items-center gap-1.5 text-[11px] text-[#888] flex-wrap">
            <Link href="/" className="hover:text-[#f69a39] transition-colors">Home</Link>
            <span className="text-[#ccc]">/</span>
            <Link href="/products" className="hover:text-[#f69a39] transition-colors">Products</Link>
            <span className="text-[#ccc]">/</span>
            <span className="text-[#1e1e21] font-medium truncate max-w-[200px] md:max-w-none">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row min-h-[680px]">

          {/* Gallery */}
          <div className="flex-1 lg:max-w-[calc(100%-390px)] relative bg-[#f7f7f7]">
            <div className="flex h-full">
              {/* Thumbnails */}
              <div className="hidden lg:flex flex-col items-center w-[80px] pt-4 pb-4 relative">
                <button onClick={() => scrollThumb("up")} className="w-6 h-6 flex items-center justify-center text-[#aaa] hover:text-[#1e1e21] mb-2 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                </button>
                <div ref={galleryRef} className="flex flex-col gap-2 overflow-y-auto flex-1 w-full px-2 scrollbar-hide">
                  {allImages.map((img, idx) => (
                    <button key={idx} onClick={() => setSelectedImage(idx)}
                      className={`relative aspect-square w-full rounded-[3px] overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === idx ? "border-[#f69a39]" : "border-transparent hover:border-[#ccc]"}`}>
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
                <button onClick={() => scrollThumb("down")} className="w-6 h-6 flex items-center justify-center text-[#aaa] hover:text-[#1e1e21] mt-2 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7 7 7" /></svg>
                </button>
              </div>

              {/* Main image */}
              <div className="relative flex-1">
                <div className="sticky top-0 h-screen max-h-[680px] bg-[#f7f7f7]">
                  <div className="relative w-full h-full">
                    <Image src={allImages[selectedImage]} alt={product.name} fill className="object-contain p-6" priority sizes="(max-width:1024px) 100vw, 60vw" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile thumbnail strip */}
            <div className="lg:hidden flex gap-2 overflow-x-auto px-4 pb-4 scrollbar-hide">
              {allImages.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-[3px] overflow-hidden border-2 ${selectedImage === idx ? "border-[#f69a39]" : "border-[#e5e5e5]"}`}>
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product info panel */}
          <div className="w-full lg:w-[390px] flex-shrink-0 px-5 md:px-8 py-6 lg:py-8 lg:overflow-y-auto">
            <p className="text-[11px] font-semibold text-[#f69a39] uppercase tracking-[0.08em] mb-1">{product.brand_name}</p>
            <h1 className="text-[20px] md:text-[22px] font-semibold text-[#1e1e21] leading-snug mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <Stars rating={product.avg_rating} />
              <span className="text-[12px] text-[#888]">{product.avg_rating > 0 ? `${product.avg_rating} (${product.rating_count} reviews)` : "No reviews yet"}</span>
            </div>

            {/* Price */}
            <div className="mb-5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-[28px] font-bold text-[#1e1e21]">${Number(price).toFixed(2)}</span>
                {originalPrice && (
                  <span className="text-[18px] text-[#aaa] line-through">${Number(originalPrice).toFixed(2)}</span>
                )}
                {discountPct && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-[11px] font-bold rounded-full">
                    {discountPct}% OFF
                  </span>
                )}
                <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${inStock ? "text-green-700 bg-green-50" : "text-red-600 bg-red-50"}`}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              {originalPrice && (
                <p className="text-[12px] text-green-600 font-medium mt-1">
                  You save ${(Number(originalPrice) - Number(price)).toFixed(2)}
                </p>
              )}
            </div>

            {/* Variant picker */}
            <div id="variant-picker" className="space-y-4 mb-5">
              {uniqueColors.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-2">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueColors.map((color) => (
                      <button key={color} onClick={() => {
                        const v = product.variants.find((pv) => pv.color === color && (!selectedVariant?.size || pv.size === selectedVariant.size));
                        if (v) setSelectedVariant(v);
                      }}
                        className={`px-3 py-1.5 border-2 rounded-[3px] text-[12px] font-medium transition-all ${selectedVariant?.color === color ? "border-[#f69a39] bg-[#f69a39] text-white" : "border-[#e5e5e5] text-[#444] hover:border-[#f69a39]"}`}>
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {uniqueSizes.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSizes.map((size) => {
                      const v = product.variants.find((pv) => pv.size === size);
                      const outOfStock = !v || v.total_stock === 0;
                      return (
                        <button key={size} onClick={() => { if (v) setSelectedVariant(v); }} disabled={outOfStock}
                          className={`w-14 py-2 border-2 rounded-[3px] text-[12px] font-medium transition-all ${selectedVariant?.size === size ? "border-[#f69a39] bg-[#f69a39] text-white" : outOfStock ? "border-[#e5e5e5] text-[#ccc] cursor-not-allowed line-through" : "border-[#e5e5e5] text-[#444] hover:border-[#f69a39]"}`}>
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-[#e5e5e5] rounded-[3px]">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-[#888] hover:text-[#1e1e21] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                </button>
                <span className="w-10 text-center text-[14px] font-semibold text-[#1e1e21]">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="w-10 h-10 flex items-center justify-center text-[#888] hover:text-[#1e1e21] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
              <button onClick={handleAddToCart} disabled={!inStock}
                className={`flex-1 py-3 font-semibold text-[13px] uppercase tracking-[0.5px] rounded-[3px] transition-all ${addedToCart ? "bg-green-600 text-white" : !inStock ? "bg-[#e5e5e5] text-[#aaa] cursor-not-allowed" : "bg-[#f69a39] text-white hover:bg-[#e8880d]"}`}>
                {addedToCart ? "✓ Added to Cart" : inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <button onClick={() => setWishlisted(!wishlisted)} className={`w-11 h-11 flex items-center justify-center border-2 rounded-[3px] transition-all ${wishlisted ? "border-[#f69a39] text-[#f69a39]" : "border-[#e5e5e5] text-[#888] hover:border-[#f69a39]"}`}>
                <svg className="w-5 h-5" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>

            <Link href="/cart" className="block w-full py-3 border-2 border-[#1e1e21] text-[#1e1e21] text-[13px] font-semibold uppercase tracking-[0.5px] rounded-[3px] hover:bg-[#1e1e21] hover:text-white transition-all text-center mb-6">
              View Cart / Checkout
            </Link>

            {/* Tabs */}
            <div className="border-t border-[#f0f0f0]">
              <div className="flex gap-0 border-b border-[#f0f0f0]">
                {(["description", "reviews"] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-[12px] font-semibold uppercase tracking-[0.5px] transition-colors border-b-2 -mb-[1px] capitalize ${activeTab === tab ? "border-[#f69a39] text-[#f69a39]" : "border-transparent text-[#888] hover:text-[#1e1e21]"}`}>
                    {tab} {tab === "reviews" && reviews.length > 0 && `(${reviews.length})`}
                  </button>
                ))}
              </div>

              {activeTab === "description" ? (
                <div className="py-4 text-[13px] text-[#444] leading-relaxed">{product.description || "No description available."}</div>
              ) : (
                <div className="py-4 space-y-4">
                  {reviewSuccess && <div className="p-3 bg-green-50 text-green-700 rounded text-[12px]">Review submitted! Thank you.</div>}
                  {reviews.length === 0 ? (
                    <p className="text-[13px] text-[#888]">No reviews yet. Be the first to review this product.</p>
                  ) : (
                    reviews.map((r) => (
                      <div key={r.id} className="border-b border-[#f0f0f0] pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Stars rating={r.rating} />
                          {r.is_verified_purchase && <span className="text-[10px] text-green-600 font-semibold">Verified Purchase</span>}
                        </div>
                        {r.title && <p className="text-[13px] font-semibold text-[#1e1e21] mb-0.5">{r.title}</p>}
                        <p className="text-[12px] text-[#888]">by {r.reviewer_name} · {new Date(r.created_at).toLocaleDateString()}</p>
                        {r.body && <p className="text-[13px] text-[#444] mt-1">{r.body}</p>}
                      </div>
                    ))
                  )}

                  {!showReviewForm && !reviewSuccess && (
                    <button onClick={() => { if (!isLoggedIn()) { window.location.href = "/account"; return; } setShowReviewForm(true); }}
                      className="text-[12px] font-semibold text-[#f69a39] hover:underline">
                      {isLoggedIn() ? "+ Write a Review" : "Sign in to write a review"}
                    </button>
                  )}

                  {showReviewForm && (
                    <form onSubmit={handleReviewSubmit} className="space-y-3 bg-[#fafafa] rounded p-4 border border-[#f0f0f0]">
                      <div>
                        <p className="text-[11px] font-semibold text-[#888] mb-2">Your Rating</p>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map((s) => (
                            <button key={s} type="button" onClick={() => setReviewRating(s)}>
                              <svg className={`w-6 h-6 ${s <= reviewRating ? "text-[#f69a39]" : "text-[#ddd]"}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                      <input value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} placeholder="Review title (optional)" className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2 text-[12px] outline-none focus:border-[#f69a39]" />
                      <textarea value={reviewBody} onChange={(e) => setReviewBody(e.target.value)} placeholder="Your review..." rows={4} className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2 text-[12px] outline-none focus:border-[#f69a39] resize-none" />
                      <div className="flex gap-2">
                        <button type="submit" disabled={reviewSubmitting} className="px-5 py-2 bg-[#f69a39] text-white text-[12px] font-semibold rounded-[3px] hover:bg-[#e8880d] disabled:opacity-60">
                          {reviewSubmitting ? "Submitting…" : "Submit Review"}
                        </button>
                        <button type="button" onClick={() => setShowReviewForm(false)} className="px-4 py-2 text-[12px] text-[#888]">Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {product.related.length > 0 && (
        <div className="bg-[#f4f4f4] py-10">
          <div className="max-w-[1440px] mx-auto px-4 md:px-10">
            <h2 className="text-[16px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-5">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {product.related.map((p) => {
                const imgSrc = p.image ? (p.image.startsWith("/uploads/") ? `${UPLOADS}${p.image}` : p.image) : null;
                return (
                  <Link key={p.id} href={`/products/${p.slug}`} className="bg-white rounded-[4px] border border-[#e8e8e8] hover:border-[#f69a39] hover:shadow-md transition-all group block">
                    <div className="relative w-full aspect-square bg-[#f8f8f8] rounded-t-[4px] overflow-hidden">
                      {imgSrc ? <Image src={imgSrc} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="200px" /> : <div className="w-full h-full flex items-center justify-center text-3xl text-[#ddd]">🏏</div>}
                    </div>
                    <div className="p-2.5">
                      <p className="text-[10px] text-[#f69a39] font-semibold uppercase">{p.brand_name}</p>
                      <h3 className="text-[11px] font-medium text-[#1e1e21] line-clamp-2 mt-0.5 mb-1">{p.name}</h3>
                      <p className="text-[#f69a39] font-bold text-[13px]">${Number(p.sell_price || 0).toFixed(2)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
