"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCart, CartItem, cartTotal, saveCart, isLoggedIn, customerApi } from "@/lib/customerApi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
type Step = "delivery" | "payment" | "review";

function fmtCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function fmtExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
function fmtCvv(v: string) {
  return v.replace(/\D/g, "").slice(0, 4);
}

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("delivery");
  const [items, setItems] = useState<CartItem[]>([]);
  const [placed, setPlaced] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Gift card state
  const [gcInput, setGcInput] = useState("");
  const [gcApplied, setGcApplied] = useState<{ code: string; balance: number } | null>(null);
  const [gcValidating, setGcValidating] = useState(false);
  const [gcError, setGcError] = useState("");

  const [delivery, setDelivery] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", postcode: "", country: "Australia",
  });

  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [cardErrors, setCardErrors] = useState({ number: "", expiry: "", cvv: "", name: "" });

  useEffect(() => {
    setItems(getCart());
    if (!isLoggedIn()) return;

    // Fetch fresh profile + default address in parallel
    Promise.all([
      customerApi.get("/auth/me").catch(() => null),
      customerApi.get("/auth/me/addresses").catch(() => null),
    ]).then(([me, addrs]) => {
      const u = me as { first_name?: string; last_name?: string; email?: string; phone?: string } | null;
      const addresses = addrs as { line1?: string; line2?: string; city?: string; state?: string; pincode?: string; is_default?: boolean }[] | null;
      const def = addresses?.find(a => a.is_default) ?? addresses?.[0] ?? null;

      setDelivery(d => ({
        ...d,
        firstName: u?.first_name || d.firstName,
        lastName:  u?.last_name  || d.lastName,
        email:     u?.email      || d.email,
        phone:     u?.phone      || d.phone,
        address:   def?.line1    || d.address,
        city:      def?.city     || d.city,
        state:     def?.state    || d.state,
        postcode:  def?.pincode  || d.postcode,
      }));
    });
  }, []);

  const TAX_RATE = 0.07;
  const subtotal = cartTotal(items);
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * TAX_RATE;
  const gcDiscount = gcApplied ? Math.min(gcApplied.balance, subtotal + shipping + tax) : 0;
  const total = subtotal + shipping + tax - gcDiscount;

  async function applyGiftCard() {
    if (!gcInput.trim()) return;
    setGcValidating(true); setGcError("");
    try {
      const res = await fetch(`${API}/gift-cards/validate`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: gcInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) setGcError(data.error || "Invalid code");
      else { setGcApplied({ code: gcInput.trim().toUpperCase(), balance: data.balance }); setGcInput(""); }
    } catch { setGcError("Could not validate code"); }
    finally { setGcValidating(false); }
  }

  function validateCard(): boolean {
    const digits = cardDetails.number.replace(/\s/g, "");
    const errs = {
      number: digits.length < 16 ? "Enter a valid 16-digit card number" : "",
      expiry: !/^\d{2}\/\d{2}$/.test(cardDetails.expiry) ? "Enter expiry as MM/YY" : "",
      cvv:    cardDetails.cvv.length < 3 ? "Enter a valid CVV" : "",
      name:   cardDetails.name.trim().length < 2 ? "Enter the name on your card" : "",
    };
    setCardErrors(errs);
    return !Object.values(errs).some(Boolean);
  }

  function handlePaymentNext() {
    if (validateCard()) setStep("review");
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn()) { router.push("/account?redirect=/checkout"); return; }
    if (items.length === 0) { setOrderError("Your cart is empty."); return; }

    setPlacingOrder(true); setOrderError("");
    try {
      const result = await customerApi.post("/orders", {
        items: items.map((i) => ({
          product_id: i.product_id,
          product_variant_id: i.product_variant_id,
          quantity: i.quantity,
          unit_price: i.unit_price,
        })),
        shipping: {
          name: `${delivery.firstName} ${delivery.lastName}`.trim(),
          line1: delivery.address,
          city: delivery.city,
          state: delivery.state,
          pincode: delivery.postcode,
          phone: delivery.phone,
        },
        payment_method: "card",
        tax_amount: tax,
        ...(gcApplied ? { gift_card_code: gcApplied.code, gift_card_amount: gcDiscount } : {}),
      }) as { order_no: string };

      saveCart([]);
      setOrderNo(result.order_no);
      setPlaced(true);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : "Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (placed) {
    return (
      <div className="bg-[#f4f4f4] min-h-screen flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-10 text-center max-w-[480px] w-full shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-[22px] font-semibold text-[#1e1e21] mb-2">Order Confirmed!</h1>
          <p className="text-[#888] text-[13px] mb-1">Thank you for your order.</p>
          <p className="text-[#f69a39] font-bold text-[16px] font-mono mb-6">{orderNo}</p>
          <p className="text-[12px] text-[#aaa] mb-6">A confirmation email will be sent to <strong>{delivery.email}</strong>. We&apos;ll notify you when your order ships.</p>
          <div className="flex gap-3">
            <Link href="/account" className="flex-1 py-3 border border-[#e5e5e5] text-[#888] text-[12px] font-semibold rounded-[3px] hover:border-[#ccc] transition-colors text-center">View Orders</Link>
            <Link href="/products" className="flex-1 py-3 bg-[#f69a39] text-white text-[12px] font-semibold rounded-[3px] hover:bg-[#e8880d] transition-colors text-center">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  const STEPS: { id: Step; label: string; num: number }[] = [
    { id: "delivery", label: "Delivery", num: 1 },
    { id: "payment", label: "Payment", num: 2 },
    { id: "review", label: "Review", num: 3 },
  ];

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      <div className="bg-black">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-3 text-[11px] text-[#888] flex items-center gap-2">
          <Link href="/" className="hover:text-[#f69a39]">Home</Link><span>/</span>
          <Link href="/cart" className="hover:text-[#f69a39]">Cart</Link><span>/</span>
          <span className="text-white">Checkout</span>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-8 pt-4">
          <h1 className="text-white text-[26px] md:text-[32px] font-semibold uppercase tracking-[0.5px]">Checkout</h1>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white border-b border-[#e8e8e8]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-4 flex items-center gap-0">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold transition-colors ${step === s.id ? "bg-[#f69a39] text-white" : "text-[#888]"}`}>
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${step === s.id ? "border-white text-white" : "border-[#ccc] text-[#888]"}`}>{s.num}</span>
                {s.label}
              </div>
              {idx < STEPS.length - 1 && <div className="w-8 h-[1px] bg-[#e5e5e5]" />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form area */}
          <div className="flex-1">

            {/* ── Step 1: Delivery ── */}
            {step === "delivery" && (
              <form onSubmit={e => { e.preventDefault(); setStep("payment"); }} className="bg-white rounded-[4px] border border-[#e8e8e8] p-6">
                <h2 className="text-[15px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-5">Delivery Information</h2>
                {!isLoggedIn() && (
                  <div className="p-3 bg-[#fff8f0] border border-[#f69a39]/30 rounded text-[12px] text-[#888] mb-4">
                    <Link href="/account" className="text-[#f69a39] font-semibold">Sign in</Link> to auto-fill your details and track your order.
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "First Name", key: "firstName", type: "text" },
                    { label: "Last Name",  key: "lastName",  type: "text" },
                    { label: "Email Address", key: "email", type: "email" },
                    { label: "Phone Number",  key: "phone", type: "tel" },
                  ].map(({ label, key, type }) => (
                    <div key={key}>
                      <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">{label} *</label>
                      <input
                        type={type} required
                        value={delivery[key as keyof typeof delivery]}
                        onChange={e => setDelivery(d => ({ ...d, [key]: e.target.value }))}
                        className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]"
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">Street Address *</label>
                    <input
                      required value={delivery.address}
                      onChange={e => setDelivery(d => ({ ...d, address: e.target.value }))}
                      className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]"
                    />
                  </div>
                  {[
                    { label: "City",    key: "city" },
                    { label: "State",   key: "state" },
                    { label: "Postcode", key: "postcode" },
                    { label: "Country", key: "country" },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">{label} *</label>
                      <input
                        required value={delivery[key as keyof typeof delivery]}
                        onChange={e => setDelivery(d => ({ ...d, [key]: e.target.value }))}
                        className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]"
                      />
                    </div>
                  ))}
                </div>
                <button type="submit" className="mt-6 w-full py-3.5 bg-[#f69a39] text-white font-semibold text-[13px] uppercase tracking-[0.5px] rounded-[3px] hover:bg-[#e8880d] transition-colors">
                  Continue to Payment
                </button>
              </form>
            )}

            {/* ── Step 2: Payment ── */}
            {step === "payment" && (
              <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-6">
                <h2 className="text-[15px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-1">Payment Details</h2>
                <p className="text-[11px] text-[#aaa] mb-5 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  Secure payment — your card details are encrypted
                </p>

                {/* Accepted cards */}
                <div className="flex items-center gap-2 mb-5">
                  {["VISA", "MC", "AMEX", "DISC"].map(c => (
                    <span key={c} className="px-2 py-1 border border-[#e5e5e5] rounded text-[10px] font-bold text-[#888] bg-[#fafafa]">{c}</span>
                  ))}
                </div>

                <div className="space-y-4">
                  {/* Card number */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">Card Number *</label>
                    <div className="relative">
                      <input
                        value={cardDetails.number}
                        onChange={e => {
                          setCardDetails(d => ({ ...d, number: fmtCard(e.target.value) }));
                          if (cardErrors.number) setCardErrors(e2 => ({ ...e2, number: "" }));
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        inputMode="numeric"
                        className={`w-full border rounded-[3px] px-3 py-2.5 text-[13px] font-mono outline-none transition-colors pr-10 ${cardErrors.number ? "border-red-400 focus:border-red-400" : "border-[#e5e5e5] focus:border-[#f69a39]"}`}
                      />
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ccc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    {cardErrors.number && <p className="text-[11px] text-red-500 mt-1">{cardErrors.number}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Expiry */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">Expiry Date *</label>
                      <input
                        value={cardDetails.expiry}
                        onChange={e => {
                          setCardDetails(d => ({ ...d, expiry: fmtExpiry(e.target.value) }));
                          if (cardErrors.expiry) setCardErrors(e2 => ({ ...e2, expiry: "" }));
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                        inputMode="numeric"
                        className={`w-full border rounded-[3px] px-3 py-2.5 text-[13px] font-mono outline-none transition-colors ${cardErrors.expiry ? "border-red-400 focus:border-red-400" : "border-[#e5e5e5] focus:border-[#f69a39]"}`}
                      />
                      {cardErrors.expiry && <p className="text-[11px] text-red-500 mt-1">{cardErrors.expiry}</p>}
                    </div>

                    {/* CVV */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">CVV *</label>
                      <div className="relative">
                        <input
                          value={cardDetails.cvv}
                          onChange={e => {
                            setCardDetails(d => ({ ...d, cvv: fmtCvv(e.target.value) }));
                            if (cardErrors.cvv) setCardErrors(e2 => ({ ...e2, cvv: "" }));
                          }}
                          placeholder="123"
                          maxLength={4}
                          inputMode="numeric"
                          type="password"
                          className={`w-full border rounded-[3px] px-3 py-2.5 text-[13px] outline-none transition-colors pr-8 ${cardErrors.cvv ? "border-red-400 focus:border-red-400" : "border-[#e5e5e5] focus:border-[#f69a39]"}`}
                        />
                        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ccc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      {cardErrors.cvv && <p className="text-[11px] text-red-500 mt-1">{cardErrors.cvv}</p>}
                    </div>
                  </div>

                  {/* Name on card */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">Name on Card *</label>
                    <input
                      value={cardDetails.name}
                      onChange={e => {
                        setCardDetails(d => ({ ...d, name: e.target.value }));
                        if (cardErrors.name) setCardErrors(e2 => ({ ...e2, name: "" }));
                      }}
                      placeholder={`${delivery.firstName} ${delivery.lastName}`.trim() || "Cardholder Name"}
                      className={`w-full border rounded-[3px] px-3 py-2.5 text-[13px] outline-none transition-colors ${cardErrors.name ? "border-red-400 focus:border-red-400" : "border-[#e5e5e5] focus:border-[#f69a39]"}`}
                    />
                    {cardErrors.name && <p className="text-[11px] text-red-500 mt-1">{cardErrors.name}</p>}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep("delivery")} className="px-6 py-3 border border-[#e5e5e5] text-[#888] text-[13px] font-semibold rounded-[3px] hover:border-[#ccc] transition-colors">Back</button>
                  <button onClick={handlePaymentNext} className="flex-1 py-3 bg-[#f69a39] text-white font-semibold text-[13px] uppercase tracking-[0.5px] rounded-[3px] hover:bg-[#e8880d] transition-colors">
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Review ── */}
            {step === "review" && (
              <form onSubmit={handlePlaceOrder} className="bg-white rounded-[4px] border border-[#e8e8e8] p-6">
                <h2 className="text-[15px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-5">Review Your Order</h2>
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.product_variant_id} className="flex items-center justify-between gap-3 py-2 border-b border-[#f5f5f5]">
                      <div className="flex-1">
                        <p className="text-[13px] font-medium text-[#1e1e21]">{item.product_name}</p>
                        <p className="text-[11px] text-[#888]">
                          {item.variant_size && `Size: ${item.variant_size}`}{item.variant_size && item.variant_color && " · "}{item.variant_color}
                          {" · "}Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-[#f69a39] font-bold text-[14px]">${(item.unit_price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Delivery summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div className="bg-[#fafafa] rounded p-4 text-[12px] space-y-0.5 text-[#444]">
                    <p className="font-semibold text-[#1e1e21] mb-2 text-[11px] uppercase tracking-wide">Delivery to</p>
                    <p>{delivery.firstName} {delivery.lastName}</p>
                    <p>{delivery.address}</p>
                    <p>{delivery.city}, {delivery.state} {delivery.postcode}</p>
                    <p>{delivery.country}</p>
                    <p className="text-[#888] mt-1">{delivery.phone}</p>
                  </div>
                  <div className="bg-[#fafafa] rounded p-4 text-[12px] space-y-0.5 text-[#444]">
                    <p className="font-semibold text-[#1e1e21] mb-2 text-[11px] uppercase tracking-wide">Payment</p>
                    <p className="font-mono">•••• •••• •••• {cardDetails.number.replace(/\s/g, "").slice(-4)}</p>
                    <p className="text-[#888]">Expires {cardDetails.expiry}</p>
                    <p>{cardDetails.name}</p>
                  </div>
                </div>

                {orderError && <div className="p-3 bg-red-50 text-red-600 text-[12px] rounded mb-4">{orderError}</div>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep("payment")} className="px-6 py-3 border border-[#e5e5e5] text-[#888] text-[13px] font-semibold rounded-[3px] hover:border-[#ccc] transition-colors">Back</button>
                  <button type="submit" disabled={placingOrder} className="flex-1 py-3 bg-[#f69a39] text-white font-semibold text-[13px] uppercase tracking-[0.5px] rounded-[3px] hover:bg-[#e8880d] disabled:opacity-60 transition-colors">
                    {placingOrder ? "Placing Order…" : `Place Order · $${total.toFixed(2)}`}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:w-[300px] flex-shrink-0">
            <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-5 sticky top-4 space-y-4">
              <h3 className="text-[12px] font-semibold text-[#1e1e21] uppercase tracking-wide">Order Summary</h3>
              <div className="space-y-2 text-[13px] text-[#444]">
                <div className="flex justify-between"><span>{items.reduce((s, i) => s + i.quantity, 0)} items</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between text-[#888]"><span>Tax (7%)</span><span>${tax.toFixed(2)}</span></div>
                {gcApplied && gcDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium"><span>Gift Card</span><span>-${gcDiscount.toFixed(2)}</span></div>
                )}
                <div className="border-t border-[#f0f0f0] pt-2 mt-2 flex justify-between font-bold text-[#1e1e21] text-[15px]">
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Gift card */}
              <div className="border-t border-[#f0f0f0] pt-4">
                <p className="text-[11px] font-semibold text-[#888] uppercase tracking-wide mb-2">Gift Card</p>
                {gcApplied ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
                    <div>
                      <p className="text-[11px] font-mono text-green-700 font-semibold">{gcApplied.code}</p>
                      <p className="text-[10px] text-green-600">${gcApplied.balance.toFixed(2)} available</p>
                    </div>
                    <button onClick={() => setGcApplied(null)} className="text-[11px] text-red-400 hover:text-red-600 transition-colors ml-2">Remove</button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        value={gcInput}
                        onChange={e => setGcInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), applyGiftCard())}
                        placeholder="PAPAS-XXXX-XXXX-XXXX"
                        className="flex-1 min-w-0 border border-[#e5e5e5] rounded-[3px] px-2.5 py-2 text-[12px] font-mono outline-none focus:border-[#f69a39] uppercase"
                      />
                      <button
                        type="button" onClick={applyGiftCard}
                        disabled={gcValidating || !gcInput.trim()}
                        className="px-3 py-2 bg-[#1e1e21] text-white text-[11px] font-semibold rounded-[3px] hover:bg-black disabled:opacity-50 transition-colors flex-shrink-0"
                      >
                        {gcValidating ? "…" : "Apply"}
                      </button>
                    </div>
                    {gcError && <p className="text-[11px] text-red-500 mt-1">{gcError}</p>}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
