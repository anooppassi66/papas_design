import HeroBanner from "@/components/home/HeroBanner";
import ShopByDepartment from "@/components/home/ShopByDepartment";
import ContentTileGrid from "@/components/home/ContentTileGrid";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import OtherDepartments from "@/components/home/OtherDepartments";
import AboutSection from "@/components/home/AboutSection";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
const UPLOADS = API.replace("/api", "");

interface HomeCat { id: number; name: string; slug: string; image: string | null; }
interface FeaturedProduct { id: number; name: string; slug: string; sell_price: number; image: string | null; }
interface FeaturedBrand { id: number; brand_name: string; brand_image: string | null; products: FeaturedProduct[]; }
interface HomepageData {
  shop_by_department: HomeCat[];
  essentials: HomeCat[];
  shoes: HomeCat[];
  featured_brand: FeaturedBrand | null;
  other_departments: HomeCat[];
}

async function getHomepageData(): Promise<HomepageData | null> {
  try {
    const res = await fetch(`${API}/customer/homepage`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

function catToTile(cat: HomeCat) {
  return {
    id: cat.id,
    name: cat.name,
    image: cat.image ? `${UPLOADS}${cat.image}` : "",
    links: [{ label: "Shop Now", href: `/cricket/${cat.slug}` }],
  };
}

export default async function HomePage() {
  const hp = await getHomepageData();

  const shopDepts = (hp?.shop_by_department || []).map(c => ({
    id: c.id, name: c.name,
    image: c.image ? `${UPLOADS}${c.image}` : "",
    href: `/cricket/${c.slug}`,
  }));

  const essentialTiles = (hp?.essentials || []).map(catToTile);
  const shoeTiles = (hp?.shoes || []).map(catToTile);
  const otherDepts = (hp?.other_departments || []).map(c => ({
    id: c.id, name: c.name,
    image: c.image ? `${UPLOADS}${c.image}` : "",
    links: [{ label: "Shop Now", href: `/cricket/${c.slug}` }],
  }));

  const featuredBrand = hp?.featured_brand
    ? {
        ...hp.featured_brand,
        brand_image: hp.featured_brand.brand_image ? `${UPLOADS}${hp.featured_brand.brand_image}` : null,
        products: hp.featured_brand.products.map(p => ({
          ...p,
          image: p.image ? `${UPLOADS}${p.image}` : null,
        })),
      }
    : null;

  return (
    <main>
      <HeroBanner />
      {shopDepts.length > 0 && <ShopByDepartment departments={shopDepts} />}
      {essentialTiles.length > 0 && <ContentTileGrid title="Cricket Essentials" tiles={essentialTiles} layout="4col" dark />}
      {shoeTiles.length > 0 && <ContentTileGrid title="Cricket Shoes" tiles={shoeTiles} layout="2col" dark />}
      {featuredBrand && <FeaturedProductsSection brand={featuredBrand} />}
      {otherDepts.length > 0 && <OtherDepartments departments={otherDepts} />}
      <AboutSection />
    </main>
  );
}
