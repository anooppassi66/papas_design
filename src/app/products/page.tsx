"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/shared/ProductCard";
import { PRODUCTS, SORT_OPTIONS, FILTER_BRANDS, FILTER_PRICE_RANGES } from "@/lib/data";

export default function ProductsPage() {
  const [sortBy, setSortBy] = useState("featured");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const toggleBrand = (brand: string) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];
    if (selectedBrands.length > 0)
      result = result.filter((p) => selectedBrands.includes(p.brand));
    if (selectedPriceRange !== null) {
      const range = FILTER_PRICE_RANGES[selectedPriceRange];
      result = result.filter((p) => p.price >= range.min && p.price <= range.max);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case "price-asc":  result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating":     result.sort((a, b) => b.rating - a.rating); break;
      case "newest":     result.sort((a, b) => b.id - a.id); break;
    }
    return result;
  }, [selectedBrands, selectedPriceRange, sortBy, searchQuery]);

  const hasFilters = selectedBrands.length > 0 || selectedPriceRange !== null;
  const clearAll = () => { setSelectedBrands([]); setSelectedPriceRange(null); setSearchQuery(""); };

  // Lock body scroll when filter drawer open on mobile
  useEffect(() => {
    if (filterOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [filterOpen]);

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      {/* ── Category Header ─────────────────────────────────────────── */}
      <div className="bg-black">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-3 flex items-center gap-2 text-[11px] text-[#888]">
          <Link href="/" className="hover:text-[#f69a39] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/cricket" className="hover:text-[#f69a39] transition-colors">Cricket</Link>
          <span>/</span>
          <span className="text-white">All Products</span>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-8 pt-4">
          <h1 className="text-white text-[26px] md:text-[36px] font-semibold uppercase tracking-[0.5px]">
            Cricket Equipment
          </h1>
          <p className="text-[#888] text-[13px] mt-1">{filteredProducts.length} products</p>
        </div>
      </div>

      {/* ── Filter chips on mobile ────────────────────────────────── */}
      {hasFilters && (
        <div className="bg-white border-b border-[#e5e5e5] px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {selectedBrands.map((b) => (
            <button key={b} onClick={() => toggleBrand(b)}
              className="flex items-center gap-1.5 bg-[#f69a39] text-white text-[11px] font-medium px-3 py-1 rounded-full whitespace-nowrap hover:bg-[#e8880d] transition-colors">
              {b} ×
            </button>
          ))}
          {selectedPriceRange !== null && (
            <button onClick={() => setSelectedPriceRange(null)}
              className="flex items-center gap-1.5 bg-[#f69a39] text-white text-[11px] font-medium px-3 py-1 rounded-full whitespace-nowrap hover:bg-[#e8880d] transition-colors">
              {FILTER_PRICE_RANGES[selectedPriceRange].label} ×
            </button>
          )}
          <button onClick={clearAll} className="text-[11px] text-[#f69a39] font-semibold underline ml-2 whitespace-nowrap">
            Clear all
          </button>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-5">
        <div className="flex gap-5">

          {/* ═══ Sidebar Filters ════════════════════════════════════ */}
          <aside className={`
            md:block
            ${filterOpen ? "block" : "hidden"}
            fixed md:static inset-0 md:inset-auto z-50 md:z-auto
          `}>
            {/* Mobile backdrop */}
            <div className="absolute inset-0 bg-black/60 md:hidden" onClick={() => setFilterOpen(false)} />

            {/* Filter panel */}
            <div className="relative md:static w-[280px] md:w-[220px] lg:w-[240px] ml-auto md:ml-0 h-full md:h-auto overflow-y-auto bg-white shadow-xl md:shadow-none rounded-none md:rounded-[4px]">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0f0] sticky top-0 bg-white z-10">
                <h2 className="text-[13px] font-semibold text-[#1e1e21] uppercase tracking-wide">
                  Filter {hasFilters && <span className="text-[#f69a39]">({(selectedBrands.length + (selectedPriceRange !== null ? 1 : 0))})</span>}
                </h2>
                <button className="md:hidden text-[#888] hover:text-[#1e1e21]" onClick={() => setFilterOpen(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-5 space-y-1">
                {/* Search filter */}
                <div className="mb-4">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#aaa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-8 pr-3 py-2 text-[12px] border border-[#e5e5e5] rounded-[3px] outline-none focus:border-[#f69a39] bg-[#fafafa]"
                    />
                  </div>
                </div>

                <FilterSection title="Brand">
                  {FILTER_BRANDS.map((brand) => (
                    <label key={brand} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                      <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                        selectedBrands.includes(brand) ? "bg-[#f69a39] border-[#f69a39]" : "border-[#ccc] group-hover:border-[#f69a39]"
                      }`}>
                        {selectedBrands.includes(brand) && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} className="sr-only" />
                      <span className="text-[12px] text-[#444] group-hover:text-[#1e1e21] transition-colors">{brand}</span>
                    </label>
                  ))}
                </FilterSection>

                <FilterSection title="Price Range">
                  {FILTER_PRICE_RANGES.map((range, idx) => (
                    <label key={range.label} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                        selectedPriceRange === idx ? "border-[#f69a39]" : "border-[#ccc] group-hover:border-[#f69a39]"
                      }`}>
                        {selectedPriceRange === idx && (
                          <span className="w-2 h-2 rounded-full bg-[#f69a39] block" />
                        )}
                      </span>
                      <input type="radio" name="price" checked={selectedPriceRange === idx} onChange={() => setSelectedPriceRange(selectedPriceRange === idx ? null : idx)} className="sr-only" />
                      <span className="text-[12px] text-[#444] group-hover:text-[#1e1e21] transition-colors">{range.label}</span>
                    </label>
                  ))}
                </FilterSection>

                {/* Category pills */}
                <FilterSection title="Category">
                  {["Bats","Gloves","Pads","Helmets","Shoes","Bags","Clothing","Accessories"].map((cat) => (
                    <Link key={cat} href={`/cricket/${cat.toLowerCase()}`}
                      className="block text-[12px] text-[#444] hover:text-[#f69a39] transition-colors py-0.5">
                      {cat}
                    </Link>
                  ))}
                </FilterSection>

                {hasFilters && (
                  <button onClick={clearAll}
                    className="w-full mt-3 py-2.5 border border-[#f69a39] text-[#f69a39] text-[12px] font-semibold rounded-[3px] hover:bg-[#f69a39] hover:text-white transition-all">
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* ═══ Product Grid ════════════════════════════════════════ */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white rounded-[4px] px-4 py-3 mb-4 flex items-center gap-3 border border-[#e8e8e8]">
              {/* Mobile filter toggle */}
              <button onClick={() => setFilterOpen(true)}
                className="md:hidden flex items-center gap-2 text-[12px] font-semibold text-[#1e1e21] border border-[#e5e5e5] rounded-[3px] px-3 py-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8h10M11 12h4M13 16h2" />
                </svg>
                Filter {hasFilters && `(${selectedBrands.length + (selectedPriceRange !== null ? 1 : 0)})`}
              </button>

              <p className="hidden md:block text-[12px] text-[#888]">
                <span className="font-semibold text-[#1e1e21]">{filteredProducts.length}</span> products
              </p>

              <div className="flex items-center gap-2 ml-auto">
                {/* Grid/List toggle desktop */}
                <div className="hidden md:flex items-center gap-1 border border-[#e5e5e5] rounded-[3px] p-0.5">
                  <button onClick={() => { setViewMode("grid"); setGridCols(4); }}
                    className={`p-1.5 rounded-[2px] transition-colors ${viewMode === "grid" && gridCols === 4 ? "bg-[#f69a39] text-white" : "text-[#888] hover:text-[#1e1e21]"}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <rect x="2" y="2" width="7" height="7" rx="1"/><rect x="11" y="2" width="7" height="7" rx="1"/>
                      <rect x="2" y="11" width="7" height="7" rx="1"/><rect x="11" y="11" width="7" height="7" rx="1"/>
                    </svg>
                  </button>
                  <button onClick={() => { setViewMode("grid"); setGridCols(3); }}
                    className={`p-1.5 rounded-[2px] transition-colors ${viewMode === "grid" && gridCols === 3 ? "bg-[#f69a39] text-white" : "text-[#888] hover:text-[#1e1e21]"}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <rect x="1" y="2" width="5" height="7" rx="1"/><rect x="7.5" y="2" width="5" height="7" rx="1"/><rect x="14" y="2" width="5" height="7" rx="1"/>
                      <rect x="1" y="11" width="5" height="7" rx="1"/><rect x="7.5" y="11" width="5" height="7" rx="1"/><rect x="14" y="11" width="5" height="7" rx="1"/>
                    </svg>
                  </button>
                  <button onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-[2px] transition-colors ${viewMode === "list" ? "bg-[#f69a39] text-white" : "text-[#888] hover:text-[#1e1e21]"}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                {/* Sort */}
                <div className="relative">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className="text-[12px] border border-[#e5e5e5] rounded-[3px] pl-3 pr-8 py-1.5 bg-white text-[#1e1e21] outline-none focus:border-[#f69a39] cursor-pointer appearance-none">
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#888] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Empty state */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-[4px] p-12 text-center border border-[#e8e8e8]">
                <svg className="w-12 h-12 text-[#ccc] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-[#888] text-[14px] mb-1">No products found</p>
                <p className="text-[#bbb] text-[12px] mb-5">Try adjusting your filters or search term</p>
                <button onClick={clearAll}
                  className="px-6 py-2.5 bg-[#f69a39] text-white text-[12px] font-semibold rounded-[3px] hover:bg-[#e8880d] transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : viewMode === "list" ? (
              /* List view */
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.slug}`}
                    className="bg-white rounded-[4px] border border-[#e8e8e8] flex items-center gap-4 p-3 hover:border-[#f69a39] hover:shadow-sm transition-all group">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-[3px] overflow-hidden bg-[#f8f8f8]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#f69a39] font-semibold uppercase tracking-wide">{product.brand}</p>
                      <h3 className="text-[13px] font-medium text-[#1e1e21] leading-snug mt-0.5 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[1,2,3,4,5].map(s=><svg key={s} className={`w-3 h-3 ${s<=Math.floor(product.rating)?"text-[#f69a39]":"text-[#e0e0e0]"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                        <span className="text-[10px] text-[#aaa] ml-1">({product.reviewCount})</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-[#f69a39] font-bold text-[16px]">${product.price}</p>
                      {product.originalPrice > product.price && (
                        <p className="text-[#aaa] text-[12px] line-through">${product.originalPrice}</p>
                      )}
                      {product.discount && (
                        <span className="text-[9px] font-medium text-white bg-[#f69a39] rounded-[2px] px-1.5 py-0.5 mt-1 inline-block">{savingsPct(product)}% OFF</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* Grid view */
              <div className={`grid grid-cols-2 gap-3 md:gap-3.5 ${gridCols === 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Load more */}
            {filteredProducts.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-[12px] text-[#aaa] mb-3">Showing {filteredProducts.length} of {PRODUCTS.length} products</p>
                <button className="px-8 py-3 border-2 border-[#1e1e21] text-[#1e1e21] text-[12px] font-semibold uppercase tracking-[0.5px] rounded-[3px] hover:bg-[#1e1e21] hover:text-white transition-all">
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function savingsPct(p: { price: number; originalPrice: number }) {
  return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-[#f0f0f0] pb-4 mb-1">
      <button onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3">
        <span className="text-[11px] font-semibold text-[#1e1e21] uppercase tracking-[0.5px]">{title}</span>
        <svg className={`w-3.5 h-3.5 text-[#999] transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="flex flex-col gap-1.5">{children}</div>}
    </div>
  );
}
