"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCart, saveCart, updateCartQty, removeFromCart, cartTotal, CartItem, UPLOADS } from "@/lib/customerApi";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    setItems(getCart());
    const handler = () => setItems(getCart());
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

  const handleUpdateQty = (variantId: number, qty: number) => {
    updateCartQty(variantId, qty);
    setItems(getCart());
  };

  const handleRemove = (variantId: number) => {
    removeFromCart(variantId);
    setItems(getCart());
  };

  const subtotal = cartTotal(items);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal - discount + shipping;

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      <div className="bg-black">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-3 text-[11px] text-[#888] flex items-center gap-2">
          <Link href="/" className="hover:text-[#f69a39] transition-colors">Home</Link>
          <span>/</span><span className="text-white">Shopping Cart</span>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-8 pt-4">
          <h1 className="text-white text-[26px] md:text-[32px] font-semibold uppercase tracking-[0.5px]">
            Your Cart {items.length > 0 && <span className="ml-3 text-[16px] font-normal text-[#888]">({items.reduce((s, i) => s + i.quantity, 0)} items)</span>}
          </h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-6">
        {items.length === 0 ? (
          <div className="bg-white rounded-[4px] p-16 text-center border border-[#e8e8e8]">
            <svg className="w-16 h-16 text-[#ddd] mx-auto mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z"/>
            </svg>
            <h2 className="text-[20px] font-semibold text-[#1e1e21] mb-2">Your cart is empty</h2>
            <p className="text-[#888] text-[13px] mb-6">Add some cricket gear to get started</p>
            <Link href="/products" className="inline-block px-8 py-3 bg-[#f69a39] text-white text-[13px] font-semibold rounded-[3px] hover:bg-[#e8880d] transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Items */}
            <div className="flex-1 min-w-0 space-y-3">
              {items.map((item) => {
                const imgSrc = item.product_image ? (item.product_image.startsWith("/uploads/") ? `${UPLOADS}${item.product_image}` : item.product_image) : null;
                return (
                  <div key={item.product_variant_id} className="bg-white rounded-[4px] border border-[#e8e8e8] p-4 flex gap-4">
                    <Link href={`/products/${item.product_slug}`} className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-[#f8f8f8] rounded-[3px] overflow-hidden">
                      {imgSrc ? <Image src={imgSrc} alt={item.product_name} fill className="object-cover" sizes="96px" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🏏</div>}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] text-[#f69a39] font-semibold uppercase">{item.brand_name}</p>
                          <Link href={`/products/${item.product_slug}`} className="text-[13px] font-medium text-[#1e1e21] line-clamp-2 hover:text-[#f69a39] transition-colors">{item.product_name}</Link>
                          <p className="text-[11px] text-[#888] mt-0.5">
                            {item.variant_size && `Size: ${item.variant_size}`}{item.variant_size && item.variant_color && " · "}{item.variant_color && `Color: ${item.variant_color}`}
                          </p>
                        </div>
                        <button onClick={() => handleRemove(item.product_variant_id)} className="text-[#ccc] hover:text-[#e24b4a] transition-colors flex-shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#e5e5e5] rounded-[3px]">
                          <button onClick={() => handleUpdateQty(item.product_variant_id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-[#888] hover:text-[#1e1e21]">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                          </button>
                          <span className="w-8 text-center text-[13px] font-semibold">{item.quantity}</span>
                          <button onClick={() => handleUpdateQty(item.product_variant_id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-[#888] hover:text-[#1e1e21]">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          </button>
                        </div>
                        <p className="text-[#f69a39] font-bold text-[15px]">${(item.unit_price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="lg:w-[320px] flex-shrink-0 space-y-4">
              {/* Promo */}
              <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-4">
                <p className="text-[12px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-3">Promo Code</p>
                <div className="flex gap-2">
                  <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Enter code" className="flex-1 border border-[#e5e5e5] rounded-[3px] px-3 py-2 text-[12px] outline-none focus:border-[#f69a39]" />
                  <button onClick={() => { if (promoCode.trim()) setPromoApplied(!promoApplied); }}
                    className="px-4 py-2 bg-[#1e1e21] text-white text-[12px] font-semibold rounded-[3px] hover:bg-[#333] transition-colors">
                    {promoApplied ? "Remove" : "Apply"}
                  </button>
                </div>
                {promoApplied && <p className="text-green-600 text-[11px] mt-2">10% discount applied!</p>}
              </div>

              {/* Order summary */}
              <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-4">
                <p className="text-[12px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-4">Order Summary</p>
                <div className="space-y-2.5 text-[13px]">
                  <div className="flex justify-between text-[#444]"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount (10%)</span><span>-${discount.toFixed(2)}</span></div>}
                  <div className="flex justify-between text-[#444]">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && <p className="text-[11px] text-[#aaa]">Free shipping on orders over $100</p>}
                  <div className="border-t border-[#f0f0f0] pt-3 flex justify-between font-bold text-[#1e1e21] text-[15px]">
                    <span>Total</span><span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/checkout" className="block w-full text-center mt-4 py-3.5 bg-[#f69a39] text-white font-semibold text-[13px] uppercase tracking-[0.5px] rounded-[3px] hover:bg-[#e8880d] transition-colors">
                  Proceed to Checkout
                </Link>
                <Link href="/products" className="block w-full text-center mt-2 py-2.5 border border-[#e5e5e5] text-[#888] text-[12px] font-medium rounded-[3px] hover:border-[#ccc] transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
