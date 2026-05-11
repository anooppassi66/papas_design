import Link from "next/link";

const TIMELINE = [
  {
    year: "1981",
    heading: "Humble Beginnings",
    body: "Papas Willow was born from a single passion — cricket. Founded in a small shopfront in Western Sydney, our doors opened with a modest selection of bats, pads, and gloves. Word spread quickly among local clubs that this was the place to come for genuine advice and genuine gear.",
  },
  {
    year: "1988",
    heading: "The Club Network",
    body: "Through seven years of serving Sydney's cricketing community, Papas had become the trusted outfitter for over 40 local clubs. Saturdays brought queues out the door. We were more than a shop — we were part of the pre-season ritual.",
  },
  {
    year: "1995",
    heading: "Going National",
    body: "Mail-order catalogues sent to cricket clubs across Australia marked our first step beyond Sydney. Handwritten orders came in from Queensland, Victoria, South Australia. We packed and posted every single one ourselves. The postal van became a familiar sight.",
  },
  {
    year: "2001",
    heading: "Online at Last",
    body: "We launched our first website — a simple catalogue with a phone number to call. Within six months, orders were coming from New Zealand, the UK, and the UAE. The internet had given cricket fans everywhere access to the same gear the pros were using.",
  },
  {
    year: "2007",
    heading: "International Shipping",
    body: "Demand from the subcontinent, the Caribbean, and South Africa pushed us to build a proper international logistics operation. Papas Willow gear was now crossing oceans. The brand that started on a quiet street in Western Sydney was playing on the world stage.",
  },
  {
    year: "2012",
    heading: "The Warehouse",
    body: "We outgrew the original shopfront — twice — and moved into a purpose-built warehouse and retail space. Thousands of bats. Hundreds of lines. Every major brand under one roof. The kind of store we'd always dreamed of when we first unlocked those doors in 1981.",
  },
  {
    year: "2018",
    heading: "100,000 Five-Star Reviews",
    body: "A milestone we never chased but are enormously proud of. Every review is a cricketer who trusted us with their game. We read every single one — the good and the critical. They've made us better at what we do.",
  },
  {
    year: "2024",
    heading: "Still Family. Still Cricket.",
    body: "Four decades on, Papas Willow remains exactly what it was on day one — a family business built around a love of cricket. The faces behind the counter have changed, grown up, brought their own kids into the shop. But the reason we open every morning is the same as it ever was.",
  },
];

export default function OurStoryPage() {
  return (
    <main className="bg-[#0f0f0f] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[#111] border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[42px] py-3">
          <nav className="flex items-center gap-2 text-[12px] text-white/30">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/50">Our Story</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse 60% 80% at 20% 50%, #f69a39 0%, transparent 65%)" }} />
        <div className="relative max-w-[800px] mx-auto px-4 md:px-[42px]">
          <p className="text-[#f69a39] text-[11px] tracking-[3px] uppercase font-semibold mb-4">PAPAS Willow Cricket</p>
          <h1 className="text-white text-[40px] md:text-[64px] font-bold tracking-tight leading-none mb-6">
            Family Owned &amp;<br />Run Since 1981
          </h1>
          <p className="text-white/50 text-[16px] leading-relaxed max-w-[520px]">
            Four decades of cricket. One family&apos;s obsession. The story of how a small Sydney shopfront became Australia&apos;s home of cricket.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-[800px] mx-auto px-4 md:px-[42px] py-16 md:py-24">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[52px] top-0 bottom-0 w-px bg-white/5 hidden md:block" />

          <div className="space-y-16 md:space-y-20">
            {TIMELINE.map((entry, i) => (
              <div key={i} className="md:flex gap-10 items-start group">
                {/* Year */}
                <div className="flex-shrink-0 md:w-[104px] mb-4 md:mb-0 flex md:block items-center gap-3 relative">
                  <div className="hidden md:block absolute left-1/2 -translate-x-1/2 z-10 w-3 h-3 rounded-full bg-[#f69a39]" style={{ marginTop: "-21px" }} />
                  <span className="text-[#f69a39] text-[28px] md:text-[32px] font-bold leading-none tabular-nums">
                    {entry.year}
                  </span>
                </div>
                {/* Content */}
                <div className="flex-1 pb-0">
                  <h2 className="text-white text-[20px] md:text-[24px] font-bold mb-3 leading-snug">
                    {entry.heading}
                  </h2>
                  <p className="text-white/55 text-[15px] leading-[1.85]">
                    {entry.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/5 bg-[#111]">
        <div className="max-w-[800px] mx-auto px-4 md:px-[42px] py-14 md:py-20 text-center">
          <p className="text-[#f69a39] text-[11px] tracking-[3px] uppercase font-semibold mb-4">40+ Years Later</p>
          <h2 className="text-white text-[28px] md:text-[38px] font-bold mb-5 leading-tight">
            Still the same family.<br />Still the same love of cricket.
          </h2>
          <p className="text-white/40 text-[14px] mb-8 max-w-[420px] mx-auto leading-relaxed">
            Come find us in store or shop online — the advice is free, the gear is the best in the world, and the passion hasn&apos;t changed since day one.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/stores" className="px-6 py-3 bg-[#f69a39] hover:bg-[#e8880d] text-white text-[13px] font-semibold rounded-lg transition-colors">
              Find a Store
            </Link>
            <Link href="/cricket" className="px-6 py-3 border border-white/15 hover:border-white/30 text-white text-[13px] font-semibold rounded-lg transition-colors">
              Shop Cricket
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
