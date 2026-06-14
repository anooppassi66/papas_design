"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getCart, CartItem, cartTotal, cartItemExtras, saveCart, isLoggedIn, customerApi } from "@/lib/customerApi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

type Step = "delivery" | "payment" | "review";

// ── Stripe CardElement styles matching the site ──
const CARD_STYLE = {
  style: {
    base: {
      fontSize: "13px",
      color: "#1e1e21",
      fontFamily: "inherit",
      "::placeholder": { color: "#bbb" },
    },
    invalid: { color: "#e53e3e" },
  },
};

function CheckoutInner() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [step, setStep] = useState<Step>("delivery");
  const [cardMounted, setCardMounted] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState("");

  const [items, setItems] = useState<CartItem[]>([]);
  const [placed, setPlaced] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const [gcInput, setGcInput] = useState("");
  const [gcApplied, setGcApplied] = useState<{ code: string; balance: number } | null>(null);
  const [gcValidating, setGcValidating] = useState(false);
  const [gcError, setGcError] = useState("");

  const [delivery, setDelivery] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", postcode: "", country: "Australia",
  });

  useEffect(() => {
    if (!isLoggedIn()) { router.replace("/account?redirect=/checkout"); return; }
    setItems(getCart());

    Promise.all([
      customerApi.get("/auth/me").catch(() => null),
      customerApi.get("/auth/me/addresses").catch(() => null),
    ]).then(([me, addrs]) => {
      const u = me as { first_name?: string; last_name?: string; email?: string; phone?: string } | null;
      const addresses = addrs as { line1?: string; city?: string; state?: string; pincode?: string; is_default?: boolean }[] | null;
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

  function goToPayment() {
    setCardMounted(true); // keep CardElement mounted from here on
    setStep("payment");
  }

  function handlePaymentNext() {
    if (!cardComplete) { setCardError("Please complete your card details."); return; }
    setCardError("");
    setStep("review");
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn()) { router.push("/account?redirect=/checkout"); return; }
    if (items.length === 0) { setOrderError("Your cart is empty."); return; }

    setPlacingOrder(true); setOrderError("");
    try {
      const result = await customerApi.post("/orders", {
        items: items.map(i => ({
          product_id: i.product_id,
          product_variant_id: i.product_variant_id,
          quantity: i.quantity,
          unit_price: i.unit_price,
          services: i.services || [],
          addons: i.addons || [],
        })),
        shipping: {
          name: `${delivery.firstName} ${delivery.lastName}`.trim(),
          line1: delivery.address,
          city: delivery.city,
          state: delivery.state,
          pincode: delivery.postcode,
          phone: delivery.phone,
        },
        payment_method: "stripe",
        tax_amount: tax,
        ...(gcApplied ? { gift_card_code: gcApplied.code, gift_card_amount: gcDiscount } : {}),
      }) as { order_no: string; client_secret: string | null };

      // Confirm payment with Stripe if a payment intent was created
      if (result.client_secret && stripe && elements) {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) { setOrderError("Card element not found. Please refresh and try again."); return; }

        const { error: stripeError } = await stripe.confirmCardPayment(result.client_secret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${delivery.firstName} ${delivery.lastName}`.trim(),
              email: delivery.email,
              phone: delivery.phone,
              address: {
                line1: delivery.address,
                city: delivery.city,
                state: delivery.state,
                postal_code: delivery.postcode,
                country: "AU",
              },
            },
          },
        });

        if (stripeError) {
          setOrderError(stripeError.message || "Payment failed. Please try again.");
          setPlacingOrder(false);
          return;
        }

        // Payment succeeded — mark order as paid
        await customerApi.put(`/orders/${result.order_no}/confirm`, {});
      }

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
    const hasServices = items.some(i => i.services && i.services.length > 0);
    const hasAddons   = items.some(i => i.addons  && i.addons.length  > 0);
    return (
      <div className="bg-[#f4f4f4] min-h-screen flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-10 max-w-[520px] w-full shadow-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-[22px] font-semibold text-[#1e1e21] mb-2">Order Confirmed!</h1>
            <p className="text-[#888] text-[13px] mb-1">Thank you for your order.</p>
            <p className="text-[#f69a39] font-bold text-[16px] font-mono mb-2">{orderNo}</p>
            <p className="text-[12px] text-[#aaa]">A confirmation email will be sent to <strong>{delivery.email}</strong>.</p>
          </div>

          {(hasServices || hasAddons) && (
            <div className="space-y-2 mb-6">
              {hasServices && (
                <div className="flex gap-3 p-3 bg-blue-50 border border-blue-100 rounded text-left">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-screwdriver-wrench text-blue-500 text-[12px]" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-blue-700 mb-0.5">Service Booking Confirmed</p>
                    <p className="text-[11px] text-blue-600">Our team will contact you to schedule your service appointment.</p>
                  </div>
                </div>
              )}
              {hasAddons && (
                <div className="flex gap-3 p-3 bg-green-50 border border-green-100 rounded text-left">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-box text-green-500 text-[12px]" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-green-700 mb-0.5">Add-ons Included</p>
                    <p className="text-[11px] text-green-600">Your selected add-ons will be packed and shipped with your order.</p>
                  </div>
                </div>
              )}
            </div>
          )}

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
          <div className="flex-1">

            {/* ── Step 1: Delivery ── */}
            {step === "delivery" && (
              <form onSubmit={e => { e.preventDefault(); goToPayment(); }} className="bg-white rounded-[4px] border border-[#e8e8e8] p-6">
                <h2 className="text-[15px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-5">Delivery Information</h2>
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
                    { label: "City", key: "city" },
                    { label: "State", key: "state" },
                    { label: "Postcode", key: "postcode" },
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
                  <div>
                    <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">Country *</label>
                    <select
                      required value={delivery.country}
                      onChange={e => setDelivery(d => ({ ...d, country: e.target.value }))}
                      className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39] bg-white"
                    >
                      {["Australia","New Zealand","United Kingdom","United States","Canada","India","Pakistan","Sri Lanka","Bangladesh","South Africa","West Indies","Afghanistan","Ireland","Zimbabwe","Singapore","Malaysia","United Arab Emirates","Other"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="mt-6 w-full py-3.5 bg-[#f69a39] text-white font-semibold text-[13px] uppercase tracking-[0.5px] rounded-[3px] hover:bg-[#e8880d] transition-colors">
                  Continue to Payment
                </button>
              </form>
            )}

            {/* ── Step 2: Payment — CardElement stays mounted on review step too ── */}
            {cardMounted && (
              <div style={{ display: step === "payment" ? "block" : "none" }}>
                <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-6">
                  <h2 className="text-[15px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-1">Payment Details</h2>
                  <p className="text-[11px] text-[#aaa] mb-5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    Secure payment powered by Stripe — your card details are never stored on our servers
                  </p>

                  <div className="flex items-center gap-2 mb-5">
                    {["VISA", "MC", "AMEX"].map(c => (
                      <span key={c} className="px-2 py-1 border border-[#e5e5e5] rounded text-[10px] font-bold text-[#888] bg-[#fafafa]">{c}</span>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-2">Card Details *</label>
                    <div className="border border-[#e5e5e5] rounded-[3px] px-3 py-3 focus-within:border-[#f69a39] transition-colors">
                      <CardElement options={CARD_STYLE} onChange={e => {
                        setCardComplete(e.complete);
                        setCardError(e.error?.message || "");
                      }} />
                    </div>
                    {cardError && <p className="text-[11px] text-red-500 mt-1.5">{cardError}</p>}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setStep("delivery")} className="px-6 py-3 border border-[#e5e5e5] text-[#888] text-[13px] font-semibold rounded-[3px] hover:border-[#ccc] transition-colors">Back</button>
                    <button type="button" onClick={handlePaymentNext} disabled={!stripe}
                      className="flex-1 py-3 bg-[#f69a39] text-white font-semibold text-[13px] uppercase tracking-[0.5px] rounded-[3px] hover:bg-[#e8880d] disabled:opacity-50 transition-colors">
                      Review Order
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Review ── */}
            {step === "review" && (
              <form onSubmit={handlePlaceOrder} className="bg-white rounded-[4px] border border-[#e8e8e8] p-6">
                <h2 className="text-[15px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-5">Review Your Order</h2>

                <div className="space-y-3 mb-5">
                  {items.map((item, idx) => (
                    <div key={idx} className="py-3 border-b border-[#f5f5f5]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-[13px] font-medium text-[#1e1e21]">{item.product_name}</p>
                          <p className="text-[11px] text-[#888]">
                            {item.variant_size && `Size: ${item.variant_size}`}
                            {item.variant_size && item.variant_color && " · "}
                            {item.variant_color}
                            {" · "}Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-[#f69a39] font-bold text-[14px] flex-shrink-0">
                          ${((item.unit_price + cartItemExtras(item)) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      {item.services && item.services.length > 0 && (
                        <div className="mt-2 ml-1 space-y-1">
                          {item.services.map(s => (
                            <div key={s.id} className="flex items-center justify-between">
                              <p className="text-[11px] text-[#888] flex items-center gap-1.5">
                                <span className="inline-block w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[9px] font-bold flex items-center justify-center flex-shrink-0">S</span>
                                <span className="font-medium text-[#555]">{s.category_name}:</span> {s.name}
                                <span className="bg-blue-50 text-blue-600 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ml-1">Booked later</span>
                              </p>
                              <p className="text-[11px] text-[#888] flex-shrink-0">+${s.price.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {item.addons && item.addons.length > 0 && (
                        <div className="mt-1 ml-1 space-y-1">
                          {item.addons.map(a => (
                            <div key={a.id} className="flex items-center justify-between">
                              <p className="text-[11px] text-[#888] flex items-center gap-1.5">
                                <span className="inline-block w-4 h-4 rounded-full bg-green-100 text-green-600 text-[9px] font-bold flex items-center justify-center flex-shrink-0">A</span>
                                {a.name}
                                <span className="bg-green-50 text-green-600 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ml-1">Included in shipment</span>
                              </p>
                              <p className="text-[11px] text-[#888] flex-shrink-0">+${a.price.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

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
                    <div className="flex items-center gap-2 mt-1">
                      <svg className="w-4 h-4 text-[#635bff]" viewBox="0 0 24 24" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>
                      <p className="text-[#635bff] font-semibold text-[11px]">Secured by Stripe</p>
                    </div>
                    <p className="text-[#888] text-[11px] mt-1">Card details encrypted end-to-end</p>
                  </div>
                </div>

                {orderError && <div className="p-3 bg-red-50 text-red-600 text-[12px] rounded mb-4 border border-red-200">{orderError}</div>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep("payment")} className="px-6 py-3 border border-[#e5e5e5] text-[#888] text-[13px] font-semibold rounded-[3px] hover:border-[#ccc] transition-colors">Back</button>
                  <button type="submit" disabled={placingOrder || !stripe}
                    className="flex-1 py-3 bg-[#f69a39] text-white font-semibold text-[13px] uppercase tracking-[0.5px] rounded-[3px] hover:bg-[#e8880d] disabled:opacity-60 transition-colors">
                    {placingOrder ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        Processing…
                      </span>
                    ) : `Place Order · $${total.toFixed(2)}`}
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

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutInner />
    </Elements>
  );
}
