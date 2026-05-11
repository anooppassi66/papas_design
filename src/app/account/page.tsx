"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { customerApi, saveAuth, getUser, clearAuth, isLoggedIn, UPLOADS } from "@/lib/customerApi";

type Tab = "orders" | "addresses" | "profile" | "gift-cards" | "returns";

interface Order {
  order_no: string; date: string; status: string; order_status: string; total: number;
  items: { product_name: string; product_slug: string; product_image: string | null; quantity: number; price: number; variant_size: string; }[];
}
interface ReturnRequest { id: number; order_no: string; reason: string; message: string | null; status: string; admin_note: string | null; created_at: string; }

const RETURN_REASONS = ['Wrong item received', 'Item damaged or defective', 'Not as described', 'Changed my mind', 'Missing parts or accessories', 'Other'];
const RETURN_WINDOW_DAYS = 30;
const SUPPORT_EMAIL = "support@papaswillow.com.au";
interface Address { id: number; line1: string; line2: string; city: string; state: string; pincode: string; is_default: boolean; }
interface GiftCard { id: number; code: string; amount: number; balance: number; card_type: "purchased" | "received"; recipient_name: string; recipient_email: string; message: string; is_active: number; created_at: string; expires_at: string; }
interface User { id: number; name: string; first_name: string; last_name: string; email: string; phone: string; }

const STATUS_STYLE: Record<string, string> = {
  pending:    "text-[#f69a39] bg-[#fff8f0] border-[#fcd34d]",
  paid:       "text-[#22c55e] bg-[#f0fdf4] border-[#86efac]",
  processing: "text-[#f69a39] bg-[#fff8f0] border-[#fcd34d]",
  shipped:    "text-blue-600 bg-blue-50 border-blue-200",
  delivered:  "text-[#22c55e] bg-[#f0fdf4] border-[#86efac]",
  cancelled:  "text-[#e24b4a] bg-[#fef2f2] border-[#fca5a5]",
};

