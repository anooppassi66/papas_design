import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButtons from "./ShareButtons";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
const UPLOADS = API.replace("/api", "");
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface Blog {
  id: number; title: string; slug: string; image: string | null;
  description: string; created_at: string;
  category_name: string | null; category_slug: string | null;
  related: RelatedBlog[];
}
interface RelatedBlog {
  id: number; title: string; slug: string; image: string | null;
  description: string; created_at: string;
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${API}/customer/blogs/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

function readTime(text: string) {
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

// Render plain text with paragraph breaks
function renderContent(text: string) {
  return text.split(/\n{2,}/).map((para, i) => {
    const lines = para.split("\n").map((line, j) => (
      <span key={j}>{line}{j < para.split("\n").length - 1 && <br />}</span>
    ));
    return <p key={i} className="text-white/70 text-[16px] leading-[1.85] mb-5">{lines}</p>;
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  const pageUrl = `${SITE}/blogs/cricket/${blog.slug}`;
  const imgSrc = blog.image ? `${UPLOADS}${blog.image}` : null;

  return (
    <main className="bg-[#0f0f0f] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[#111] border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[42px] py-3">
          <nav className="flex items-center gap-2 text-[12px] text-white/30">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blogs/cricket" className="hover:text-white transition-colors">Cricket Blog</Link>
            {blog.category_name && (
              <>
                <span>/</span>
                <Link href={`/blogs/cricket?category=${blog.category_slug}`} className="hover:text-white transition-colors">
                  {blog.category_name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-white/50 line-clamp-1">{blog.title}</span>
          </nav>
        </div>
      </div>

      <article className="max-w-[860px] mx-auto px-4 md:px-6 py-10 md:py-16">
        {/* Category + meta */}
        <div className="flex items-center gap-3 mb-5">
          {blog.category_name && (
            <Link href={`/blogs/cricket?category=${blog.category_slug}`}
              className="px-3 py-1 bg-[#f69a39] text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[#e8880d] transition-colors">
              {blog.category_name}
            </Link>
          )}
          <span className="text-white/30 text-[13px]">{formatDate(blog.created_at)}</span>
          <span className="text-white/30 text-[13px]">·</span>
          <span className="text-white/30 text-[13px]">{readTime(blog.description)} min read</span>
        </div>

        {/* Title */}
        <h1 className="text-white text-[28px] md:text-[42px] font-bold leading-tight tracking-tight mb-8">
          {blog.title}
        </h1>

        {/* Hero image */}
        {imgSrc && (
          <div className="relative w-full rounded-2xl overflow-hidden mb-10" style={{ aspectRatio: "16/7" }}>
            <Image src={imgSrc} alt={blog.title} fill className="object-cover" sizes="860px" priority />
          </div>
        )}

        {/* Content */}
        <div className="prose-blog">
          {renderContent(blog.description)}
        </div>

        {/* Social share */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/40 text-[12px] uppercase tracking-widest font-semibold mb-4">Share this article</p>
          <ShareButtons title={blog.title} url={pageUrl} />
        </div>
      </article>

      {/* Related posts */}
      {blog.related && blog.related.length > 0 && (
        <section className="border-t border-white/5 bg-[#111] py-12 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-[42px]">
            <h2 className="text-white text-[20px] font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blog.related.map(r => {
                const rImg = r.image ? `${UPLOADS}${r.image}` : null;
                const rExcerpt = r.description.length > 110 ? r.description.slice(0, 110) + "…" : r.description;
                return (
                  <Link key={r.id} href={`/blogs/cricket/${r.slug}`}
                    className="group flex flex-col bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 hover:border-[#f69a39]/30 transition-colors">
                    <div className="relative aspect-[16/9] bg-[#222] overflow-hidden">
                      {rImg ? (
                        <Image src={rImg} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#f69a39]/10 to-[#1e1e21] flex items-center justify-center">
                          <span className="text-3xl">🏏</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-white text-[14px] font-bold leading-snug mb-2 group-hover:text-[#f69a39] transition-colors line-clamp-2">{r.title}</h3>
                      <p className="text-white/40 text-[12px] leading-relaxed flex-1 line-clamp-3">{rExcerpt}</p>
                      <div className="mt-3 text-white/30 text-[11px]">{formatDate(r.created_at)}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
