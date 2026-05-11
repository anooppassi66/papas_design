import Link from "next/link";

const PROFILES = [
  {
    name: "Sachin Tendulkar",
    subtitle: "The God of Cricket",
    sport: "Cricket — India",
    body: "No name in cricket carries more weight than Sachin's. Fourteen hundred international appearances. A hundred international centuries. A career that spanned from 1989 to 2013 and turned a billion people into cricket fans overnight. His relationship with his equipment was legendary — he knew within moments whether a bat was right. The professionals who served him understood: this was a man who felt the game in his hands.",
  },
  {
    name: "Ricky Ponting",
    subtitle: "Australia's Greatest Captain",
    sport: "Cricket — Australia",
    body: "Two World Cup victories as captain. A batting average that placed him among the immortals. Ricky Ponting's playing style was built on authority — he didn't wait for the game to come to him. His demands on equipment were equally uncompromising. Bat weight, balance, the feel of the grip: everything had to be exact. The standard he held himself to was the standard he held everything around him to.",
  },
  {
    name: "Virat Kohli",
    subtitle: "The Chase Master",
    sport: "Cricket — India",
    body: "The man who made chasing look easy. Virat Kohli's fitness revolution changed the culture of Indian cricket — suddenly, players trained like athletes. His intensity at the crease, the way he wills himself and his team through impossible situations, has produced some of the defining innings of the modern era. He brings that same intensity to every detail of his preparation.",
  },
  {
    name: "Steve Smith",
    subtitle: "The Unorthodox Genius",
    sport: "Cricket — Australia",
    body: "There is no textbook explanation for how Steve Smith bats. The trigger movements, the positions, the angles — none of it should work, yet it consistently produces numbers that defy logic. A Test average above 60. One of the most valuable batters in the world across all formats. The unconventional has always been Smith's greatest weapon.",
  },
  {
    name: "AB de Villiers",
    subtitle: "Mr. 360",
    sport: "Cricket — South Africa",
    body: "AB de Villiers redefined what was possible in limited-overs cricket. Shots that don't exist in coaching manuals. A fielder who turned saving runs into an art form. Wicketkeeping of the highest order. He approached every format with complete imagination, refusing to accept that there were boundaries to where the ball could be hit or how fast runs could come.",
  },
  {
    name: "Brian Lara",
    subtitle: "The Prince of Trinidad",
    sport: "Cricket — West Indies",
    body: "Brian Lara holds the highest individual score in Test cricket: 400 not out against England in 2004. He also holds the record for the highest first-class score: 501 not out. Two records that may never be beaten. Lara batted with a grace and flair that made the game look like it was being played at a different speed to everyone else. Pure, instinctive genius.",
  },
  {
    name: "Shane Warne",
    subtitle: "The Greatest Leg-Spinner",
    sport: "Cricket — Australia",
    body: "708 Test wickets. A delivery to Mike Gatting in 1993 that became known simply as the Ball of the Century. Shane Warne brought leg-spin back from the margins and placed it at the centre of the game. He was as theatrical as he was gifted — the perfect showman for a craft that rewards patience and disguise in equal measure.",
  },
  {
    name: "MS Dhoni",
    subtitle: "Captain Cool",
    sport: "Cricket — India",
    body: "No captain in the history of limited-overs cricket has won more than MS Dhoni. The ICC World Cup. The Champions Trophy. Two IPL titles and multiple World Twenty20 trophies. His genius was calm — an ability to see the game clearly when everyone else around him was under pressure. Behind the stumps, he was peerless. His finishing in the lower order built a mythology all of its own.",
  },
];

export default function KingsAndQueensPage() {
  return (
    <main className="bg-[#0f0f0f] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[#111] border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[42px] py-3">
          <nav className="flex items-center gap-2 text-[12px] text-white/30">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/50">In the Company of Kings &amp; Queens</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse 70% 90% at 75% 50%, #f69a39 0%, transparent 60%)" }} />
        {/* Large decorative cricket icon */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-8 md:pr-20 opacity-5 pointer-events-none select-none">
          <span className="text-[220px] md:text-[320px] leading-none">🏏</span>
        </div>
        <div className="relative max-w-[800px] mx-auto px-4 md:px-[42px]">
          <p className="text-[#f69a39] text-[11px] tracking-[3px] uppercase font-semibold mb-4">PAPAS Willow Cricket</p>
          <h1 className="text-white text-[38px] md:text-[62px] font-bold tracking-tight leading-[1.05] mb-6">
            In the Company of<br />Kings &amp; Queens
          </h1>
          <p className="text-white/50 text-[16px] leading-relaxed max-w-[540px]">
            For over four decades, the greatest names in cricket have trusted Papas Willow. These are the legends who have walked through our doors, trusted our gear, and gone on to make history.
          </p>
        </div>
      </section>

      {/* Profiles */}
      <section className="max-w-[800px] mx-auto px-4 md:px-[42px] py-16 md:py-24">
        <div className="space-y-0">
          {PROFILES.map((profile, i) => (
            <div key={i} className={`py-12 md:py-16 ${i < PROFILES.length - 1 ? "border-b border-white/5" : ""}`}>
              {/* Sport tag */}
              <span className="inline-block text-[#f69a39] text-[10px] tracking-[2.5px] uppercase font-semibold mb-4">
                {profile.sport}
              </span>
              {/* Name + subtitle */}
              <h2 className="text-white text-[28px] md:text-[38px] font-bold leading-tight mb-1">
                {profile.name}
              </h2>
              <p className="text-white/30 text-[14px] md:text-[16px] font-medium mb-6 italic">
                {profile.subtitle}
              </p>
              {/* Body */}
              <p className="text-white/60 text-[15px] md:text-[16px] leading-[1.85] max-w-[640px]">
                {profile.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/5 bg-[#111]">
        <div className="max-w-[800px] mx-auto px-4 md:px-[42px] py-14 md:py-20 text-center">
          <p className="text-[#f69a39] text-[11px] tracking-[3px] uppercase font-semibold mb-4">Your Turn</p>
          <h2 className="text-white text-[28px] md:text-[38px] font-bold mb-5 leading-tight">
            Play like a legend.<br />Gear up at Papas.
          </h2>
          <p className="text-white/40 text-[14px] mb-8 max-w-[400px] mx-auto leading-relaxed">
            The same brands and equipment trusted by the world&apos;s greatest cricketers — available to you.
          </p>
          <Link href="/cricket" className="inline-block px-8 py-3.5 bg-[#f69a39] hover:bg-[#e8880d] text-white text-[13px] font-semibold rounded-lg transition-colors">
            Shop All Cricket
          </Link>
        </div>
      </section>
    </main>
  );
}
