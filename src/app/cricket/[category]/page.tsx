import { Metadata } from "next";
import ProductsPage from "@/app/products/page";

type Props = {
  params: { category: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const name = params.category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${name} | PAPAS Willow Cricket Store`,
    description: `Shop ${name} at PAPAS Willow. Top brands, fast dispatch, worldwide delivery.`,
  };
}

// Reuse the products listing page for every cricket sub-route
export default ProductsPage;
