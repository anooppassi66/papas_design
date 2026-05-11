"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TOPICS = [
  {
    slug: "delivery",
    title: "Delivery & Shipping",
    description: "Delivery times, costs, tracking and international orders.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    slug: "returns",
    title: "Returns & Refunds",
    description: "How to return items, refund timelines and exchange policy.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M3 12a9 9 0 0 0 9 9 9 9 0 0 0 6.36-2.64"/><path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-6.36 2.64"/><polyline points="21 3 21 12 12 12"/>
      </svg>
    ),
  },
  {
    slug: "orders",
    title: "Orders & Tracking",
    description: "View, amend or cancel orders and track your delivery.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>
      </svg>
    ),
  },
  {
    slug: "payments",
    title: "Payment & Billing",
    description: "Accepted payment methods, invoices and billing queries.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    slug: "account",
    title: "My Account",
    description: "Manage your profile, password, addresses and preferences.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    slug: "products",
    title: "Products & Sizing",
    description: "Size guides, product care and equipment advice.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    slug: "gift-cards",
    title: "Gift Cards",
    description: "How to buy, redeem and check your gift card balance.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/><path d="M8 7V5a2 2 0 0 1 4 0v2"/><line x1="12" y1="7" x2="12" y2="21"/><line x1="2" y1="12" x2="22" y2="12"/>
      </svg>
    ),
  },
  {
    slug: "contact",
    title: "Contact Us",
    description: "Get in touch with our expert team via chat, email or phone.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
];

const POPULAR_FAQS = [
  { q: "How long does standard delivery take?", topic: "delivery" },
  { q: "Can I track my order?", topic: "orders" },
  { q: "What is your returns policy?", topic: "returns" },
  { q: "How do I exchange an item?", topic: "returns" },
  { q: "Which payment methods do you accept?", topic: "payments" },
  { q: "How do I change or cancel my order?", topic: "orders" },
  { q: "Do you offer international shipping?", topic: "delivery" },
  { q: "How do I use a gift card?", topic: "gift-cards" },
];

export default function HelpCentrePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Find best matching topic
    const q = searchQuery.toLowerCase();
    const match = TOPICS.find((t) =>
      t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
    if (match) router.push(`/help/${match.slug}?q=${encodeURIComponent(searchQuery)}`);
    else router.push(`/help/contact`);
  };

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      {/* Hero */}
      <div className="bg-[#1e1e21] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #f69a39 0%, transparent 60%)" }} />
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-16 md:py-24 relative text-center">
          <p className="text-[#f69a39] text-[11px] font-semibold uppercase tracking-[2px] mb-3">Support</p>
          <h1 className="text-white text-[32px] md:text-[48px] font-bold leading-tight mb-3">
            How can we help you?
          </h1>
          <p className="text-[#888] text-[15px] mb-8">Search our help centre or browse topics below</p>

          <form onSubmit={handleSearch} className="max-w-[560px] mx-auto">
            <div className="flex items-center bg-white rounded-[6px] overflow-hidden shadow-lg h-[52px]">
              <div className="pl-4 pr-3 flex-shrink-0">
                <svg className="w-5 h-5 text-[#aaa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. track my order, returns policy..."
                className="flex-1 h-full text-[14px] text-[#1e1e21] outline-none bg-transparent placeholder-[#bbb]"
              />
              <button type="submit" className="h-full px-6 bg-[#f69a39] text-white text-[13px] font-semibold hover:bg-[#e8880d] transition-colors flex-shrink-0">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Topic cards */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-12">
        <h2 className="text-[#1e1e21] text-[18px] font-semibold uppercase tracking-[0.5px] mb-6">Browse by topic</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {TOPICS.map((topic) => (
            <Link
              key={topic.slug}
              href={`/help/${topic.slug}`}
              className="bg-white rounded-[6px] border border-[#e8e8e8] p-5 hover:border-[#f69a39] hover:shadow-md transition-all group"
            >
              <div className="text-[#f69a39] mb-4">{topic.icon}</div>
              <h3 className="text-[14px] font-semibold text-[#1e1e21] mb-1.5 group-hover:text-[#f69a39] transition-colors">{topic.title}</h3>
              <p className="text-[12px] text-[#888] leading-relaxed">{topic.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular questions */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-12">
        <div className="bg-white rounded-[6px] border border-[#e8e8e8] p-6 md:p-8">
          <h2 className="text-[18px] font-semibold text-[#1e1e21] uppercase tracking-[0.5px] mb-6">Popular Questions</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {POPULAR_FAQS.map((faq, i) => (
              <Link
                key={i}
                href={`/help/${faq.topic}`}
                className="flex items-center gap-3 p-3.5 rounded-[4px] hover:bg-[#fff8f0] border border-transparent hover:border-[#f69a39]/30 transition-all group"
              >
                <svg className="w-4 h-4 text-[#f69a39] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-[13px] text-[#444] group-hover:text-[#1e1e21] transition-colors">{faq.q}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Contact options */}
      <div className="bg-[#1e1e21]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-12">
          <div className="text-center mb-8">
            <h2 className="text-white text-[22px] font-semibold mb-2">Still need help?</h2>
            <p className="text-[#888] text-[14px]">Our expert team is available 7 days a week</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 max-w-[800px] mx-auto">
            {/* <Link href="/help/contact" className="bg-[#2a2a2d] rounded-[6px] p-6 text-center hover:bg-[#f69a39] transition-all group border border-[#333] hover:border-[#f69a39]">
              <svg className="w-8 h-8 mx-auto mb-3 text-[#f69a39] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <h3 className="text-white text-[14px] font-semibold mb-1">Live Chat</h3>
              <p className="text-[#888] group-hover:text-white/80 text-[12px] transition-colors">Chat with us now</p>
            </Link> */}
            <a href="mailto:support@papaswillow.com" className="bg-[#2a2a2d] rounded-[6px] p-6 text-center hover:bg-[#f69a39] transition-all group border border-[#333] hover:border-[#f69a39]">
              <svg className="w-8 h-8 mx-auto mb-3 text-[#f69a39] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
              </svg>
              <h3 className="text-white text-[14px] font-semibold mb-1">Email Us</h3>
              <p className="text-[#888] group-hover:text-white/80 text-[12px] transition-colors">support@papaswillow.com</p>
            </a>
            <a href="tel:+14093443513" className="bg-[#2a2a2d] rounded-[6px] p-6 text-center hover:bg-[#f69a39] transition-all group border border-[#333] hover:border-[#f69a39]">
              <svg className="w-8 h-8 mx-auto mb-3 text-[#f69a39] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h3 className="text-white text-[14px] font-semibold mb-1">Call Us</h3>
              <p className="text-[#888] group-hover:text-white/80 text-[12px] transition-colors">409-344-3513</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