export default function AccountPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [returnModal, setReturnModal] = useState(false);
  const [returnOrderNo, setReturnOrderNo] = useState("");
  const [returnReason, setReturnReason] = useState(RETURN_REASONS[0]);
  const [returnMessage, setReturnMessage] = useState("");
  const [returnSubmitting, setReturnSubmitting] = useState(false);
  const [returnError, setReturnError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [regData, setRegData] = useState({ first_name: "", last_name: "", email: "", password: "" });
  const [profileData, setProfileData] = useState({ first_name: "", last_name: "", phone: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      setLoggedIn(true);
      const u = getUser() as User | null;
      if (u) { setUser(u); setProfileData({ first_name: u.first_name || "", last_name: u.last_name || "", phone: u.phone || "" }); }
      loadOrders();
      loadAddresses();
      loadGiftCards();
      loadReturns();
    }
  }, []);

  async function loadOrders() {
    try { const data = await customerApi.get("/orders") as Order[]; setOrders(data || []); } catch { /* ignore */ }
  }
  async function loadAddresses() {
    try { const data = await customerApi.get("/auth/me/addresses") as Address[]; setAddresses(data || []); } catch { /* ignore */ }
  }
  async function loadGiftCards() {
    try { const data = await customerApi.get("/gift-cards") as GiftCard[]; setGiftCards(data || []); } catch { /* ignore */ }
  }
  async function loadReturns() {
    try { const data = await customerApi.get("/returns") as ReturnRequest[]; setReturns(data || []); } catch { /* ignore */ }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setAuthError(""); setAuthLoading(true);
    try {
      const res = await customerApi.post("/auth/login", loginData) as { token: string; user: User };
      saveAuth(res.token, res.user);
      setUser(res.user); setLoggedIn(true);
      setProfileData({ first_name: res.user.first_name || "", last_name: res.user.last_name || "", phone: res.user.phone || "" });
      loadOrders(); loadAddresses();
    } catch (err) { setAuthError(err instanceof Error ? err.message : "Login failed"); }
    finally { setAuthLoading(false); }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault(); setAuthError(""); setAuthLoading(true);
    try {
      const res = await customerApi.post("/auth/register", regData) as { token: string; user: User };
      saveAuth(res.token, res.user);
      setUser(res.user); setLoggedIn(true);
      setProfileData({ first_name: res.user.first_name || "", last_name: res.user.last_name || "", phone: res.user.phone || "" });
    } catch (err) { setAuthError(err instanceof Error ? err.message : "Registration failed"); }
    finally { setAuthLoading(false); }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    try {
      await customerApi.put("/auth/me", profileData);
      const updated = { ...user, ...profileData, name: `${profileData.first_name} ${profileData.last_name}`.trim() } as User;
      setUser(updated);
      saveAuth(localStorage.getItem("customer_token") || "", updated);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch { /* ignore */ }
  }

  function handleSignOut() { clearAuth(); setLoggedIn(false); setUser(null); setOrders([]); setAddresses([]); setGiftCards([]); setReturns([]); }

  function openReturnModal(orderNo: string) {
    setReturnOrderNo(orderNo);
    setReturnReason(RETURN_REASONS[0]);
    setReturnMessage("");
    setReturnError("");
    setReturnModal(true);
  }

  async function submitReturn(e: React.FormEvent) {
    e.preventDefault();
    setReturnSubmitting(true);
    setReturnError("");
    try {
      await customerApi.post("/returns", { order_no: returnOrderNo, reason: returnReason, message: returnMessage || undefined });
      setReturnModal(false);
      await loadReturns();
    } catch (err) {
      setReturnError(err instanceof Error ? err.message : "Failed to submit return");
    } finally {
      setReturnSubmitting(false);
    }
  }

  if (!loggedIn) {
    return (
      <div className="bg-[#f4f4f4] min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-8">
            <h1 className="text-[#1e1e21] text-[22px] font-semibold uppercase tracking-wide">{showRegister ? "Create Account" : "Sign In"}</h1>
            <p className="text-[#888] text-[13px] mt-1">{showRegister ? "Join PAPAS Cricket today" : "Welcome back to PAPAS Cricket"}</p>
          </div>
          <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-7 shadow-sm">
            {authError && <div className="p-3 bg-red-50 text-red-600 text-[12px] rounded mb-4">{authError}</div>}
            {!showRegister ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">Email Address</label>
                  <input type="email" required value={loginData.email} onChange={(e) => setLoginData((d) => ({ ...d, email: e.target.value }))}
                    placeholder="you@example.com" className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39] transition-colors" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px]">Password</label>
                    <Link href="#" className="text-[11px] text-[#f69a39] hover:underline">Forgot password?</Link>
                  </div>
                  <input type="password" required value={loginData.password} onChange={(e) => setLoginData((d) => ({ ...d, password: e.target.value }))}
                    placeholder="••••••••" className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39] transition-colors" />
                </div>
                <button type="submit" disabled={authLoading} className="w-full bg-[#f69a39] text-white font-semibold text-[13px] uppercase tracking-[0.5px] py-3.5 rounded-[3px] hover:bg-[#e8880d] transition-colors disabled:opacity-60 mt-2">
                  {authLoading ? "Signing in…" : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">First Name</label>
                    <input required value={regData.first_name} onChange={(e) => setRegData((d) => ({ ...d, first_name: e.target.value }))}
                      className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]" placeholder="Rahul" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">Last Name</label>
                    <input required value={regData.last_name} onChange={(e) => setRegData((d) => ({ ...d, last_name: e.target.value }))}
                      className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]" placeholder="Sharma" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">Email Address</label>
                  <input type="email" required value={regData.email} onChange={(e) => setRegData((d) => ({ ...d, email: e.target.value }))}
                    className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">Password</label>
                  <input type="password" required minLength={8} value={regData.password} onChange={(e) => setRegData((d) => ({ ...d, password: e.target.value }))}
                    className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]" placeholder="Min. 8 characters" />
                </div>
                <button type="submit" disabled={authLoading} className="w-full bg-[#f69a39] text-white font-semibold text-[13px] uppercase tracking-[0.5px] py-3.5 rounded-[3px] hover:bg-[#e8880d] transition-colors disabled:opacity-60">
                  {authLoading ? "Creating account…" : "Create Account"}
                </button>
              </form>
            )}
            <div className="mt-5 text-center">
              <p className="text-[12px] text-[#888]">
                {showRegister ? "Already have an account? " : "Don't have an account? "}
                <button onClick={() => { setShowRegister(!showRegister); setAuthError(""); }} className="text-[#f69a39] font-semibold hover:underline">
                  {showRegister ? "Sign In" : "Create one"}
                </button>
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[11px] text-[#aaa] mb-3">or continue with</p>
            <button className="w-full flex items-center justify-center gap-2 border border-[#e5e5e5] bg-white rounded-[3px] py-2.5 text-[12px] font-medium text-[#444] hover:border-[#ccc] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initials = user ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || user.name?.[0]?.toUpperCase() || "U" : "U";

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      <div className="bg-black">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-3 text-[11px] text-[#888] flex items-center gap-2">
          <Link href="/" className="hover:text-[#f69a39]">Home</Link><span>/</span><span className="text-white">My Account</span>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-6 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#f69a39] rounded-full flex items-center justify-center text-white font-bold text-[18px]">{initials}</div>
            <div>
              <h1 className="text-white text-[18px] font-semibold">Welcome back, {user?.first_name || user?.name}</h1>
              <p className="text-[#888] text-[12px]">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="text-[12px] text-[#888] hover:text-[#f69a39] transition-colors border border-[#333] px-4 py-2 rounded-[3px]">Sign Out</button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-[220px] flex-shrink-0">
            <div className="bg-white rounded-[4px] border border-[#e8e8e8] overflow-hidden">
              {([
                ["orders",     "My Orders",  "fa-solid fa-bag-shopping"],
                ["returns",    "Returns",    "fa-solid fa-rotate-left"],
                ["addresses",  "Addresses",  "fa-solid fa-location-dot"],
                ["gift-cards", "Gift Cards", "fa-solid fa-gift"],
                ["profile",    "Profile",    "fa-solid fa-user"],
              ] as [Tab,string,string][]).map(([id, label, icon]) => (
                <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-4 py-3.5 text-[13px] font-medium border-l-2 transition-all text-left ${activeTab === id ? "border-l-[#f69a39] bg-[#fff8f0] text-[#f69a39]" : "border-l-transparent text-[#444] hover:bg-[#fafafa]"}`}>
                  <i className={`${icon} w-4 text-center text-[13px]`} />{label}
                </button>
              ))}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {activeTab === "orders" && (
              <div>
                <h2 className="text-[16px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-4">My Orders</h2>
                {orders.length === 0 ? (
                  <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-12 text-center">
                    <p className="text-[#888] text-[14px] mb-4">No orders yet</p>
                    <Link href="/products" className="px-6 py-2.5 bg-[#f69a39] text-white text-[12px] font-semibold rounded-[3px] hover:bg-[#e8880d] transition-colors">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => {
                      const existingReturn = returns.find(r => r.order_no === order.order_no);
                      const isDelivered = order.order_status === "delivered";
                      const daysSince = order.date ? Math.floor((Date.now() - new Date(order.date).getTime()) / 86400000) : 999;
                      const canReturn = isDelivered && daysSince <= RETURN_WINDOW_DAYS && !existingReturn;
                      const returnExpired = isDelivered && daysSince > RETURN_WINDOW_DAYS && !existingReturn;
                      return (
                      <div key={order.order_no} className="bg-white rounded-[4px] border border-[#e8e8e8] p-5 hover:border-[#f69a39] transition-colors">
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                          <div>
                            <p className="text-[13px] font-bold text-[#1e1e21] font-mono">#{order.order_no}</p>
                            <p className="text-[11px] text-[#888] mt-0.5">{order.date ? new Date(order.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border ${STATUS_STYLE[order.status] || STATUS_STYLE.pending}`}>{order.status}</span>
                            <span className="text-[#f69a39] font-bold text-[15px]">${Number(order.total || 0).toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {(order.items || []).slice(0, 3).map((item, i) => {
                            const imgSrc = item.product_image ? (item.product_image.startsWith("/uploads/") ? `${UPLOADS}${item.product_image}` : item.product_image) : null;
                            return (
                              <div key={i} className="flex items-center gap-2">
                                {imgSrc && (
                                  <div className="relative w-10 h-10 bg-[#f8f8f8] rounded-[3px] overflow-hidden flex-shrink-0">
                                    <Image src={imgSrc} alt={item.product_name || ""} fill className="object-cover" sizes="40px" />
                                  </div>
                                )}
                                <p className="text-[11px] text-[#444] line-clamp-1 max-w-[180px]">{item.product_name} {item.variant_size && `(${item.variant_size})`} ×{item.quantity}</p>
                              </div>
                            );
                          })}
                          {order.items?.length > 3 && <p className="text-[11px] text-[#888]">+{order.items.length - 3} more</p>}
                        </div>
                        {/* Return actions */}
                        {canReturn && (
                          <div className="mt-3 pt-3 border-t border-[#f0f0f0]">
                            <button onClick={() => openReturnModal(order.order_no)}
                              className="text-[11px] font-semibold text-[#e24b4a] border border-[#e24b4a] px-3 py-1.5 rounded-[3px] hover:bg-red-50 transition-colors">
                              Return Items
                            </button>
                          </div>
                        )}
                        {returnExpired && (
                          <div className="mt-3 pt-3 border-t border-[#f0f0f0]">
                            <p className="text-[11px] text-[#888]">Return window closed. <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#f69a39] hover:underline">Contact support</a></p>
                          </div>
                        )}
                        {existingReturn && (
                          <div className="mt-3 pt-3 border-t border-[#f0f0f0] flex items-center gap-2">
                            <span className="text-[11px] text-[#888]">Return:</span>
                            <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                              existingReturn.status === "approved" ? "bg-blue-50 text-blue-600 border-blue-200" :
                              existingReturn.status === "completed" ? "bg-green-50 text-green-600 border-green-200" :
                              existingReturn.status === "rejected" ? "bg-red-50 text-red-500 border-red-200" :
                              "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }`}>{existingReturn.status}</span>
                          </div>
                        )}
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[16px] font-semibold text-[#1e1e21] uppercase tracking-wide">My Addresses</h2>
                </div>
                {addresses.length === 0 ? (
                  <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-12 text-center">
                    <p className="text-[#888] text-[14px]">No saved addresses yet. Addresses are saved when you place an order.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addresses.map((a) => (
                      <div key={a.id} className={`bg-white rounded-[4px] border p-4 ${a.is_default ? "border-[#f69a39]" : "border-[#e8e8e8]"}`}>
                        {a.is_default && <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#f69a39] text-white inline-block mb-2">Default</span>}
                        <p className="text-[12px] text-[#444]">{a.line1}</p>
                        {a.line2 && <p className="text-[12px] text-[#888]">{a.line2}</p>}
                        <p className="text-[12px] text-[#888]">{a.city}, {a.state} {a.pincode}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "gift-cards" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[16px] font-semibold text-[#1e1e21] uppercase tracking-wide">Gift Cards</h2>
                  <Link href="/gift-cards" className="px-4 py-2 bg-[#f69a39] text-white text-[11px] font-semibold rounded-[3px] hover:bg-[#e8880d] transition-colors">
                    Buy a Gift Card
                  </Link>
                </div>
                {giftCards.length === 0 ? (
                  <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-12 text-center">
                    <p className="text-[#888] text-[14px] mb-4">No gift cards yet</p>
                    <Link href="/gift-cards" className="px-6 py-2.5 bg-[#f69a39] text-white text-[12px] font-semibold rounded-[3px] hover:bg-[#e8880d] transition-colors">
                      Buy a Gift Card
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {giftCards.map((gc) => {
                      const pct = Number(gc.amount) > 0 ? (Number(gc.balance) / Number(gc.amount)) * 100 : 0;
                      const spent = Number(gc.amount) - Number(gc.balance);
                      const isSpent = Number(gc.balance) <= 0;
                      const isDisabled = !gc.is_active;
                      return (
                        <div key={gc.id} className={`bg-white rounded-[4px] border p-5 ${isDisabled || isSpent ? "border-[#e8e8e8] opacity-60" : "border-[#e8e8e8] hover:border-[#f69a39]"} transition-colors`}>
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1 min-w-0">
                              {/* Code */}
                              <p className="font-mono text-[14px] font-bold text-[#f69a39] tracking-wider mb-1">{gc.code}</p>
                              {/* Type badge */}
                              <span className={`inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full mb-2 ${
                                gc.card_type === "received" ? "bg-blue-50 text-blue-600" : "bg-[#fff8f0] text-[#f69a39]"
                              }`}>
                                {gc.card_type === "received" ? "Received" : "Purchased"}
                              </span>
                              {/* Balance bar */}
                              <div className="mt-1 mb-2">
                                <div className="flex items-center justify-between text-[11px] text-[#888] mb-1">
                                  <span>${Number(gc.balance).toFixed(2)} remaining</span>
                                  <span>${spent.toFixed(2)} used</span>
                                </div>
                                <div className="w-full h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                                  <div className="h-full bg-[#f69a39] rounded-full transition-all" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                              {/* Recipient info (if purchased for someone) */}
                              {gc.card_type === "purchased" && gc.recipient_email && gc.recipient_email !== user?.email && (
                                <p className="text-[11px] text-[#888]">For: {gc.recipient_name || gc.recipient_email}</p>
                              )}
                              {/* Message */}
                              {gc.message && (
                                <p className="text-[11px] text-[#888] italic mt-1">&ldquo;{gc.message}&rdquo;</p>
                              )}
                            </div>
                            {/* Right side */}
                            <div className="text-right flex-shrink-0">
                              <p className="text-[22px] font-bold text-[#1e1e21]">${Number(gc.amount).toFixed(2)}</p>
                              <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                                isDisabled ? "bg-red-50 text-red-500" :
                                isSpent ? "bg-[#f0f0f0] text-[#999]" :
                                "bg-green-50 text-green-600"
                              }`}>
                                {isDisabled ? "Disabled" : isSpent ? "Spent" : "Active"}
                              </span>
                              {gc.expires_at && (
                                <p className="text-[10px] text-[#aaa] mt-1.5">
                                  Expires {new Date(gc.expires_at).toLocaleDateString("en-AU", { month: "short", year: "numeric" })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "returns" && (
              <div>
                <h2 className="text-[16px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-4">My Returns</h2>
                {returns.length === 0 ? (
                  <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-12 text-center">
                    <p className="text-[#888] text-[14px]">No return requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {returns.map((ret) => (
                      <div key={ret.id} className="bg-white rounded-[4px] border border-[#e8e8e8] p-5">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <p className="text-[13px] font-bold text-[#1e1e21] font-mono mb-0.5">#{ret.order_no}</p>
                            <p className="text-[12px] text-[#444] font-medium">{ret.reason}</p>
                            {ret.message && <p className="text-[11px] text-[#888] italic mt-0.5">&ldquo;{ret.message}&rdquo;</p>}
                            <p className="text-[10px] text-[#aaa] mt-1">{new Date(ret.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                          </div>
                          <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border flex-shrink-0 ${
                            ret.status === "approved" ? "bg-blue-50 text-blue-600 border-blue-200" :
                            ret.status === "completed" ? "bg-green-50 text-green-600 border-green-200" :
                            ret.status === "rejected" ? "bg-red-50 text-red-500 border-red-200" :
                            "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}>{ret.status}</span>
                        </div>
                        {ret.admin_note && (
                          <div className="mt-3 pt-3 border-t border-[#f0f0f0] text-[11px] text-[#666]">
                            <span className="font-semibold">Note from us: </span>{ret.admin_note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h2 className="text-[16px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-4">My Profile</h2>
                <form onSubmit={handleSaveProfile} className="bg-white rounded-[4px] border border-[#e8e8e8] p-6">
                  {profileSaved && <div className="p-3 bg-green-50 text-green-700 text-[12px] rounded mb-4">Profile updated!</div>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[["First Name","first_name"],["Last Name","last_name"],["Phone","phone"]].map(([label, key]) => (
                      <div key={key}>
                        <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">{label}</label>
                        <input value={profileData[key as keyof typeof profileData]} onChange={(e) => setProfileData((d) => ({ ...d, [key]: e.target.value }))}
                          className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">Email</label>
                      <input value={user?.email || ""} disabled className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] text-[#888] bg-[#fafafa]" />
                    </div>
                  </div>
                  <button type="submit" className="mt-5 bg-[#f69a39] text-white text-[12px] font-semibold uppercase tracking-[0.5px] px-6 py-2.5 rounded-[3px] hover:bg-[#e8880d] transition-colors">Save Changes</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Return modal */}
      {returnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-[6px] w-full max-w-[460px] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-[#1e1e21] uppercase tracking-wide">Return Items</h3>
              <button onClick={() => setReturnModal(false)} className="text-[#aaa] hover:text-[#444] transition-colors text-xl leading-none">&times;</button>
            </div>
            <p className="text-[12px] text-[#888] mb-4">Order <span className="font-mono font-bold text-[#1e1e21]">#{returnOrderNo}</span></p>
            <form onSubmit={submitReturn} className="space-y-4">
              {returnError && <div className="p-3 bg-red-50 text-red-600 text-[12px] rounded">{returnError}</div>}
              <div>
                <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">Reason for return</label>
                <select value={returnReason} onChange={e => setReturnReason(e.target.value)} required
                  className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]">
                  {RETURN_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">Additional details <span className="font-normal normal-case">(optional)</span></label>
                <textarea value={returnMessage} onChange={e => setReturnMessage(e.target.value)} rows={3}
                  placeholder="Describe the issue in more detail…"
                  className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39] resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setReturnModal(false)}
                  className="flex-1 border border-[#e5e5e5] text-[#444] text-[12px] font-semibold py-2.5 rounded-[3px] hover:border-[#ccc] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={returnSubmitting}
                  className="flex-1 bg-[#e24b4a] text-white text-[12px] font-semibold py-2.5 rounded-[3px] hover:bg-[#c73a39] transition-colors disabled:opacity-60">
                  {returnSubmitting ? "Submitting…" : "Submit Return"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
