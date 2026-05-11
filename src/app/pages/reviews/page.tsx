import Link from "next/link";

const STATS = [
  { value: "100,000+", label: "5-Star Reviews" },
  { value: "4.9", label: "Average Rating" },
  { value: "40+", label: "Years Trusted" },
];

const REVIEWS = [
  {
    name: "James H.",
    location: "Sydney, NSW",
    rating: 5,
    date: "March 2024",
    title: "Best cricket store in Australia",
    body: "Ordered a Gray-Nicolls bat and it arrived next day, perfectly pressed and with a complimentary grip fitting guide. The team answered my size query over the phone in minutes. Will never shop anywhere else.",
  },
  {
    name: "Priya M.",
    location: "Melbourne, VIC",
    rating: 5,
    date: "February 2024",
    title: "My son's first cricket kit — perfect",
    body: "The junior starter kit was exactly what we needed. Came well packaged, everything fitted properly, and the quality for the price is outstanding. The advice on the live chat was patient and genuinely helpful.",
  },
  {
    name: "Daniel W.",
    location: "Brisbane, QLD",
    rating: 5,
    date: "January 2024",
    title: "International shipping done right",
    body: "Shipped to New Zealand and arrived in four days. Tracking was accurate the whole way. The pads were exactly as described. Papas clearly know what they're doing with international orders.",
  },
  {
    name: "Ravi S.",
    location: "Perth, WA",
    rating: 5,
    date: "December 2023",
    title: "Incredible range, knowledgeable staff",
    body: "Visited the store before Christmas. The staff knew every product inside out — weight differences, wood grades, handle types. Left with exactly the right bat. That expertise is rare and worth driving across town for.",
  },
  {
    name: "Callum T.",
    location: "Adelaide, SA",
    rating: 5,
    date: "November 2023",
    title: "Hassle-free return, no questions asked",
    body: "The gloves I ordered were a touch too large. One email and the exchange was sorted within 48 hours — the right size arrived before I'd even sent the original pair back. Brilliant customer service.",
  },
  {
    name: "Sarah K.",
    location: "Canberra, ACT",
    rating: 5,
    date: "October 2023",
    title: "Brilliant for club orders",
    body: "We placed a bulk club order for 18 players — helmets, pads, gloves, all in mixed sizes. Papas handled it without a single error. Every item correct, packed individually with names labelled. Absolute legends.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < count ? "text-[#f69a39]" : "text-white/15"}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 3.9 2.4-7.4L2 9.4h7.6z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <main className="bg-[#0f0f0f] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[#111] border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[42px] py-3">
          <nav className="flex items-center gap-2 text-[12px] text-white/30">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/50">Customer Reviews</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, #f69a39 0%, transparent 65%)" }} />
        <div className="relative max-w-[800px] mx-auto px-4 md:px-[42px] text-center">
          {/* Trustpilot-style star display */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className="w-8 h-8 text-[#f69a39]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 3.9 2.4-7.4L2 9.4h7.6z" />
              </svg>
            ))}
          </div>
          <p className="text-[#f69a39] text-[11px] tracking-[3px] uppercase font-semibold mb-4">Trustpilot Rated</p>
          <h1 className="text-white text-[38px] md:text-[60px] font-bold tracking-tight leading-tight mb-5">
            Over 100,000<br />Five-Star Reviews
          </h1>
          <p className="text-white/50 text-[16px] leading-relaxed max-w-[480px] mx-auto mb-8">
            Don&apos;t take our word for it. Here&apos;s what cricketers across Australia and the world say about shopping with Papas Willow.
          </p>
          <a
            href="https://www.trustpilot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00b67a] hover:bg-[#00a36c] text-white text-[13px] font-semibold rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 3.9 2.4-7.4L2 9.4h7.6z" />
            </svg>
            Read all reviews on Trustpilot
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-white/5 bg-[#111]">
        <div className="max-w-[800px] mx-auto px-4 md:px-[42px] py-10">
          <div className="grid grid-cols-3 gap-6 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <div className="text-[#f69a39] text-[32px] md:text-[42px] font-bold leading-none mb-1">{s.value}</div>
                <div className="text-white/40 text-[12px] uppercase tracking-widest font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews grid */}
      <section className="max-w-[1100px] mx-auto px-4 md:px-[42px] py-14 md:py-20">
        <h2 className="text-white text-[22px] font-bold mb-8">Recent Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-6 flex flex-col">
              <Stars count={r.rating} />
              <h3 className="text-white text-[14px] font-bold mt-3 mb-2 leading-snug">{r.title}</h3>
              <p className="text-white/50 text-[13px] leading-relaxed flex-1">{r.body}</p>
              <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-white text-[12px] font-semibold">{r.name}</p>
                  <p className="text-white/30 text-[11px]">{r.location}</p>
                </div>
                <span className="text-white/25 text-[11px]">{r.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* View more on Trustpilot */}
        <div className="mt-12 text-center">
          <a
            href="https://www.trustpilot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-white/25 text-white text-[13px] font-medium rounded-lg transition-colors"
          >
            See all 100,000+ reviews on Trustpilot
            <svg className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </section>
    </main>
  );
}
