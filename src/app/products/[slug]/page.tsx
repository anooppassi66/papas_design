"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UPLOADS, addToCart, isLoggedIn, customerApi, CartService, CartAddon } from "@/lib/customerApi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

interface Variant { id: number; size: string; color: string; sku: string; actual_price: number; selling_price: number; offer_price: number | null; total_stock: number; parent_stock: number; }
interface Review { id: number; rating: number; title: string; body: string; reviewer_name: string; is_verified_purchase: boolean; created_at: string; }
interface RelatedProduct { id: number; name: string; slug: string; image: string | null; brand_name: string; sell_price: number; }
interface ServiceItem { id: number; name: string; price: number; }
interface ServiceGroup { id: number | null; name: string; items: ServiceItem[]; }
interface AddonItem { id: number; name: string; price: number; }
interface Product {
  id: number; name: string; slug: string; description: string; images: string[];
  brand_name: string; brand_id: number; category_id: string; sell_price: number;
  avg_rating: number; rating_count: number; variants: Variant[]; reviews: Review[]; related: RelatedProduct[];
  services: ServiceGroup[]; addons: AddonItem[];
}

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`${sz} ${s <= Math.round(rating) ? "text-white" : "text-[#444]"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

type InfoTab = "description" | "returns" | "shipping";

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
  const [activeTab, setActiveTab] = useState<InfoTab>("description");

  const [selectedServices, setSelectedServices] = useState<Record<number, number | null>>({});
  const [selectedAddons, setSelectedAddons] = useState<Set<number>>(new Set());

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API}/customer/products/${slug}`)
      .then(r => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then((data: Product | null) => {
        if (!data) return;
        setProduct(data);
        setReviews(data.reviews || []);
        if (data.variants?.length) setSelectedVariant(data.variants[0]);
        const init: Record<number, number | null> = {};
        (data.services || []).forEach(g => { if (g.id !== null) init[g.id] = null; });
        setSelectedServices(init);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      document.getElementById("variant-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const chosenServices: CartService[] = [];
    for (const [gidStr, sid] of Object.entries(selectedServices)) {
      if (!sid) continue;
      const g = product.services.find(g => g.id === Number(gidStr));
      const item = g?.items.find(i => i.id === sid);
      if (item && g) chosenServices.push({ id: item.id, name: item.name, price: item.price, category_name: g.name });
    }
    const chosenAddons: CartAddon[] = Array.from(selectedAddons).map(aid => {
      const a = product.addons.find(a => a.id === aid)!;
      return { id: a.id, name: a.name, price: a.price };
    });
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
      services: chosenServices.length ? chosenServices : undefined,
      addons: chosenAddons.length ? chosenAddons : undefined,
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
      const refreshed = await fetch(`${API}/customer/products/${slug}/reviews`).then(r => r.json());
      setReviews(refreshed);
    } catch { /* ignore */ }
    finally { setReviewSubmitting(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound || !product) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-2xl font-bold text-white mb-3">Product not found</h1>
        <Link href="/products" className="text-sm text-[#aaa] underline underline-offset-4 hover:text-white transition-colors">Browse all products</Link>
      </div>
    </div>
  );

  const allImages = product.images.length
    ? product.images.map(img => img.startsWith("/uploads/") ? `${UPLOADS}${img}` : img)
    : ["/placeholder-product.jpg"];

  const offerPrice = selectedVariant?.offer_price ?? null;
  const price = offerPrice ?? selectedVariant?.selling_price ?? product.sell_price ?? 0;
  const originalPrice = offerPrice ? (selectedVariant?.selling_price || product.sell_price || 0) : null;
  const savePct = offerPrice && originalPrice ? Math.round((1 - offerPrice / originalPrice) * 100) : null;
  const inStock = (selectedVariant?.total_stock ?? 0) > 0;
  const uniqueSizes = Array.from(new Set(product.variants.map(v => v.size).filter(Boolean)));
  const uniqueColors = Array.from(new Set(product.variants.map(v => v.color).filter(Boolean)));

  const serviceExtra = Object.entries(selectedServices).reduce((sum, [gid, sid]) => {
    if (!sid) return sum;
    const g = product.services.find(g => g.id === Number(gid));
    const item = g?.items.find(i => i.id === sid);
    return sum + (item?.price || 0);
  }, 0);
  const addonExtra = Array.from(selectedAddons).reduce((sum, aid) => {
    const a = product.addons.find(a => a.id === aid);
    return sum + (a?.price || 0);
  }, 0);
  const totalExtra = serviceExtra + addonExtra;

  const TABS: { id: InfoTab; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "returns", label: "Returns & Refunds" },
    { id: "shipping", label: "Shipping" },
  ];

  return (
    <div className="bg-black min-h-screen">

      {/* Breadcrumb */}
      <div className="border-b border-[#1f1f1f]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-[11px] text-[#555] flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            <span>/</span>
            <span className="text-[#aaa] font-medium truncate max-w-[220px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── LEFT: Gallery ── */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square bg-[#111] rounded overflow-hidden border border-[#222]">
              <Image src={allImages[selectedImage]} alt={product.name} fill
                className="object-contain p-6" priority sizes="(max-width:1024px) 100vw, 50vw" />
              {savePct && (
                <div className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-sm">
                  SAVE {savePct}%
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div ref={thumbRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)}
                    className={`relative w-[72px] h-[72px] flex-shrink-0 rounded border-2 overflow-hidden transition-all ${selectedImage === idx ? "border-white" : "border-[#2a2a2a] hover:border-[#555]"}`}>
                    <Image src={img} alt="" fill className="object-cover" sizes="72px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Info ── */}
          <div className="flex flex-col gap-0">
            {/* Brand */}
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#666] mb-2">{product.brand_name}</p>

            {/* Name */}
            <h1 className="text-[22px] md:text-[26px] font-bold text-white leading-tight mb-4">{product.name}</h1>

            {/* Rating */}
            {product.avg_rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Stars rating={product.avg_rating} />
                <span className="text-[12px] text-[#555]">{product.avg_rating} ({product.rating_count} {product.rating_count === 1 ? "review" : "reviews"})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap mb-1">
              <span className="text-[30px] font-bold text-white">${Number(price + totalExtra).toFixed(2)}</span>
              {originalPrice && <span className="text-[18px] text-[#444] line-through">${Number(originalPrice).toFixed(2)}</span>}
              {!inStock && <span className="text-[11px] font-semibold text-red-400 bg-red-950/60 border border-red-900/40 px-2 py-0.5 rounded">Out of Stock</span>}
              {inStock && <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-900/40 px-2 py-0.5 rounded">In Stock</span>}
            </div>
            {originalPrice && (
              <p className="text-[12px] text-emerald-500 font-medium mb-4">
                You save ${(Number(originalPrice) - Number(price)).toFixed(2)}
              </p>
            )}
            {!originalPrice && <div className="mb-4" />}

            <div className="border-t border-[#1f1f1f] mb-5" />

            {/* Variants */}
            <div id="variant-section" className="space-y-4 mb-5">
              {uniqueColors.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#555] mb-2">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueColors.map(color => (
                      <button key={color}
                        onClick={() => {
                          const v = product.variants.find(pv => pv.color === color && (!selectedVariant?.size || pv.size === selectedVariant.size));
                          if (v) setSelectedVariant(v);
                        }}
                        className={`px-4 py-2 border text-[12px] font-medium transition-all rounded-sm ${selectedVariant?.color === color ? "border-white bg-white text-black" : "border-[#333] text-[#aaa] hover:border-[#777] hover:text-white"}`}>
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {uniqueSizes.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#555] mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSizes.map(size => {
                      const v = product.variants.find(pv => pv.size === size);
                      const oos = !v || v.total_stock === 0;
                      return (
                        <button key={size} onClick={() => { if (v) setSelectedVariant(v); }} disabled={oos}
                          className={`px-4 py-2 border text-[12px] font-medium transition-all rounded-sm ${selectedVariant?.size === size ? "border-white bg-white text-black" : oos ? "border-[#222] text-[#3a3a3a] cursor-not-allowed line-through" : "border-[#333] text-[#aaa] hover:border-[#777] hover:text-white"}`}>
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Services */}
            {product.services && product.services.length > 0 && (
              <div className="space-y-3 mb-5">
                {product.services.map(group => (
                  <div key={group.id ?? "svc"}>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#555] mb-1.5">{group.name}</label>
                    <select
                      value={selectedServices[group.id ?? 0] ?? ""}
                      onChange={e => {
                        const val = e.target.value ? Number(e.target.value) : null;
                        setSelectedServices(prev => ({ ...prev, [group.id ?? 0]: val }));
                      }}
                      className="w-full bg-[#111] border border-[#2a2a2a] rounded-sm px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#555] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">None</option>
                      {group.items.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} (+${Number(item.price).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {/* Addons */}
            {product.addons && product.addons.length > 0 && (
              <div className="mb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#555] mb-2">Add-ons</p>
                <div className="space-y-2">
                  {product.addons.map(addon => (
                    <label key={addon.id} className="flex items-center gap-3 cursor-pointer group py-1">
                      <input type="checkbox" checked={selectedAddons.has(addon.id)}
                        onChange={() => {
                          const s = new Set(selectedAddons);
                          s.has(addon.id) ? s.delete(addon.id) : s.add(addon.id);
                          setSelectedAddons(s);
                        }}
                        className="w-4 h-4 accent-white flex-shrink-0" />
                      <span className="text-[13px] text-[#aaa] group-hover:text-white transition-colors flex-1">{addon.name}</span>
                      <span className="text-[13px] font-semibold text-white">+${Number(addon.price).toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add to Cart */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center border border-[#2a2a2a] rounded-sm bg-[#0a0a0a]">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-11 flex items-center justify-center text-[#555] hover:text-white transition-colors text-lg">−</button>
                <span className="w-10 text-center text-[14px] font-semibold text-white">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-11 flex items-center justify-center text-[#555] hover:text-white transition-colors text-lg">+</button>
              </div>
              <button onClick={handleAddToCart} disabled={!inStock}
                className={`flex-1 h-11 font-semibold text-[13px] uppercase tracking-[0.06em] rounded-sm transition-all ${addedToCart ? "bg-emerald-600 text-white" : !inStock ? "bg-[#1a1a1a] text-[#444] cursor-not-allowed" : "bg-white text-black hover:bg-[#e0e0e0]"}`}>
                {addedToCart ? "✓ Added to Cart" : inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>

            <Link href="/cart"
              className="block w-full h-11 border border-[#333] text-[#aaa] text-[13px] font-semibold uppercase tracking-[0.06em] rounded-sm hover:border-white hover:text-white transition-all text-center leading-[44px] mb-6">
              View Cart / Checkout
            </Link>

            {selectedVariant?.sku && (
              <p className="text-[11px] text-[#3a3a3a]">SKU: {selectedVariant.sku}</p>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-12 border-t border-[#1f1f1f]">
          <div className="flex gap-0 border-b border-[#1f1f1f]">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.06em] border-b-2 -mb-[1px] transition-colors ${activeTab === tab.id ? "border-white text-white" : "border-transparent text-[#555] hover:text-[#aaa]"}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="py-8 max-w-[720px]">
            {activeTab === "description" && (
              <div className="text-[14px] text-[#aaa] leading-7 whitespace-pre-line">
                {product.description || "No description available."}
              </div>
            )}
            {activeTab === "returns" && (
              <div className="text-[14px] text-[#aaa] leading-7 space-y-3">
                <p>We accept returns within 30 days of purchase for unused, undamaged items in their original packaging.</p>
                <p>To initiate a return, please contact our support team with your order number. Return shipping costs are the responsibility of the customer unless the item is faulty or incorrectly sent.</p>
                <p>Refunds are processed within 5–7 business days of receiving the returned item.</p>
              </div>
            )}
            {activeTab === "shipping" && (
              <div className="text-[14px] text-[#aaa] leading-7 space-y-3">
                <p>Orders are processed within 1–2 business days. Delivery times vary by location:</p>
                <ul className="list-disc list-inside space-y-1 text-[#888]">
                  <li>Australia: 3–7 business days</li>
                  <li>New Zealand: 5–10 business days</li>
                  <li>International: 7–21 business days</li>
                </ul>
                <p>All orders are shipped with tracking. You will receive a tracking number via email once your order has been dispatched.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Reviews ── */}
        <div className="border-t border-[#1f1f1f] pt-10 pb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[16px] font-bold text-white uppercase tracking-wide">
              Customer Reviews {reviews.length > 0 && <span className="font-normal text-[#555] text-[13px] normal-case">({reviews.length})</span>}
            </h2>
            {!showReviewForm && !reviewSuccess && (
              <button onClick={() => { if (!isLoggedIn()) { window.location.href = "/account"; return; } setShowReviewForm(true); }}
                className="text-[12px] font-semibold text-white border border-[#333] px-4 py-2 rounded-sm hover:bg-white hover:text-black transition-all">
                {isLoggedIn() ? "Write a Review" : "Sign in to Review"}
              </button>
            )}
          </div>

          {reviewSuccess && <div className="mb-4 px-4 py-3 bg-emerald-950/60 border border-emerald-900/40 text-emerald-400 text-[13px] rounded">Review submitted — thank you!</div>}

          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mb-8 border border-[#222] rounded bg-[#0d0d0d] p-5 space-y-4 max-w-[560px]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#555] mb-2">Your Rating</p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setReviewRating(s)}>
                      <svg className={`w-6 h-6 ${s <= reviewRating ? "text-white" : "text-[#333]"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <input value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} placeholder="Review title (optional)"
                className="w-full bg-[#111] border border-[#2a2a2a] rounded-sm px-3 py-2.5 text-[13px] text-white placeholder-[#444] outline-none focus:border-[#555] transition-colors" />
              <textarea value={reviewBody} onChange={e => setReviewBody(e.target.value)} placeholder="Your review…" rows={4}
                className="w-full bg-[#111] border border-[#2a2a2a] rounded-sm px-3 py-2.5 text-[13px] text-white placeholder-[#444] outline-none focus:border-[#555] resize-none transition-colors" />
              <div className="flex gap-2">
                <button type="submit" disabled={reviewSubmitting}
                  className="px-5 py-2.5 bg-white text-black text-[12px] font-semibold rounded-sm hover:bg-[#e0e0e0] disabled:opacity-40 transition-colors">
                  {reviewSubmitting ? "Submitting…" : "Submit Review"}
                </button>
                <button type="button" onClick={() => setShowReviewForm(false)} className="px-4 py-2.5 text-[12px] text-[#555] hover:text-white transition-colors">Cancel</button>
              </div>
            </form>
          )}

          {reviews.length === 0 ? (
            <p className="text-[13px] text-[#444]">No reviews yet. Be the first to leave one.</p>
          ) : (
            <div className="space-y-6 max-w-[720px]">
              {reviews.map(r => (
                <div key={r.id} className="border-b border-[#1a1a1a] pb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Stars rating={r.rating} />
                    {r.is_verified_purchase && <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-900/40 px-1.5 py-0.5 rounded">Verified</span>}
                  </div>
                  {r.title && <p className="text-[14px] font-semibold text-white mb-0.5">{r.title}</p>}
                  <p className="text-[11px] text-[#444] mb-2">{r.reviewer_name} · {new Date(r.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</p>
                  {r.body && <p className="text-[13px] text-[#888] leading-6">{r.body}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Related products ── */}
      {product.related.length > 0 && (
        <div className="border-t border-[#1a1a1a] bg-[#050505] py-12">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <h2 className="text-[13px] font-bold text-[#555] uppercase tracking-[0.15em] mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {product.related.map(p => {
                const imgSrc = p.image ? (p.image.startsWith("/uploads/") ? `${UPLOADS}${p.image}` : p.image) : null;
                return (
                  <Link key={p.id} href={`/products/${p.slug}`}
                    className="bg-[#0d0d0d] border border-[#1f1f1f] hover:border-[#444] transition-all group block rounded-sm">
                    <div className="relative aspect-square bg-[#111] overflow-hidden">
                      {imgSrc
                        ? <Image src={imgSrc} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="200px" />
                        : <div className="w-full h-full flex items-center justify-center text-[#2a2a2a] text-3xl">🏏</div>
                      }
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#444] mb-1">{p.brand_name}</p>
                      <h3 className="text-[12px] font-medium text-[#aaa] group-hover:text-white transition-colors line-clamp-2 mb-2">{p.name}</h3>
                      <p className="text-[13px] font-bold text-white">${Number(p.sell_price || 0).toFixed(2)}</p>
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
