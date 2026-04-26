"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS } from "@/lib/data";

interface CartItem {
  product: (typeof PRODUCTS)[0];
  size: string;
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    { product: PRODUCTS[0], size: "SH", quantity: 1 },
    { product: PRODUCTS[1], size: "M",  quantity: 2 },
  ]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQty = (idx: number, qty: number) => {
    if (qty < 1) return removeItem(idx);
    setItems((prev) => prev.map((item, i) => i === idx ? { ...item, quantity: qty } : item));
  };

  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal - discount + shipping;

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      {/* Header */}
      <div className="bg-black">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-3 text-[11px] text-[#888] flex items-center gap-2">
          <Link href="/" className="hover:text-[#f69a39] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Shopping Cart</span>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-8 pt-4">
          <h1 className="text-white text-[26px] md:text-[32px] font-semibold uppercase tracking-[0.5px]">
            Your Cart
            {items.length > 0 && (
              <span className="ml-3 text-[16px] font-normal text-[#888]">({items.length} {items.length === 1 ? "item" : "items"})</span>
            )}
          </h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-6">
        {items.length === 0 ? (
          /* Empty cart */
          <div className="bg-white rounded-[4px] p-16 text-center border border-[#e8e8e8]">
            <svg className="w-16 h-16 text-[#ddd] mx-auto mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z"/>
            </svg>
            <h2 className="text-[20px] font-semibold text-[#1e1e21] mb-2">Your cart is empty</h2>
            <p className="text-[#888] text-[14px] mb-8">Looks like you haven&apos;t added anything yet.</p>
            <Link href="/products"
              className="inline-block bg-[#f69a39] text-white font-semibold text-[13px] uppercase tracking-[0.5px] px-10 py-3 rounded-[3px] hover:bg-[#e8880d] transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* ── Cart Items ──────────────────────────────────────── */}
            <div className="flex-1 space-y-3">
              {/* Free shipping progress */}
              {subtotal < 100 && (
                <div className="bg-white rounded-[4px] border border-[#e8e8e8] px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[12px] text-[#1e1e21]">
                      Add <span className="font-bold text-[#f69a39]">${(100 - subtotal).toFixed(2)}</span> more for free delivery
                    </p>
                    <svg className="w-5 h-5 text-[#888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4M4 12l4-4M4 12l4 4"/>
                    </svg>
                  </div>
                  <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#f69a39] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (subtotal / 100) * 100)}%` }} />
                  </div>
                </div>
              )}
              {subtotal >= 100 && (
                <div className="bg-[#f0fdf4] border border-[#86efac] rounded-[4px] px-5 py-3 flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <p className="text-[12px] text-[#166534] font-medium">You qualify for free delivery!</p>
                </div>
              )}

              {/* Items */}
              {items.map((item, idx) => (
                <div key={idx} className="bg-white rounded-[4px] border border-[#e8e8e8] p-4 flex gap-4">
                  {/* Image */}
                  <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                    <div className="relative w-[90px] h-[90px] md:w-[110px] md:h-[110px] bg-[#f8f8f8] rounded-[3px] overflow-hidden">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover hover:scale-105 transition-transform duration-300"/>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] text-[#f69a39] font-semibold uppercase tracking-wide">{item.product.brand}</p>
                        <Link href={`/products/${item.product.slug}`}>
                          <h3 className="text-[13px] font-semibold text-[#1e1e21] leading-snug mt-0.5 hover:text-[#f69a39] transition-colors line-clamp-2">
                            {item.product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[11px] text-[#888]">Size: <span className="font-medium text-[#1e1e21]">{item.size}</span></span>
                          <span className="text-[11px] text-[#888]">Category: <span className="font-medium text-[#1e1e21]">{item.product.category}</span></span>
                        </div>
                      </div>
                      {/* Remove */}
                      <button onClick={() => removeItem(idx)}
                        className="flex-shrink-0 text-[#ccc] hover:text-[#e24b4a] transition-colors p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>

                    {/* Price + Qty */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#e5e5e5] rounded-[3px] overflow-hidden">
                        <button onClick={() => updateQty(idx, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#666] hover:bg-[#f5f5f5] transition-colors text-lg font-light">
                          −
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center text-[13px] font-semibold border-x border-[#e5e5e5]">
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQty(idx, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#666] hover:bg-[#f5f5f5] transition-colors text-lg font-light">
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-[#f69a39] font-bold text-[16px]">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-[#aaa]">${item.product.price} each</p>
                        )}
                      </div>
                    </div>

                    {/* Discount badge */}
                    {item.product.discount && (
                      <div className="mt-2">
                        <span className="text-[9px] font-semibold text-white bg-[#f69a39] px-2 py-0.5 rounded-[2px] uppercase tracking-wide">
                          {item.product.discount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Continue shopping */}
              <div className="flex items-center justify-between pt-2">
                <Link href="/products"
                  className="flex items-center gap-2 text-[12px] text-[#888] hover:text-[#f69a39] transition-colors font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                  </svg>
                  Continue Shopping
                </Link>
                <button onClick={() => setItems([])}
                  className="text-[12px] text-[#ccc] hover:text-[#e24b4a] transition-colors">
                  Clear Cart
                </button>
              </div>
            </div>

            {/* ── Order Summary ────────────────────────────────────── */}
            <div className="w-full lg:w-[340px] flex-shrink-0 space-y-4">
              {/* Promo code */}
              <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-4">
                <p className="text-[12px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-3">Promo Code</p>
                <div className="flex gap-2">
                  <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 border border-[#e5e5e5] rounded-[3px] px-3 py-2 text-[12px] outline-none focus:border-[#f69a39] uppercase"
                  />
                  <button
                    onClick={() => { if (promoCode.trim()) setPromoApplied(true); }}
                    className="px-4 py-2 bg-[#1e1e21] text-white text-[11px] font-semibold uppercase tracking-wide rounded-[3px] hover:bg-[#333] transition-colors">
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[11px] text-[#22c55e] font-medium mt-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    10% discount applied!
                  </p>
                )}
              </div>

              {/* Summary */}
              <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-5">
                <p className="text-[13px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-4">Order Summary</p>
                <div className="space-y-2.5 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#888]">Subtotal ({items.reduce((s,i) => s+i.quantity,0)} items)</span>
                    <span className="font-medium text-[#1e1e21]">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-[#22c55e]">
                      <span>Discount (10%)</span>
                      <span className="font-semibold">−${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[#888]">Delivery</span>
                    <span className={shipping === 0 ? "text-[#22c55e] font-semibold" : "font-medium text-[#1e1e21]"}>
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-[#f0f0f0] pt-2.5 flex items-center justify-between">
                    <span className="font-semibold text-[#1e1e21] text-[14px]">Total</span>
                    <span className="font-bold text-[#f69a39] text-[20px]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/checkout"
                  className="block mt-5 w-full bg-[#f69a39] text-white text-center font-semibold text-[13px] uppercase tracking-[0.5px] py-4 rounded-[3px] hover:bg-[#e8880d] transition-colors">
                  Proceed to Checkout →
                </Link>

                {/* Trust badges */}
                <div className="mt-4 space-y-2">
                  {[
                    { icon: "🔒", text: "Secure checkout" },
                    { icon: "↩", text: "Free 30-day returns" },
                    { icon: "✓", text: "100% genuine products" },
                  ].map((b) => (
                    <div key={b.text} className="flex items-center gap-2 text-[11px] text-[#888]">
                      <span className="text-sm">{b.icon}</span>
                      {b.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* PayPal */}
              <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-4 text-center">
                <p className="text-[11px] text-[#888] mb-2">or pay with</p>
                <button className="w-full bg-[#ffc439] text-[#003087] font-bold text-[13px] py-3 rounded-[3px] hover:bg-[#f0b429] transition-colors">
                  PayPal
                </button>
                <p className="text-[10px] text-[#aaa] mt-2">Pay in 3 interest-free instalments</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommended products */}
        {items.length > 0 && (
          <div className="mt-10">
            <h2 className="text-[16px] font-semibold text-[#1e1e21] uppercase tracking-[0.5px] mb-5">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PRODUCTS.slice(2, 6).map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}
                  className="bg-white rounded-[4px] border border-[#e8e8e8] group overflow-hidden hover:border-[#f69a39] hover:shadow-md transition-all">
                  <div className="relative aspect-square bg-[#f8f8f8] overflow-hidden">
                    <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-400"/>
                    {product.discount && (
                      <div className="absolute top-2 left-2 bg-[#f69a39] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] uppercase">SALE</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-[#f69a39] font-semibold uppercase tracking-wide">{product.brand}</p>
                    <p className="text-[12px] font-medium text-[#1e1e21] leading-snug mt-0.5 line-clamp-2">{product.name}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[#f69a39] font-bold text-[14px]">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-[#aaa] text-[11px] line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
