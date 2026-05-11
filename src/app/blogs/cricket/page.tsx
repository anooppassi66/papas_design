import Image from "next/image";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
const UPLOADS = API.replace("/api", "");

interface BlogCategory { id: number; name: string; slug: string; }
interface Blog {
  id: number; title: string; slug: string; image: string | null;
  description: string; created_at: string;
  category_name: string | null; category_slug: string | null;
}

async function getData(category?: string) {
  try {
    const url = category
      ? `${API}/customer/blogs?category=${category}`
      : `${API}/customer/blogs`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return { blogs: [], categories: [] };
    return res.json() as Promise<{ blogs: Blog[]; categories: BlogCategory[] }>;
  } catch { return { blogs: [], categories: [] }; }
}

function readTime(text: string) {
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

function excerpt(text: string, len = 120) {
  const plain = text.replace(/<[^>]+>/g, "");
  return plain.length > len ? plain.slice(0, len).trimEnd() + "…" : plain;
}

export default async function CricketBlogsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const activeCategory = params.category || "";
  const { blogs, categories } = await getData(activeCategory);

  return (
    <main className="bg-[#0f0f0f] min-h-screen">
      {/* Hero */}
      <section className="relative bg-[#1e1e21] py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-25"
          style={{ background: "radial-gradient(ellipse 70% 90% at 30% 50%, #f69a39 0%, transparent 65%)" }} />
        <div className="relative max-w-[1440px] mx-auto px-4 md:px-[42px]">
          <p className="text-[#f69a39] text-[11px] tracking-[3px] uppercase font-semibold mb-3">PAPAS Willow</p>
          <h1 className="text-white text-[34px] md:text-[56px] font-bold tracking-tight leading-tight mb-3">
            Cricket Blog
          </h1>
          <p className="text-white/50 text-[15px] max-w-[480px] leading-relaxed">
            Expert tips, gear guides, and the latest news from the world of cricket.
          </p>
        </div>
      </section>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="border-b border-white/5 bg-[#111]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-[42px]">
            <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
              <Link
                href="/blogs/cricket"
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                  !activeCategory ? "bg-[#f69a39] text-white" : "text-white/50 hover:text-white"
                }`}
              >
                All
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/blogs/cricket?category=${cat.slug}`}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                    activeCategory === cat.slug ? "bg-[#f69a39] text-white" : "text-white/50 hover:text-white"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Blog grid */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-[42px] py-10 md:py-14">
        {blogs.length === 0 ? (
          <div className="text-center py-24 text-white/30 text-sm">No blogs published yet.</div>
        ) : (
          <>
            {/* Featured (first post) */}
            <FeaturedCard blog={blogs[0]} />

            {/* Grid */}
            {blogs.length > 1 && (
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.slice(1).map(blog => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function FeaturedCard({ blog }: { blog: Blog }) {
  const imgSrc = blog.image ? `${UPLOADS}${blog.image}` : null;
  return (
    <Link href={`/blogs/cricket/${blog.slug}`} className="group block">
      <div className="relative rounded-2xl overflow-hidden bg-[#1a1a1a] flex flex-col md:flex-row min-h-[340px] border border-white/5">
        {/* Image */}
        <div className="md:w-[55%] relative min-h-[240px] md:min-h-0">
          {imgSrc ? (
            <Image src={imgSrc} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 100vw, 55vw" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#f69a39]/20 to-[#1e1e21] flex items-center justify-center">
              <span className="text-[64px]">🏏</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a1a1a] hidden md:block" />
        </div>
        {/* Content */}
        <div className="md:w-[45%] p-7 md:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            {blog.category_name && (
              <span className="px-2.5 py-0.5 bg-[#f69a39] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                {blog.category_name}
              </span>
            )}
            <span className="text-[11px] text-white/30">{readTime(blog.description)} min read</span>
          </div>
          <h2 className="text-white text-[22px] md:text-[28px] font-bold leading-tight mb-3 group-hover:text-[#f69a39] transition-colors">
            {blog.title}
          </h2>
          <p className="text-white/50 text-[14px] leading-relaxed mb-5 line-clamp-3">
            {excerpt(blog.description, 180)}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-white/30 text-[12px]">{formatDate(blog.created_at)}</span>
            <span className="text-[#f69a39] text-[12px] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Read article
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function BlogCard({ blog }: { blog: Blog }) {
  const imgSrc = blog.image ? `${UPLOADS}${blog.image}` : null;
  return (
    <Link href={`/blogs/cricket/${blog.slug}`} className="group flex flex-col bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 hover:border-[#f69a39]/30 transition-colors">
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#222]">
        {imgSrc ? (
          <Image src={imgSrc} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#f69a39]/10 to-[#1e1e21] flex items-center justify-center">
            <span className="text-[40px]">🏏</span>
          </div>
        )}
        {blog.category_name && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-0.5 bg-[#f69a39] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
              {blog.category_name}
            </span>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-white text-[15px] font-bold leading-snug mb-2 group-hover:text-[#f69a39] transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-white/40 text-[13px] leading-relaxed line-clamp-3 flex-1">
          {excerpt(blog.description)}
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <span className="text-white/30 text-[11px]">{formatDate(blog.created_at)}</span>
          <span className="text-white/30 text-[11px]">{readTime(blog.description)} min read</span>
        </div>
      </div>
    </Link>
  );
}
