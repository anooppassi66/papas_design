"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ASSETS } from "@/lib/data";
import { getUser, isLoggedIn } from "@/lib/customerApi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
const DENOMINATIONS = [25, 50, 75, 100, 150, 200, 250];

type ForSelf = "self" | "other";
type PurchaseState = "idle" | "loading" | "success" | "error";

interface SuccessData { code: string; amount: number; }

export default function GiftCardsPage() {
  const [amount, setAmount] = useState<number>(50);
  const [forSelf, setForSelf] = useState<ForSelf>("other");
  const [form, setForm] = useState({
    purchaser_name: "", purchaser_email: "",
    recipient_name: "", recipient_email: "", message: "",
  });

  useEffect(() => {
    if (isLoggedIn()) {
      const u = getUser();
      if (u) {
        setForm(f => ({
          ...f,
          purchaser_name: `${String(u.first_name || "")} ${String(u.last_name || "")}`.trim(),
          purchaser_email: String(u.email || ""),
        }));
      }
    }
  }, []);
  const [state, setState] = useState<PurchaseState>("idle");
  const [success, setSuccess] = useState<SuccessData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  function setField(key: keyof typeof form, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("customer_token") : null;
      const res = await fetch(`${API}/gift-cards/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          amount,
          for_self: forSelf === "self",
          purchaser_name: form.purchaser_name,
          purchaser_email: form.purchaser_email,
          recipient_name: form.recipient_name,
          recipient_email: form.recipient_email,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || "Something went wrong"); setState("error"); return; }
      setSuccess({ code: data.code, amount: data.amount });
      setState("success");
    } catch {
      setErrorMsg("Could not connect. Please try again.");
      setState("error");
    }
  }

  if (state === "success" && success) {
    return (
      <main className="bg-[#f4f4f4] min-h-screen flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-8 md:p-12 max-w-[520px] w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-[#f69a39]/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-[#f69a39]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <p className="text-[#f69a39] text-[11px] tracking-[2px] uppercase font-semibold mb-2">Gift Card Purchased!</p>
          <h1 className="text-[#1e1e21] text-[26px] font-bold mb-2">${success.amount.toFixed(2)} Gift Card</h1>
          <p className="text-[#888] text-[13px] mb-6">Save this code — it can be used at checkout to redeem your gift card.</p>

          {/* Code display */}
          <div className="bg-[#1e1e21] rounded-lg px-6 py-5 mb-6">
            <p className="text-white/40 text-[10px] tracking-[2px] uppercase mb-2">Your Gift Card Code</p>
            <p className="text-[#f69a39] text-[22px] font-bold font-mono tracking-wider">{success.code}</p>
          </div>

          <p className="text-[#aaa] text-[12px] mb-8">Valid for 2 years. Can be used across multiple purchases until the balance is spent.</p>

          <div className="flex gap-3">
            <button
              onClick={() => { setState("idle"); setSuccess(null); setForm({ purchaser_name: "", purchaser_email: "", recipient_name: "", recipient_email: "", message: "" }); }}
              className="flex-1 py-3 border border-[#e5e5e5] text-[#888] text-[12px] font-semibold rounded-[3px] hover:border-[#ccc] transition-colors"
            >
              Buy Another
            </button>
            <Link href="/products" className="flex-1 py-3 bg-[#f69a39] text-white text-[12px] font-semibold rounded-[3px] hover:bg-[#e8880d] transition-colors text-center">
              Shop Now
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f4f4f4] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-black border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-3 text-[11px] text-[#888] flex items-center gap-2">
          <Link href="/" className="hover:text-[#f69a39]">Home</Link>
          <span>/</span>
          <span className="text-white">Gift Cards</span>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 md:px-10 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Left — visual */}
          <div className="lg:w-[420px] flex-shrink-0">
            {/* Gift card visual */}
            <div className="relative rounded-2xl overflow-hidden bg-[#1e1e21] aspect-[16/10] shadow-xl mb-6">
              <div className="absolute inset-0 opacity-30"
                style={{ background: "radial-gradient(ellipse 80% 100% at 30% 60%, #f69a39 0%, transparent 65%)" }} />
              <div className="absolute inset-0 p-7 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <Image src={ASSETS.logo} alt="PAPAS" width={120} height={40} className="h-8 w-auto object-contain" />
                  <svg className="w-8 h-8 text-[#f69a39]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-[2px] mb-1">Gift Card</p>
                  <p className="text-white text-[36px] font-bold">${amount}.00</p>
                  <p className="text-[#f69a39] text-[11px] mt-1">PAPAS-XXXX-XXXX-XXXX</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-5">
              <h3 className="text-[12px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-3">How it works</h3>
              <ul className="space-y-3">
                {[
                  { icon: "1", text: "Choose an amount and fill in the details below" },
                  { icon: "2", text: "You'll receive a unique gift card code instantly" },
                  { icon: "3", text: "Use the code at checkout to redeem your balance" },
                  { icon: "4", text: "Valid for 2 years — use across multiple purchases" },
                ].map(s => (
                  <li key={s.icon} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#f69a39] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{s.icon}</span>
                    <span className="text-[12px] text-[#666] leading-relaxed">{s.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — form */}
          <div className="flex-1">
            <h1 className="text-[28px] md:text-[36px] font-bold text-[#1e1e21] tracking-tight mb-1">PAPAS Gift Cards</h1>
            <p className="text-[#888] text-[14px] mb-7">The perfect gift for any cricketer.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount selector */}
              <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-5">
                <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-3">Select Amount</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {DENOMINATIONS.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setAmount(d)}
                      className={`py-2.5 rounded-[3px] text-[13px] font-bold border-2 transition-colors ${
                        amount === d
                          ? "border-[#f69a39] bg-[#f69a39] text-white"
                          : "border-[#e5e5e5] text-[#1e1e21] hover:border-[#f69a39]/50"
                      }`}
                    >
                      ${d}
                    </button>
                  ))}
                </div>
              </div>

              {/* For self / other toggle */}
              <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-5">
                <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-3">This gift card is for</label>
                <div className="flex gap-3">
                  {(["other", "self"] as ForSelf[]).map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setForSelf(v)}
                      className={`flex-1 py-2.5 rounded-[3px] text-[12px] font-semibold border-2 transition-colors ${
                        forSelf === v
                          ? "border-[#f69a39] bg-[#f69a39]/5 text-[#f69a39]"
                          : "border-[#e5e5e5] text-[#888] hover:border-[#ccc]"
                      }`}
                    >
                      {v === "other" ? "Someone else" : "Myself"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Your details */}
              <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-5">
                <h3 className="text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-4">Your Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-[#888] mb-1.5">Your Name</label>
                    <input
                      type="text"
                      value={form.purchaser_name}
                      onChange={e => setField("purchaser_name", e.target.value)}
                      placeholder="John Smith"
                      className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#888] mb-1.5">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={form.purchaser_email}
                      onChange={e => setField("purchaser_email", e.target.value)}
                      placeholder="you@example.com"
                      className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]"
                    />
                  </div>
                </div>
              </div>

              {/* Recipient details (if for someone else) */}
              {forSelf === "other" && (
                <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-5">
                  <h3 className="text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-4">Recipient Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[11px] font-medium text-[#888] mb-1.5">Recipient Name</label>
                      <input
                        type="text"
                        value={form.recipient_name}
                        onChange={e => setField("recipient_name", e.target.value)}
                        placeholder="Jane Smith"
                        className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#888] mb-1.5">Recipient Email *</label>
                      <input
                        type="email"
                        required={forSelf === "other"}
                        value={form.recipient_email}
                        onChange={e => setField("recipient_email", e.target.value)}
                        placeholder="recipient@example.com"
                        className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#888] mb-1.5">Personal Message (optional)</label>
                    <textarea
                      value={form.message}
                      onChange={e => setField("message", e.target.value)}
                      rows={3}
                      placeholder="Happy birthday! Hope this helps you gear up for the season…"
                      className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39] resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Error */}
              {state === "error" && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-[12px] rounded">
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={state === "loading"}
                className="w-full py-4 bg-[#f69a39] hover:bg-[#e8880d] text-white font-bold text-[14px] uppercase tracking-[0.5px] rounded-[3px] transition-colors disabled:opacity-60"
              >
                {state === "loading" ? "Processing…" : `Purchase $${amount}.00 Gift Card`}
              </button>

              <p className="text-center text-[11px] text-[#aaa]">
                Gift card code is generated instantly and valid for 2 years from purchase date.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
