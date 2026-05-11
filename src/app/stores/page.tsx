import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

interface Store {
  id: number;
  name: string;
  type: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
}

async function getStores(): Promise<Store[]> {
  try {
    const res = await fetch(`${API}/customer/stores`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function StoresPage() {
  const stores = await getStores();

  return (
    <main className="bg-[#0f0f0f] min-h-screen">
      {/* Hero */}
      <section className="relative bg-[#1e1e21] py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, #f69a39 0%, transparent 70%)" }}
        />
        <div className="relative max-w-[1440px] mx-auto px-4 md:px-[42px] text-center">
          <p className="text-[#f69a39] text-[11px] tracking-[3px] uppercase font-semibold mb-3">In-Store Experience</p>
          <h1 className="text-white text-[32px] md:text-[52px] font-bold tracking-tight leading-tight mb-4">
            Find a PAPAS Store
          </h1>
          <p className="text-white/50 text-[15px] md:text-[17px] max-w-[520px] mx-auto leading-relaxed">
            Visit us in person for expert advice, bat fitting, and hands-on access to our full range of cricket equipment.
          </p>
        </div>
      </section>

      {/* Stores */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[42px] py-12 md:py-16">
        {stores.length === 0 ? (
          <div className="text-center py-20 text-white/40">No stores found.</div>
        ) : (
          <div className="space-y-10">
            {stores.map((store) => {
              const mapsQuery = store.address ? encodeURIComponent(store.address) : "";
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
              const embedUrl = `https://maps.google.com/maps?q=${mapsQuery}&output=embed&z=15`;

              return (
                <div key={store.id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5">
                  <div className="flex flex-col lg:flex-row">
                    {/* Map */}
                    <div className="lg:w-[55%] h-[260px] lg:h-auto min-h-[300px] relative">
                      {store.address ? (
                        <iframe
                          src={embedUrl}
                          width="100%"
                          height="100%"
                          className="absolute inset-0 w-full h-full border-0 grayscale"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={`Map for ${store.name}`}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#222] flex items-center justify-center">
                          <svg className="w-12 h-12 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Store info */}
                    <div className="lg:w-[45%] p-8 md:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-6">
                          <div>
                            <h2 className="text-white text-[22px] md:text-[26px] font-bold leading-tight">{store.name}</h2>
                            {store.type && (
                              <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-[#f69a39]/15 text-[#f69a39] text-[11px] font-semibold rounded-full tracking-wide uppercase">
                                {store.type}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          {store.address && (
                            <InfoRow icon={<MapPinIcon />} label="Address">
                              <span className="text-white/70">{store.address}</span>
                            </InfoRow>
                          )}

                          <InfoRow icon={<ClockIcon />} label="Opening Hours">
                            <div className="text-white/70 space-y-0.5">
                              <div className="flex gap-4">
                                <span className="w-32 text-white/40">Mon – Fri</span>
                                <span>9:00am – 5:30pm</span>
                              </div>
                              <div className="flex gap-4">
                                <span className="w-32 text-white/40">Saturday</span>
                                <span>9:00am – 5:00pm</span>
                              </div>
                              <div className="flex gap-4">
                                <span className="w-32 text-white/40">Sunday</span>
                                <span>Closed</span>
                              </div>
                            </div>
                          </InfoRow>

                          {store.phone && (
                            <InfoRow icon={<PhoneIcon />} label="Phone">
                              <a href={`tel:${store.phone}`} className="text-white/70 hover:text-[#f69a39] transition-colors">
                                {store.phone}
                              </a>
                            </InfoRow>
                          )}

                          {store.email && (
                            <InfoRow icon={<EmailIcon />} label="Email">
                              <a href={`mailto:${store.email}`} className="text-white/70 hover:text-[#f69a39] transition-colors">
                                {store.email}
                              </a>
                            </InfoRow>
                          )}
                        </div>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        {store.address && (
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f69a39] hover:bg-[#e8880d] text-white text-[13px] font-semibold rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Get Directions
                          </a>
                        )}
                        {store.phone && (
                          <a
                            href={`tel:${store.phone}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-[13px] font-semibold rounded-lg border border-white/10 transition-colors"
                          >
                            <PhoneIcon />
                            Call Store
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/5 py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[42px]">
          <div className="bg-[#1a1a1a] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5">
            <div>
              <h3 className="text-white text-[20px] md:text-[24px] font-bold mb-1">Can&rsquo;t make it in store?</h3>
              <p className="text-white/50 text-[14px]">Shop our full range online with free delivery on orders over $100.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link
                href="/products"
                className="px-6 py-3 bg-[#f69a39] hover:bg-[#e8880d] text-white text-[13px] font-semibold rounded-lg transition-colors"
              >
                Shop Online
              </Link>
              <Link
                href="/help/contact"
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-[13px] font-semibold rounded-lg border border-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#f69a39]/10 flex items-center justify-center flex-shrink-0 text-[#f69a39] mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-white/30 uppercase tracking-widest font-semibold mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  );
}

function MapPinIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
