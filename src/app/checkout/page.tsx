"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, ASSETS } from "@/lib/data";

type Step = "delivery" | "payment" | "review";

const STEPS: { id: Step; label: string; num: number }[] = [
  { id: "delivery", label: "Delivery",  num: 1 },
  { id: "payment",  label: "Payment",   num: 2 },
  { id: "review",   label: "Review",    num: 3 },
];

const SAMPLE_ITEMS = [
  { product: PRODUCTS[0], size: "SH", quantity: 1 },
  { product: PRODUCTS[1], size: "M",  quantity: 2 },
];

const subtotal = SAMPLE_ITEMS.reduce((s, i) => s + i.product.price * i.quantity, 0);
const total = subtotal + 0; // free shipping

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>("delivery");
  const [placed, setPlaced] = useState(false);

  const [delivery, setDelivery] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", postcode: "", country: "India",
  });
  const [payment, setPayment] = useState({
    method: "card",
    cardNumber: "", expiry: "", cvv: "", nameOnCard: "",
  });

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("review");
  };
  const handlePlaceOrder = () => setPlaced(true);

  if (placed) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-[480px]">
          <div className="w-20 h-20 bg-[#f69a39]/10 border-2 border-[#f69a39] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#f69a39]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 className="text-white text-[28px] font-semibold mb-2">Order Confirmed!</h1>
          <p className="text-[#888] text-[14px] mb-2">
            Thank you, <span className="text-white font-medium">{delivery.firstName || "valued customer"}</span>!
          </p>
          <p className="text-[#888] text-[13px] mb-1">
            Order <span className="text-[#f69a39] font-mono font-semibold">#PAPAS-{Math.floor(Math.random()*90000)+10000}</span>
          </p>
          <p className="text-[#666] text-[12px] mb-8">
            A confirmation has been sent to {delivery.email || "your email"}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/account"
              className="px-6 py-3 bg-[#f69a39] text-white text-[12px] font-semibold uppercase tracking-[0.5px] rounded-[3px] hover:bg-[#e8880d] transition-colors">
              Track My Order
            </Link>
            <Link href="/"
              className="px-6 py-3 border border-[#333] text-[#aaa] text-[12px] font-semibold uppercase tracking-[0.5px] rounded-[3px] hover:border-white hover:text-white transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      {/* Header */}
      <div className="bg-black border-b border-[#1a1a1a]">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src={ASSETS.logo} alt="PAPAS" width={120} height={40} className="h-9 w-auto object-contain"/>
          </Link>
          <div className="flex items-center gap-1 text-[11px]">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1">
                <button
                  onClick={() => { if (s.id !== "review" || step === "review") setStep(s.id); }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] transition-colors ${
                    step === s.id ? "text-[#f69a39] font-semibold" : "text-[#555] hover:text-[#aaa]"
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
                    step === s.id ? "bg-[#f69a39] text-white" :
                    STEPS.indexOf(STEPS.find(x=>x.id===step)!) > i ? "bg-[#22c55e] text-white" :
                    "bg-[#333] text-[#888]"
                  }`}>
                    {STEPS.indexOf(STEPS.find(x=>x.id===step)!) > i ? "✓" : s.num}
                  </span>
                  <span className="hidden sm:block">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <span className="text-[#333] mx-0.5">›</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Forms ─────────────────────────────────────────────── */}
          <div className="flex-1">

            {/* STEP 1: Delivery */}
            {step === "delivery" && (
              <form onSubmit={handleDeliverySubmit} className="bg-white rounded-[4px] border border-[#e8e8e8] p-6">
                <h2 className="text-[16px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-5">
                  Delivery Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First Name" required>
                    <input required value={delivery.firstName} onChange={e=>setDelivery(d=>({...d,firstName:e.target.value}))}
                      className={inputCls} placeholder="Rahul"/>
                  </Field>
                  <Field label="Last Name" required>
                    <input required value={delivery.lastName} onChange={e=>setDelivery(d=>({...d,lastName:e.target.value}))}
                      className={inputCls} placeholder="Sharma"/>
                  </Field>
                  <Field label="Email Address" required className="sm:col-span-2">
                    <input required type="email" value={delivery.email} onChange={e=>setDelivery(d=>({...d,email:e.target.value}))}
                      className={inputCls} placeholder="rahul@example.com"/>
                  </Field>
                  <Field label="Phone Number">
                    <input value={delivery.phone} onChange={e=>setDelivery(d=>({...d,phone:e.target.value}))}
                      className={inputCls} placeholder="+91 98765 43210"/>
                  </Field>
                  <Field label="Country">
                    <select value={delivery.country} onChange={e=>setDelivery(d=>({...d,country:e.target.value}))} className={inputCls}>
                      {["India","United Kingdom","United States","Australia","Canada","UAE"].map(c=>(
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Address" required className="sm:col-span-2">
                    <input required value={delivery.address} onChange={e=>setDelivery(d=>({...d,address:e.target.value}))}
                      className={inputCls} placeholder="Street address, apartment, suite…"/>
                  </Field>
                  <Field label="City" required>
                    <input required value={delivery.city} onChange={e=>setDelivery(d=>({...d,city:e.target.value}))}
                      className={inputCls} placeholder="Mumbai"/>
                  </Field>
                  <Field label="State">
                    <input value={delivery.state} onChange={e=>setDelivery(d=>({...d,state:e.target.value}))}
                      className={inputCls} placeholder="Maharashtra"/>
                  </Field>
                  <Field label="Postcode" required>
                    <input required value={delivery.postcode} onChange={e=>setDelivery(d=>({...d,postcode:e.target.value}))}
                      className={inputCls} placeholder="400001"/>
                  </Field>
                </div>

                {/* Delivery method */}
                <div className="mt-6">
                  <p className="text-[12px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-3">Delivery Method</p>
                  {[
                    { id: "standard", label: "Standard Delivery", sub: "5-7 business days", price: subtotal >= 100 ? "FREE" : "$9.99" },
                    { id: "express", label: "Express Delivery", sub: "2-3 business days", price: "$14.99" },
                    { id: "next-day", label: "Next Day Delivery", sub: "Order before 3pm", price: "$24.99" },
                  ].map((opt) => (
                    <label key={opt.id} className="flex items-center justify-between p-4 border border-[#e5e5e5] rounded-[3px] mb-2 cursor-pointer hover:border-[#f69a39] transition-colors group">
                      <div className="flex items-center gap-3">
                        <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${opt.id === "standard" ? "border-[#f69a39]" : "border-[#ccc] group-hover:border-[#f69a39]"}`}>
                          {opt.id === "standard" && <span className="w-2 h-2 rounded-full bg-[#f69a39] block"/>}
                        </span>
                        <div>
                          <p className="text-[13px] font-medium text-[#1e1e21]">{opt.label}</p>
                          <p className="text-[11px] text-[#888]">{opt.sub}</p>
                        </div>
                      </div>
                      <span className={`text-[13px] font-semibold ${opt.price === "FREE" ? "text-[#22c55e]" : "text-[#1e1e21]"}`}>
                        {opt.price}
                      </span>
                    </label>
                  ))}
                </div>

                <button type="submit"
                  className="mt-6 w-full bg-[#f69a39] text-white font-semibold text-[13px] uppercase tracking-[0.5px] py-4 rounded-[3px] hover:bg-[#e8880d] transition-colors">
                  Continue to Payment →
                </button>
              </form>
            )}

            {/* STEP 2: Payment */}
            {step === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="bg-white rounded-[4px] border border-[#e8e8e8] p-6">
                <h2 className="text-[16px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-5">
                  Payment Method
                </h2>

                {/* Method tabs */}
                <div className="flex gap-2 mb-6">
                  {[
                    { id: "card", label: "Credit / Debit Card" },
                    { id: "paypal", label: "PayPal" },
                    { id: "upi", label: "UPI" },
                  ].map((m) => (
                    <button key={m.id} type="button"
                      onClick={() => setPayment(p=>({...p, method: m.id}))}
                      className={`flex-1 py-2.5 text-[12px] font-semibold border rounded-[3px] transition-all ${
                        payment.method === m.id
                          ? "border-[#f69a39] bg-[#fff8f0] text-[#f69a39]"
                          : "border-[#e5e5e5] text-[#888] hover:border-[#ccc]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {payment.method === "card" && (
                  <div className="space-y-4">
                    <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-[3px] p-4 flex items-center justify-between">
                      <div className="flex gap-3">
                        {["VISA","MC","AMEX"].map(c=>(
                          <span key={c} className="text-[10px] font-bold text-[#888] border border-[#ddd] rounded px-1.5 py-0.5">{c}</span>
                        ))}
                      </div>
                      <svg className="w-4 h-4 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <Field label="Name on Card" required>
                      <input required value={payment.nameOnCard} onChange={e=>setPayment(p=>({...p,nameOnCard:e.target.value}))}
                        className={inputCls} placeholder="RAHUL SHARMA"/>
                    </Field>
                    <Field label="Card Number" required>
                      <input required value={payment.cardNumber} onChange={e=>setPayment(p=>({...p,cardNumber:e.target.value}))}
                        className={inputCls} placeholder="1234 5678 9012 3456" maxLength={19}/>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Expiry Date" required>
                        <input required value={payment.expiry} onChange={e=>setPayment(p=>({...p,expiry:e.target.value}))}
                          className={inputCls} placeholder="MM / YY" maxLength={7}/>
                      </Field>
                      <Field label="CVV" required>
                        <input required value={payment.cvv} onChange={e=>setPayment(p=>({...p,cvv:e.target.value}))}
                          className={inputCls} placeholder="•••" maxLength={4} type="password"/>
                      </Field>
                    </div>
                  </div>
                )}

                {payment.method === "paypal" && (
                  <div className="text-center py-8">
                    <p className="text-[13px] text-[#888] mb-4">You&apos;ll be redirected to PayPal to complete your payment securely.</p>
                    <div className="bg-[#ffc439] text-[#003087] font-bold text-[16px] py-3 px-8 rounded-[3px] inline-block">PayPal</div>
                  </div>
                )}

                {payment.method === "upi" && (
                  <Field label="UPI ID" required>
                    <input required className={inputCls} placeholder="yourname@paytm"/>
                  </Field>
                )}

                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setStep("delivery")}
                    className="flex-1 py-4 border-2 border-[#e5e5e5] text-[#888] text-[12px] font-semibold uppercase tracking-[0.5px] rounded-[3px] hover:border-[#1e1e21] hover:text-[#1e1e21] transition-all">
                    ← Back
                  </button>
                  <button type="submit"
                    className="flex-1 bg-[#f69a39] text-white font-semibold text-[13px] uppercase tracking-[0.5px] py-4 rounded-[3px] hover:bg-[#e8880d] transition-colors">
                    Review Order →
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Review */}
            {step === "review" && (
              <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-6">
                <h2 className="text-[16px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-5">
                  Review Your Order
                </h2>

                {/* Delivery summary */}
                <div className="border border-[#f0f0f0] rounded-[3px] p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-semibold text-[#1e1e21] uppercase tracking-wide">Delivery Address</p>
                    <button onClick={() => setStep("delivery")} className="text-[11px] text-[#f69a39] underline">Edit</button>
                  </div>
                  <p className="text-[13px] text-[#444]">{delivery.firstName} {delivery.lastName}</p>
                  <p className="text-[12px] text-[#888]">{delivery.address}</p>
                  <p className="text-[12px] text-[#888]">{delivery.city}{delivery.state ? `, ${delivery.state}` : ""} {delivery.postcode}</p>
                  <p className="text-[12px] text-[#888]">{delivery.country}</p>
                </div>

                {/* Payment summary */}
                <div className="border border-[#f0f0f0] rounded-[3px] p-4 mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-semibold text-[#1e1e21] uppercase tracking-wide">Payment</p>
                    <button onClick={() => setStep("payment")} className="text-[11px] text-[#f69a39] underline">Edit</button>
                  </div>
                  <p className="text-[13px] text-[#444] capitalize">{payment.method === "card" ? `Card ending ****${payment.cardNumber.slice(-4) || "XXXX"}` : payment.method}</p>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-5">
                  {SAMPLE_ITEMS.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="relative w-14 h-14 bg-[#f8f8f8] rounded-[3px] overflow-hidden flex-shrink-0">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover"/>
                        <span className="absolute -top-1 -right-1 bg-[#f69a39] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{item.quantity}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-[#1e1e21] leading-snug line-clamp-1">{item.product.name}</p>
                        <p className="text-[10px] text-[#888]">Size: {item.size}</p>
                      </div>
                      <p className="text-[13px] font-semibold text-[#f69a39]">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-[#aaa] leading-relaxed mb-5">
                  By placing your order you agree to our{" "}
                  <Link href="/terms" className="text-[#f69a39] underline">Terms & Conditions</Link> and{" "}
                  <Link href="/privacy" className="text-[#f69a39] underline">Privacy Policy</Link>.
                </p>

                <div className="flex gap-3">
                  <button onClick={() => setStep("payment")}
                    className="flex-1 py-4 border-2 border-[#e5e5e5] text-[#888] text-[12px] font-semibold uppercase tracking-[0.5px] rounded-[3px] hover:border-[#1e1e21] hover:text-[#1e1e21] transition-all">
                    ← Back
                  </button>
                  <button onClick={handlePlaceOrder}
                    className="flex-1 bg-[#f69a39] text-white font-semibold text-[14px] uppercase tracking-[0.5px] py-4 rounded-[3px] hover:bg-[#e8880d] transition-colors">
                    Place Order · ${total.toFixed(2)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Order Summary Sidebar ────────────────────────────── */}
          <div className="w-full lg:w-[300px] flex-shrink-0">
            <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-5 sticky top-6">
              <p className="text-[13px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-4">
                Order ({SAMPLE_ITEMS.reduce((s,i)=>s+i.quantity,0)} items)
              </p>
              <div className="space-y-3 mb-4">
                {SAMPLE_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-[#f8f8f8] rounded-[3px] overflow-hidden flex-shrink-0">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-[#1e1e21] line-clamp-2 leading-snug">{item.product.name}</p>
                      <p className="text-[10px] text-[#888]">Qty: {item.quantity} · Size: {item.size}</p>
                    </div>
                    <p className="text-[12px] font-semibold text-[#f69a39] flex-shrink-0">${(item.product.price*item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#f0f0f0] pt-3 space-y-2 text-[12px]">
                <div className="flex justify-between"><span className="text-[#888]">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-[#888]">Shipping</span><span className="text-[#22c55e] font-semibold">FREE</span></div>
                <div className="flex justify-between font-bold text-[14px] pt-1 border-t border-[#f0f0f0]">
                  <span>Total</span>
                  <span className="text-[#f69a39]">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] text-[#1e1e21] outline-none focus:border-[#f69a39] transition-colors bg-white placeholder-[#bbb]";

function Field({ label, required, children, className }: {
  label: string; required?: boolean; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">
        {label}{required && <span className="text-[#f69a39] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
