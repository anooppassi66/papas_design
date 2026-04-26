import HeroBanner from "@/components/home/HeroBanner";
import ShopByDepartment from "@/components/home/ShopByDepartment";
import ContentTileGrid from "@/components/home/ContentTileGrid";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import OtherDepartments from "@/components/home/OtherDepartments";
import AboutSection from "@/components/home/AboutSection";
import { ESSENTIALS, SHOE_TILES } from "@/lib/data";

export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <ShopByDepartment />
      <ContentTileGrid title="Cricket Essentials" tiles={ESSENTIALS} layout="4col" dark />
      <ContentTileGrid title="Cricket Shoes" tiles={SHOE_TILES} layout="2col" dark />
      <FeaturedProductsSection />
      <OtherDepartments />
      <AboutSection />
    </main>
  );
}
