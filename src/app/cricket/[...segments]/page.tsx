"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { UPLOADS } from "@/lib/customerApi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

interface Product { id: number; name: string; slug: string; image: string | null; brand_name: string; sell_price: number; avg_rating: number; rating_count: number; }
interface Brand { id: number; brand_name: string; }
interface PriceRange { label: string; min: number; max: number; }
interface Category { id: number; name: string; slug: string; children: { id: number; name: string; slug: string }[]; }

const SORT_OPTIONS = [
  { value: "newest",    label: "Newest" },
  { value: "featured",  label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc",label: "Price: High to Low" },
  { value: "top_rated", label: "Top Rated" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "text-[#f69a39]" : "text-[#e0e0e0]"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-[#f0f0f0] pb-4 mb-1">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-3">
        <span className="text-[11px] font-semibold text-[#1e1e21] uppercase tracking-[0.5px]">{title}</span>
        <svg className={`w-3.5 h-3.5 text-[#999] transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="flex flex-col gap-1.5">{children}</div>}
    </div>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const segments = (params?.segments as string[]) || [];
  const permalink = segments.join("/");
  const categoryName = segments[segments.length - 1]?.replace(/-/g, " ") || "Products";

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [sortBy, setSortBy] = useState("newest");
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch(`${API}/customer/products/filters`)
      .then((r) => r.json())
      .then((data: { brands: Brand[]; price_ranges: PriceRange[]; categories: Category[] }) => {
        setBrands(data.brands || []);
        setPriceRanges(data.price_ranges || []);
        setCategories(data.categories || []);
      })
      .catch(() => {});
  }, []);

  const buildQuery = useCallback((pg: number) => {
    const p = new URLSearchParams({ permalink, sort: sortBy, page: String(pg), limit: "8" });
    if (searchQuery.trim()) p.set("q", searchQuery.trim());
    if (selectedBrands.length) p.set("brand_ids", selectedBrands.join(","));
    if (selectedPrice !== null && priceRanges[selectedPrice]) {
      const r = priceRanges[selectedPrice];
      p.set("price_min", String(r.min));
      if (r.max < 99999) p.set("price_max", String(r.max));
    }
    return p.toString();
  }, [permalink, sortBy, searchQuery, selectedBrands, selectedPrice, priceRanges]);

  const load = useCallback(async (pg: number, append = false) => {
    if (pg === 1) setLoading(true); else setLoadingMore(true);
    try {
      const res = await fetch(`${API}/customer/products?${buildQuery(pg)}`);
      const data: { products: Product[]; total: number; page: number; pages: number } = await res.json();
      setProducts((prev) => append ? [...prev, ...(data.products || [])] : (data.products || []));
      setTotal(data.total || 0);
      setHasMore((data.page || 1) < (data.pages || 1));
      setPage(pg);
    } catch { setProducts([]); }
    finally { setLoading(false); setLoadingMore(false); }
  }, [buildQuery]);

  useEffect(() => { load(1, false); }, [load]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (searchRef.current) clearTimeout(searchRef.current);
  };

  const toggleBrand = (id: number) =>
    setSelectedBrands((prev) => prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]);

  const clearAll = () => { setSelectedBrands([]); setSelectedPrice(null); setSearchQuery(""); };
  const hasFilters = selectedBrands.length > 0 || selectedPrice !== null || !!searchQuery;

  useEffect(() => {
    if (filterOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [filterOpen]);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Cricket", href: "/cricket" },
    ...segments.map((seg, i) => ({
      label: seg.replace(/-/g, " "),
      href: `/cricket/${segments.slice(0, i + 1).join("/")}`,
    })),
  ];

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      <div className="bg-black">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-3 flex items-center gap-2 text-[11px] text-[#888] flex-wrap">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              {i < breadcrumbs.length - 1
                ? <Link href={b.href} className="hover:text-[#f69a39] transition-colors capitalize">{b.label}</Link>
                : <span className="text-white capitalize">{b.label}</span>
              }
              {i < breadcrumbs.length - 1 && <span>/</span>}
            </span>
          ))}
        </div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-8 pt-4">
          <h1 className="text-white text-[26px] md:text-[36px] font-semibold uppercase tracking-[0.5px] capitalize">{categoryName}</h1>
          <p className="text-[#888] text-[13px] mt-1">{total} products</p>
        </div>
      </div>

      {hasFilters && (
        <div className="bg-white border-b border-[#e5e5e5] px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {selectedBrands.map((id) => {
            const b = brands.find((br) => br.id === id);
            return b ? (
              <button key={id} onClick={() => toggleBrand(id)} className="flex items-center gap-1.5 bg-[#f69a39] text-white text-[11px] font-medium px-3 py-1 rounded-full whitespace-nowrap hover:bg-[#e8880d] transition-colors">
                {b.brand_name} ×
              </button>
            ) : null;
          })}
          {selectedPrice !== null && priceRanges[selectedPrice] && (
            <button onClick={() => setSelectedPrice(null)} className="flex items-center gap-1.5 bg-[#f69a39] text-white text-[11px] font-medium px-3 py-1 rounded-full whitespace-nowrap hover:bg-[#e8880d] transition-colors">
              {priceRanges[selectedPrice].label} ×
            </button>
          )}
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="flex items-center gap-1.5 bg-[#f69a39] text-white text-[11px] font-medium px-3 py-1 rounded-full whitespace-nowrap hover:bg-[#e8880d] transition-colors">
              &ldquo;{searchQuery}&rdquo; ×
            </button>
          )}
          <button onClick={clearAll} className="text-[11px] text-[#f69a39] font-semibold underline ml-2 whitespace-nowrap">Clear all</button>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-5">
        <div className="flex gap-5">

          {/* Sidebar */}
          <aside className={`md:block ${filterOpen ? "block" : "hidden"} fixed md:static inset-0 md:inset-auto z-50 md:z-auto`}>
            <div className="absolute inset-0 bg-black/60 md:hidden" onClick={() => setFilterOpen(false)} />
            <div className="relative md:static w-[280px] md:w-[220px] lg:w-[240px] ml-auto md:ml-0 h-full md:h-auto overflow-y-auto bg-white shadow-xl md:shadow-none rounded-none md:rounded-[4px]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0f0] sticky top-0 bg-white z-10">
                <h2 className="text-[13px] font-semibold text-[#1e1e21] uppercase tracking-wide">
                  Filter {hasFilters && <span className="text-[#f69a39]">({selectedBrands.length + (selectedPrice !== null ? 1 : 0) + (searchQuery ? 1 : 0)})</span>}
                </h2>
                <button className="md:hidden text-[#888] hover:text-[#1e1e21]" onClick={() => setFilterOpen(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-5 space-y-1">
                <div className="mb-4">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#aaa]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} placeholder="Search products..." className="w-full pl-8 pr-3 py-2 text-[12px] border border-[#e5e5e5] rounded-[3px] outline-none focus:border-[#f69a39] bg-[#fafafa]" />
                  </div>
                </div>

                {brands.length > 0 && (
                  <FilterSection title="Brand">
                    {brands.map((b) => (
                      <label key={b.id} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                        <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${selectedBrands.includes(b.id) ? "bg-[#f69a39] border-[#f69a39]" : "border-[#ccc] group-hover:border-[#f69a39]"}`}>
                          {selectedBrands.includes(b.id) && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </span>
                        <input type="checkbox" checked={selectedBrands.includes(b.id)} onChange={() => toggleBrand(b.id)} className="sr-only" />
                        <span className="text-[12px] text-[#444] group-hover:text-[#1e1e21] transition-colors">{b.brand_name}</span>
                      </label>
                    ))}
                  </FilterSection>
                )}

                {priceRanges.length > 0 && (
                  <FilterSection title="Price Range">
                    {priceRanges.map((r, idx) => (
                      <label key={r.label} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                        <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${selectedPrice === idx ? "border-[#f69a39]" : "border-[#ccc] group-hover:border-[#f69a39]"}`}>
                          {selectedPrice === idx && <span className="w-2 h-2 rounded-full bg-[#f69a39] block" />}
                        </span>
                        <input type="radio" name="price" checked={selectedPrice === idx} onChange={() => setSelectedPrice(selectedPrice === idx ? null : idx)} className="sr-only" />
                        <span className="text-[12px] text-[#444] group-hover:text-[#1e1e21] transition-colors">{r.label}</span>
                      </label>
                    ))}
                  </FilterSection>
                )}

                {categories.length > 0 && (
                  <FilterSection title="Category">
                    {categories.flatMap((cat) => [
                      <Link key={cat.id} href={`/cricket/${cat.slug}`} className="block text-[12px] text-[#444] hover:text-[#f69a39] transition-colors py-0.5">{cat.name}</Link>,
                      ...(cat.children || []).map((ch) => (
                        <Link key={ch.id} href={`/cricket/${cat.slug}/${ch.slug}`} className="block text-[12px] text-[#444] hover:text-[#f69a39] transition-colors py-0.5">{ch.name}</Link>
                      )),
                    ])}
                  </FilterSection>
                )}

                {hasFilters && (
                  <button onClick={clearAll} className="w-full mt-3 py-2.5 border border-[#f69a39] text-[#f69a39] text-[12px] font-semibold rounded-[3px] hover:bg-[#f69a39] hover:text-white transition-all">
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Main area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-[4px] px-4 py-3 mb-4 flex items-center gap-3 border border-[#e8e8e8]">
              <button onClick={() => setFilterOpen(true)} className="md:hidden flex items-center gap-2 text-[12px] font-semibold text-[#1e1e21] border border-[#e5e5e5] rounded-[3px] px-3 py-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M11 12h4M13 16h2" /></svg>
                Filter {hasFilters && `(${selectedBrands.length + (selectedPrice !== null ? 1 : 0) + (searchQuery ? 1 : 0)})`}
              </button>
              <p className="hidden md:block text-[12px] text-[#888]"><span className="font-semibold text-[#1e1e21]">{total}</span> products</p>
              <div className="flex items-center gap-2 ml-auto">
                <div className="hidden md:flex items-center gap-1 border border-[#e5e5e5] rounded-[3px] p-0.5">
                  {([4, 3] as const).map((cols) => (
                    <button key={cols} onClick={() => { setViewMode("grid"); setGridCols(cols); }}
                      className={`p-1.5 rounded-[2px] transition-colors ${viewMode === "grid" && gridCols === cols ? "bg-[#f69a39] text-white" : "text-[#888] hover:text-[#1e1e21]"}`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        {cols === 4
                          ? <><rect x="2" y="2" width="7" height="7" rx="1"/><rect x="11" y="2" width="7" height="7" rx="1"/><rect x="2" y="11" width="7" height="7" rx="1"/><rect x="11" y="11" width="7" height="7" rx="1"/></>
                          : <><rect x="1" y="2" width="5" height="7" rx="1"/><rect x="7.5" y="2" width="5" height="7" rx="1"/><rect x="14" y="2" width="5" height="7" rx="1"/><rect x="1" y="11" width="5" height="7" rx="1"/><rect x="7.5" y="11" width="5" height="7" rx="1"/><rect x="14" y="11" width="5" height="7" rx="1"/></>
                        }
                      </svg>
                    </button>
                  ))}
                  <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-[2px] transition-colors ${viewMode === "list" ? "bg-[#f69a39] text-white" : "text-[#888] hover:text-[#1e1e21]"}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                  </button>
                </div>
                <div className="relative">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-[12px] border border-[#e5e5e5] rounded-[3px] pl-3 pr-8 py-1.5 bg-white text-[#1e1e21] outline-none focus:border-[#f69a39] cursor-pointer appearance-none">
                    {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#888] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            {loading ? (
              <div className={`grid grid-cols-2 gap-3 md:gap-3.5 ${gridCols === 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-[4px] border border-[#e8e8e8] overflow-hidden">
                    <div className="w-full aspect-square bg-[#f0f0f0] animate-pulse" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-[#f0f0f0] rounded animate-pulse w-1/3" />
                      <div className="h-3 bg-[#f0f0f0] rounded animate-pulse w-full" />
                      <div className="h-4 bg-[#f0f0f0] rounded animate-pulse w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-[4px] p-12 text-center border border-[#e8e8e8]">
                <svg className="w-12 h-12 text-[#ccc] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <p className="text-[#888] text-[14px] mb-1">No products found</p>
                <p className="text-[#bbb] text-[12px] mb-5">Try adjusting your filters or search term</p>
                {hasFilters
                  ? <button onClick={clearAll} className="px-6 py-2.5 bg-[#f69a39] text-white text-[12px] font-semibold rounded-[3px] hover:bg-[#e8880d] transition-colors">Clear Filters</button>
                  : <Link href="/products" className="text-[#f69a39] text-[13px] underline">Browse all products</Link>
                }
              </div>
            ) : viewMode === "list" ? (
              <div className="space-y-3">
                {products.map((p) => {
                  const imgSrc = p.image ? (p.image.startsWith("/uploads/") ? `${UPLOADS}${p.image}` : p.image) : null;
                  return (
                    <Link key={p.id} href={`/products/${p.slug}`} className="bg-white rounded-[4px] border border-[#e8e8e8] flex items-center gap-4 p-3 hover:border-[#f69a39] hover:shadow-sm transition-all group">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-[3px] overflow-hidden bg-[#f8f8f8]">
                        {imgSrc ? <Image src={imgSrc} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="80px" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🏏</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-[#f69a39] font-semibold uppercase tracking-wide">{p.brand_name}</p>
                        <h3 className="text-[13px] font-medium text-[#1e1e21] leading-snug mt-0.5 line-clamp-2">{p.name}</h3>
                        <div className="flex items-center gap-1 mt-1"><Stars rating={p.avg_rating} /></div>
                      </div>
                      <p className="text-[#f69a39] font-bold text-[16px] flex-shrink-0">${Number(p.sell_price || 0).toFixed(2)}</p>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className={`grid grid-cols-2 gap-3 md:gap-3.5 ${gridCols === 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
                {products.map((p) => {
                  const imgSrc = p.image ? (p.image.startsWith("/uploads/") ? `${UPLOADS}${p.image}` : p.image) : null;
                  return (
                    <Link key={p.id} href={`/products/${p.slug}`} className="bg-white rounded-[4px] border border-[#e8e8e8] hover:border-[#f69a39] hover:shadow-md transition-all group block">
                      <div className="relative w-full aspect-square bg-[#f8f8f8] rounded-t-[4px] overflow-hidden">
                        {imgSrc
                          ? <Image src={imgSrc} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width:768px) 50vw, 25vw" />
                          : <div className="w-full h-full flex items-center justify-center text-[#ddd] text-4xl">🏏</div>
                        }
                      </div>
                      <div className="p-3">
                        <p className="text-[10px] text-[#f69a39] font-semibold uppercase tracking-wide mb-0.5">{p.brand_name}</p>
                        <h3 className="text-[12px] font-medium text-[#1e1e21] leading-snug line-clamp-2 mb-1.5">{p.name}</h3>
                        <Stars rating={p.avg_rating} />
                        <p className="text-[#f69a39] font-bold text-[15px] mt-1.5">${Number(p.sell_price || 0).toFixed(2)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {(hasMore || loadingMore) && !loading && (
              <div className="mt-8 text-center">
                <p className="text-[12px] text-[#aaa] mb-3">Showing {products.length} of {total} products</p>
                <button onClick={() => load(page + 1, true)} disabled={loadingMore}
                  className="px-8 py-3 border-2 border-[#1e1e21] text-[#1e1e21] text-[12px] font-semibold uppercase tracking-[0.5px] rounded-[3px] hover:bg-[#1e1e21] hover:text-white transition-all disabled:opacity-50">
                  {loadingMore ? "Loading…" : "Load More"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
