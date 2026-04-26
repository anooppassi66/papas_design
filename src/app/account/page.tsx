"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS } from "@/lib/data";

type Tab = "orders" | "addresses" | "preferences" | "profile";

const ORDERS = [
  { id: "PAPAS-28471", date: "18 Apr 2025", status: "Delivered",   statusColor: "text-[#22c55e] bg-[#f0fdf4] border-[#86efac]",   total: 240, items: [PRODUCTS[0]] },
  { id: "PAPAS-27930", date: "02 Apr 2025", status: "Processing",  statusColor: "text-[#f69a39] bg-[#fff8f0] border-[#fcd34d]",   total: 160, items: [PRODUCTS[1], PRODUCTS[2]] },
  { id: "PAPAS-26543", date: "15 Mar 2025", status: "Cancelled",   statusColor: "text-[#e24b4a] bg-[#fef2f2] border-[#fca5a5]",   total: 95, items: [PRODUCTS[5]] },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showRegister, setShowRegister] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="bg-[#f4f4f4] min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-[#1e1e21] text-[22px] font-semibold uppercase tracking-wide">
              {showRegister ? "Create Account" : "Sign In"}
            </h1>
            <p className="text-[#888] text-[13px] mt-1">
              {showRegister ? "Join PAPAS Cricket today" : "Welcome back to PAPAS Cricket"}
            </p>
          </div>

          <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-7 shadow-sm">
            {!showRegister ? (
              /* Login form */
              <form onSubmit={e=>{ e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">Email Address</label>
                  <input type="email" required value={loginData.email} onChange={e=>setLoginData(d=>({...d,email:e.target.value}))}
                    placeholder="you@example.com"
                    className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39] transition-colors"/>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px]">Password</label>
                    <Link href="#" className="text-[11px] text-[#f69a39] hover:underline">Forgot password?</Link>
                  </div>
                  <input type="password" required value={loginData.password} onChange={e=>setLoginData(d=>({...d,password:e.target.value}))}
                    placeholder="••••••••"
                    className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39] transition-colors"/>
                </div>
                <button type="submit"
                  className="w-full bg-[#f69a39] text-white font-semibold text-[13px] uppercase tracking-[0.5px] py-3.5 rounded-[3px] hover:bg-[#e8880d] transition-colors mt-2">
                  Sign In
                </button>
              </form>
            ) : (
              /* Register form */
              <form onSubmit={e=>{ e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">First Name</label>
                    <input required className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]" placeholder="Rahul"/>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">Last Name</label>
                    <input required className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]" placeholder="Sharma"/>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">Email Address</label>
                  <input type="email" required className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]" placeholder="you@example.com"/>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">Password</label>
                  <input type="password" required className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]" placeholder="Min. 8 characters"/>
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 accent-[#f69a39]"/>
                  <span className="text-[11px] text-[#888] leading-relaxed">
                    I agree to the <Link href="/terms" className="text-[#f69a39] underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-[#f69a39] underline">Privacy Policy</Link>
                  </span>
                </label>
                <button type="submit"
                  className="w-full bg-[#f69a39] text-white font-semibold text-[13px] uppercase tracking-[0.5px] py-3.5 rounded-[3px] hover:bg-[#e8880d] transition-colors">
                  Create Account
                </button>
              </form>
            )}

            <div className="mt-5 text-center">
              <p className="text-[12px] text-[#888]">
                {showRegister ? "Already have an account? " : "Don't have an account? "}
                <button onClick={() => setShowRegister(!showRegister)} className="text-[#f69a39] font-semibold hover:underline">
                  {showRegister ? "Sign In" : "Create one"}
                </button>
              </p>
            </div>
          </div>

          {/* Social login */}
          <div className="mt-4 text-center">
            <p className="text-[11px] text-[#aaa] mb-3">or continue with</p>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 border border-[#e5e5e5] bg-white rounded-[3px] py-2.5 text-[12px] font-medium text-[#444] hover:border-[#ccc] transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border border-[#e5e5e5] bg-white rounded-[3px] py-2.5 text-[12px] font-medium text-[#444] hover:border-[#ccc] transition-colors">
                <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      {/* Header */}
      <div className="bg-black">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-3 text-[11px] text-[#888] flex items-center gap-2">
          <Link href="/" className="hover:text-[#f69a39] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">My Account</span>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-6 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#f69a39] rounded-full flex items-center justify-center text-white font-bold text-[18px] flex-shrink-0">
              R
            </div>
            <div>
              <h1 className="text-white text-[18px] font-semibold">Welcome back, Rahul</h1>
              <p className="text-[#888] text-[12px]">rahul@example.com</p>
            </div>
          </div>
          <button onClick={() => setIsLoggedIn(false)}
            className="text-[12px] text-[#888] hover:text-[#f69a39] transition-colors border border-[#333] px-4 py-2 rounded-[3px]">
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar tabs */}
          <aside className="w-full md:w-[220px] flex-shrink-0">
            <div className="bg-white rounded-[4px] border border-[#e8e8e8] overflow-hidden">
              {([ ["orders","My Orders","🛍"], ["addresses","Addresses","📍"], ["preferences","Preferences","⚙"], ["profile","Profile","👤"] ] as const).map(([id, label, icon]) => (
                <button key={id} onClick={() => setActiveTab(id as Tab)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-[13px] font-medium border-l-2 transition-all text-left ${
                    activeTab === id
                      ? "border-l-[#f69a39] bg-[#fff8f0] text-[#f69a39]"
                      : "border-l-transparent text-[#444] hover:bg-[#fafafa] hover:text-[#1e1e21]"
                  }`}
                >
                  <span className="text-base">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === "orders" && (
              <div>
                <h2 className="text-[16px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-4">My Orders</h2>
                <div className="space-y-3">
                  {ORDERS.map((order) => (
                    <div key={order.id} className="bg-white rounded-[4px] border border-[#e8e8e8] p-5 hover:border-[#f69a39] transition-colors">
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <div>
                          <p className="text-[13px] font-bold text-[#1e1e21] font-mono">#{order.id}</p>
                          <p className="text-[11px] text-[#888] mt-0.5">{order.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border ${order.statusColor}`}>
                            {order.status}
                          </span>
                          <span className="text-[#f69a39] font-bold text-[15px]">${order.total}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        {order.items.map((product, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="relative w-10 h-10 bg-[#f8f8f8] rounded-[3px] overflow-hidden flex-shrink-0">
                              <Image src={product.image} alt={product.name} fill className="object-cover"/>
                            </div>
                            <p className="text-[11px] text-[#444] line-clamp-1 max-w-[180px]">{product.name}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-[#f5f5f5]">
                        <Link href={`/products/${order.items[0].slug}`}
                          className="text-[11px] font-semibold text-[#f69a39] hover:underline">
                          View Items
                        </Link>
                        {order.status === "Delivered" && (
                          <span className="text-[#ddd]">·</span>
                        )}
                        {order.status === "Delivered" && (
                          <button className="text-[11px] font-semibold text-[#888] hover:text-[#1e1e21] transition-colors">
                            Write a Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[16px] font-semibold text-[#1e1e21] uppercase tracking-wide">My Addresses</h2>
                  <button className="text-[12px] font-semibold text-[#f69a39] border border-[#f69a39] px-4 py-2 rounded-[3px] hover:bg-[#f69a39] hover:text-white transition-all">
                    + Add Address
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Home", name: "Rahul Sharma", addr: "123, MG Road, Bandra West", city: "Mumbai, Maharashtra 400050", default: true },
                    { label: "Office", name: "Rahul Sharma", addr: "456, Nariman Point", city: "Mumbai, Maharashtra 400021", default: false },
                  ].map((a) => (
                    <div key={a.label} className={`bg-white rounded-[4px] border p-4 ${a.default ? "border-[#f69a39]" : "border-[#e8e8e8]"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${a.default ? "bg-[#f69a39] text-white" : "bg-[#f0f0f0] text-[#888]"}`}>
                          {a.default ? "Default" : a.label}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-[11px] text-[#f69a39] hover:underline">Edit</button>
                          {!a.default && <button className="text-[11px] text-[#e24b4a] hover:underline">Delete</button>}
                        </div>
                      </div>
                      <p className="text-[13px] font-medium text-[#1e1e21]">{a.name}</p>
                      <p className="text-[12px] text-[#888] mt-0.5">{a.addr}</p>
                      <p className="text-[12px] text-[#888]">{a.city}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div>
                <h2 className="text-[16px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-4">My Preferences</h2>
                <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-6 space-y-5">
                  <p className="text-[13px] font-semibold text-[#1e1e21] uppercase tracking-wide border-b border-[#f0f0f0] pb-3">
                    Email Notifications
                  </p>
                  {[
                    { label: "Order updates & tracking", checked: true },
                    { label: "Promotions & sale alerts", checked: true },
                    { label: "New arrivals & launches", checked: false },
                    { label: "Wishlist back in stock", checked: true },
                    { label: "Newsletter", checked: false },
                  ].map((pref) => (
                    <label key={pref.label} className="flex items-center justify-between cursor-pointer group">
                      <span className="text-[13px] text-[#444]">{pref.label}</span>
                      <div className={`relative w-10 h-5 rounded-full transition-colors ${pref.checked ? "bg-[#f69a39]" : "bg-[#ddd]"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${pref.checked ? "translate-x-5" : "translate-x-0.5"}`}/>
                      </div>
                    </label>
                  ))}
                  <button className="mt-4 bg-[#f69a39] text-white text-[12px] font-semibold uppercase tracking-[0.5px] px-6 py-2.5 rounded-[3px] hover:bg-[#e8880d] transition-colors">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h2 className="text-[16px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-4">My Profile</h2>
                <div className="bg-white rounded-[4px] border border-[#e8e8e8] p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[["First Name","Rahul"],["Last Name","Sharma"],["Email","rahul@example.com"],["Phone","+91 98765 43210"]].map(([label, val]) => (
                      <div key={label}>
                        <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">{label}</label>
                        <input defaultValue={val} className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]"/>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#f0f0f0]">
                    <p className="text-[12px] font-semibold text-[#1e1e21] uppercase tracking-wide mb-3">Change Password</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {["Current Password","New Password","Confirm Password"].map((label) => (
                        <div key={label}>
                          <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-[0.5px] mb-1.5">{label}</label>
                          <input type="password" className="w-full border border-[#e5e5e5] rounded-[3px] px-3 py-2.5 text-[13px] outline-none focus:border-[#f69a39]" placeholder="••••••••"/>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button className="bg-[#f69a39] text-white text-[12px] font-semibold uppercase tracking-[0.5px] px-6 py-2.5 rounded-[3px] hover:bg-[#e8880d] transition-colors">
                      Save Changes
                    </button>
                    <button className="border border-[#e5e5e5] text-[#888] text-[12px] font-semibold uppercase tracking-[0.5px] px-6 py-2.5 rounded-[3px] hover:border-[#ccc] transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
