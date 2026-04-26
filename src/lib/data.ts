// ─── Image Asset URLs from Figma ───────────────────────────────────────────
export const ASSETS = {
  logo: "https://www.figma.com/api/mcp/asset/fc9bf452-969c-4cbf-a38c-3f5a2eacc35a",
  heroBanner: "https://www.figma.com/api/mcp/asset/e2c119ed-59bb-4b01-be43-0599d53a2ca7",
  // Department images
  grayNicollsBats: "https://www.figma.com/api/mcp/asset/40afef8c-7b66-4f43-bb6a-7aab6c38ef91",
  cricketSpikes: "https://www.figma.com/api/mcp/asset/cb8a9319-a434-473a-997d-cde4992ef008",
  adidasShoes: "https://www.figma.com/api/mcp/asset/ffdcae4f-3cd7-477a-87c9-e855e12f1342",
  thighPads: "https://www.figma.com/api/mcp/asset/459a627b-2d45-4daf-8758-1a575e26fcd3",
  accessories: "https://www.figma.com/api/mcp/asset/f9a2fd37-a2cc-449d-b4c0-a982b3fe7b86",
  abdoGuards: "https://www.figma.com/api/mcp/asset/f64f0254-5309-461c-a4ba-8bc3e4468057",
  matchBalls: "https://www.figma.com/api/mcp/asset/a4f3164e-99bd-4bda-b526-e00230a3044b",
  // Essentials
  cricketBats: "https://www.figma.com/api/mcp/asset/201a1b4e-ebae-4e56-8529-91d1f2f06a12",
  battingPads: "https://www.figma.com/api/mcp/asset/47190bf7-dfd2-43b1-8131-8994288636f2",
  battingGloves: "https://www.figma.com/api/mcp/asset/41f8d63a-e01f-45b3-a0cc-7ee586077761",
  helmets: "https://www.figma.com/api/mcp/asset/c2021b98-74bd-4192-9d4c-e731f1adb8f6",
  // Shoes
  adultShoes: "https://www.figma.com/api/mcp/asset/deb83455-11d4-4c51-a52d-381c0cc99965",
  kidsShoes: "https://www.figma.com/api/mcp/asset/67d0ce93-1321-41b8-834c-565843a8193f",
  // Other departments
  wicketKeeping: "https://www.figma.com/api/mcp/asset/4a1c4244-e894-4fe3-b602-dde79cf6d8be",
  personalProtection: "https://www.figma.com/api/mcp/asset/08c0d347-cd1d-45ed-be6f-db9ba6779a19",
  bagsLuggage: "https://www.figma.com/api/mcp/asset/1973b8c7-0e27-45f2-975f-c29da67a1caf",
  balls: "https://www.figma.com/api/mcp/asset/d0ae53a0-a417-4718-a27a-f956a5a25317",
  clothing: "https://www.figma.com/api/mcp/asset/f4108bd6-0d1b-4d43-af17-503ac497ed06",
  // Brand section
  brandImage: "https://www.figma.com/api/mcp/asset/762239e0-a5e8-43ed-b6c9-b9d9c8dde036",
  // Trust icons
  trustpilot: "https://www.figma.com/api/mcp/asset/a08ab14b-1646-4313-b3fa-6b27cdd181a1",
  returnsIcon: "https://www.figma.com/api/mcp/asset/80ab5a5a-8930-4515-8c96-5c7cc634bd99",
  genuineIcon: "https://www.figma.com/api/mcp/asset/1b91d5a8-acd8-4c9c-90e1-6aecc6d3e671",
  shippingIcon: "https://www.figma.com/api/mcp/asset/2ab7a60f-3336-4fdb-96de-92972bccc7fb",
  partnerIcon: "https://www.figma.com/api/mcp/asset/8c43fbaf-ff26-47b5-8732-5c027ba87fd9",
  // Products
  batProduct: "https://www.figma.com/api/mcp/asset/aaa4fbb2-9aba-4bfa-a1d6-113eeab8a937",
  glovesProduct: "https://www.figma.com/api/mcp/asset/bdd0dbb6-095d-4fce-b79f-cdabf8c5443c",
  padsProduct: "https://www.figma.com/api/mcp/asset/b2a8ec85-bdb0-4b7c-b624-d98755d1bf7d",
  bagProduct: "https://www.figma.com/api/mcp/asset/49014fc2-c139-44b3-b39e-19d67659e747",
  // Player/lifestyle
  playerImage: "https://www.figma.com/api/mcp/asset/f3a021b3-9158-46c6-88e7-a0c5ea09b069",
  socialImage: "https://www.figma.com/api/mcp/asset/2585e4ea-6b81-4e66-887c-ad1ee0efd9b3",
  giftCard: "https://www.figma.com/api/mcp/asset/8eaf3db5-9eb9-4dbb-a8de-c31bd5851fe0",
};

// ─── Navigation Data ────────────────────────────────────────────────────────
export const SPORTS_NAV = [
  { label: "Cricket", href: "/cricket", active: true },
  { label: "Football", href: "/football" },
  { label: "Running", href: "/running" },
  { label: "Lifestyle", href: "/lifestyle" },
  { label: "Rugby", href: "/rugby" },
  { label: "Basketball", href: "/basketball" },
  { label: "Tennis", href: "/tennis" },
  { label: "Padel", href: "/padel" },
  { label: "OUTLET", href: "/outlet" },
];

export const CRICKET_NAV = [
  { label: "Bats", href: "/cricket/bats" },
  { label: "Shoes", href: "/cricket/shoes" },
  { label: "Batting Equipment", href: "/cricket/batting-equipment" },
  { label: "Wicket Keeping", href: "/cricket/wicket-keeping" },
  { label: "Helmets", href: "/cricket/helmets" },
  { label: "Protection", href: "/cricket/protection" },
  { label: "Equipment", href: "/cricket/equipment" },
  { label: "Clothing", href: "/cricket/clothing" },
  { label: "Sale", href: "/cricket/sale", highlight: true },
];

// ─── Department Data ────────────────────────────────────────────────────────
export const DEPARTMENTS = [
  { id: 1, name: "Gray-Nicolls Bats", image: ASSETS.grayNicollsBats, href: "/cricket/bats/gray-nicolls" },
  { id: 2, name: "Cricket Spikes", image: ASSETS.cricketSpikes, href: "/cricket/shoes/spikes" },
  { id: 3, name: "Adidas Shoes", image: ASSETS.adidasShoes, href: "/cricket/shoes/adidas" },
  { id: 4, name: "Thigh Pads", image: ASSETS.thighPads, href: "/cricket/protection/thigh-pads" },
  { id: 5, name: "Accessories", image: ASSETS.accessories, href: "/cricket/accessories" },
  { id: 6, name: "Abdo Guards", image: ASSETS.abdoGuards, href: "/cricket/protection/abdo-guards" },
  { id: 7, name: "Match Balls", image: ASSETS.matchBalls, href: "/cricket/balls/match" },
];

// ─── Essentials Tiles ───────────────────────────────────────────────────────
export const ESSENTIALS = [
  {
    id: 1,
    name: "Cricket Bats",
    image: ASSETS.cricketBats,
    links: [{ label: "Shop Adults", href: "/cricket/bats/adults" }, { label: "Shop Kids", href: "/cricket/bats/kids" }],
  },
  {
    id: 2,
    name: "Batting Pads",
    image: ASSETS.battingPads,
    links: [{ label: "Shop Adults", href: "/cricket/pads/adults" }, { label: "Shop Kids", href: "/cricket/pads/kids" }],
  },
  {
    id: 3,
    name: "Batting Gloves",
    image: ASSETS.battingGloves,
    links: [{ label: "Shop Gloves", href: "/cricket/gloves/adults" }, { label: "Kids Gloves", href: "/cricket/gloves/kids" }],
  },
  {
    id: 4,
    name: "Helmets",
    image: ASSETS.helmets,
    links: [{ label: "Shop Adults", href: "/cricket/helmets/adults" }, { label: "Shop Kids", href: "/cricket/helmets/kids" }],
  },
];

// ─── Shoe Tiles ─────────────────────────────────────────────────────────────
export const SHOE_TILES = [
  {
    id: 1,
    name: "Adult's Shoes",
    image: ASSETS.adultShoes,
    links: [{ label: "Shop Now", href: "/cricket/shoes/adults" }],
  },
  {
    id: 2,
    name: "Kids' Shoes",
    image: ASSETS.kidsShoes,
    links: [{ label: "Shop Now", href: "/cricket/shoes/kids" }],
  },
];

// ─── Other Departments ──────────────────────────────────────────────────────
export const OTHER_DEPARTMENTS = [
  {
    id: 1,
    name: "Wicket Keeping",
    image: ASSETS.wicketKeeping,
    links: [{ label: "Shop Adults", href: "/cricket/wicket-keeping/adults" }, { label: "Shop Kids", href: "/cricket/wicket-keeping/kids" }],
  },
  {
    id: 2,
    name: "Personal Protection",
    image: ASSETS.personalProtection,
    links: [{ label: "Shop Adults", href: "/cricket/protection/adults" }, { label: "Shop Kids", href: "/cricket/protection/kids" }],
  },
  {
    id: 3,
    name: "Bags & Luggage",
    image: ASSETS.bagsLuggage,
    links: [{ label: "Shop Now", href: "/cricket/bags" }],
  },
  {
    id: 4,
    name: "Balls",
    image: ASSETS.balls,
    links: [{ label: "Shop Now", href: "/cricket/balls" }],
  },
  {
    id: 5,
    name: "Clothing",
    image: ASSETS.clothing,
    links: [{ label: "Shop Now", href: "/cricket/clothing" }],
  },
];

// ─── Trust Badges ───────────────────────────────────────────────────────────
export const TRUST_BADGES = [
  { id: 1, title: "Over 100,000 5 Star Reviews on Trustpilot", subtitle: "5 Star Reviews By Great Players", icon: ASSETS.trustpilot },
  { id: 2, title: "Hassle Free Returns", subtitle: "Hassle Free Returns", icon: ASSETS.returnsIcon },
  { id: 3, title: "100% Genuine Brands", subtitle: "100% Genuine Brands", icon: ASSETS.genuineIcon },
  { id: 4, title: "Fast Dispatch, Worldwide Delivery", subtitle: "Fast Dispatch, Worldwide Delivery", icon: ASSETS.shippingIcon },
  { id: 5, title: "Partnered with the PFA and ESFA", subtitle: "Partnered with the PFA and ESFA", icon: ASSETS.partnerIcon },
];

// ─── Products Data ──────────────────────────────────────────────────────────
export interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  images: string[];
  badge?: string;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: "gray-nicolls-havoc-gn550-cricket-bat",
    name: "Gray-Nicolls Havoc 1.0 GN550 SL Cricket Bat",
    brand: "Gray-Nicolls",
    category: "Bats",
    price: 240,
    originalPrice: 300,
    discount: "50% OFF | SAVE $60.00",
    image: ASSETS.batProduct,
    images: [ASSETS.batProduct, ASSETS.cricketBats, ASSETS.grayNicollsBats],
    badge: "SALE",
    rating: 4.8,
    reviewCount: 124,
    description: "The Gray-Nicolls Havoc 1.0 GN550 SL Cricket Bat is engineered for aggressive stroke play and dynamic performance. Crafted for players who dominate the game, it offers unmatched power, strong presence, and total confidence at the crease.",
    features: [
      "Premium Grade 1 English Willow",
      "Full toe protection",
      "Rounded edges for maximum power",
      "Traditional oval handle with superior grip",
      "Comes with full-length bat cover",
    ],
    sizes: ["SH", "LH", "SH Pro"],
    colors: ["Natural"],
    inStock: true,
  },
  {
    id: 2,
    slug: "ca-gold-batting-gloves",
    name: "CA GOLD Batting Gloves",
    brand: "CA",
    category: "Gloves",
    price: 40,
    originalPrice: 50,
    discount: "50% OFF | SAVE $10.00",
    image: ASSETS.glovesProduct,
    images: [ASSETS.glovesProduct, ASSETS.battingGloves],
    badge: "SALE",
    rating: 4.5,
    reviewCount: 87,
    description: "Professional grade batting gloves providing superior protection and grip. The CA GOLD series delivers premium comfort for serious cricketers at every level.",
    features: [
      "Premium leather palm",
      "Anatomical fit design",
      "Superior finger protection",
      "Velcro wrist strap",
      "Breathable mesh back",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["White/Gold", "Navy/Gold"],
    inStock: true,
  },
  {
    id: 3,
    slug: "ss-batting-pads",
    name: "SS Batting Pads",
    brand: "SS",
    category: "Protection",
    price: 120,
    originalPrice: 150,
    discount: "50% OFF | SAVE $30.00",
    image: ASSETS.padsProduct,
    images: [ASSETS.padsProduct, ASSETS.battingPads],
    badge: "SALE",
    rating: 4.7,
    reviewCount: 63,
    description: "Lightweight yet highly protective batting pads from SS Cricket. Designed for comfort and durability, these pads offer excellent coverage without compromising mobility.",
    features: [
      "High-density foam padding",
      "PU leather outer shell",
      "Three strap system for secure fit",
      "Anatomically contoured knee roll",
      "Available in RH and LH versions",
    ],
    sizes: ["Junior", "Youth", "Adults", "XL Adults"],
    colors: ["White", "White/Blue"],
    inStock: true,
  },
  {
    id: 4,
    slug: "red-gold-wheelie-bag",
    name: "RED - GOLD Wheelie Bag",
    brand: "Red Sports",
    category: "Bags",
    price: 52,
    originalPrice: 65,
    discount: "50% OFF | SAVE $13.00",
    image: ASSETS.bagProduct,
    images: [ASSETS.bagProduct, ASSETS.bagsLuggage],
    badge: "SALE",
    rating: 4.3,
    reviewCount: 41,
    description: "Spacious cricket wheelie bag with separate bat compartment. Built for travelling cricketers who need to carry their complete kit in style and comfort.",
    features: [
      "Extra large capacity",
      "Separate bat compartment (holds up to 3 bats)",
      "Waterproof base",
      "Padded shoulder straps and handles",
      "Heavy duty wheels for easy transport",
    ],
    sizes: ["One Size"],
    colors: ["Red/Gold"],
    inStock: true,
  },
  {
    id: 5,
    slug: "gray-nicolls-havoc-helmet",
    name: "Gray-Nicolls Havoc Cricket Helmet",
    brand: "Gray-Nicolls",
    category: "Helmets",
    price: 180,
    originalPrice: 220,
    discount: "18% OFF",
    image: ASSETS.helmets,
    images: [ASSETS.helmets],
    rating: 4.9,
    reviewCount: 156,
    description: "The Gray-Nicolls Havoc helmet offers top-tier protection with a BSI/AS certified grille system. Lightweight construction with advanced ventilation technology.",
    features: [
      "BSI/AS certified protection",
      "Stainless steel grille",
      "Advanced ventilation system",
      "Adjustable comfort liner",
      "Available with or without peak",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "White", "Black"],
    inStock: true,
  },
  {
    id: 6,
    slug: "adidas-cricket-spikes",
    name: "Adidas Cricket Spikes Shoes",
    brand: "Adidas",
    category: "Shoes",
    price: 95,
    originalPrice: 130,
    discount: "27% OFF",
    image: ASSETS.adidasShoes,
    images: [ASSETS.adidasShoes, ASSETS.adultShoes],
    rating: 4.6,
    reviewCount: 92,
    description: "High-performance cricket shoes from Adidas featuring replaceable spikes for optimal traction on all pitch conditions. Lightweight design with excellent ankle support.",
    features: [
      "Replaceable metal spikes (6 included)",
      "Cushioned insole for all-day comfort",
      "Synthetic leather upper",
      "Reinforced toe cap",
      "Available in wide fit",
    ],
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["White/Black", "White/Navy"],
    inStock: true,
  },
];

// ─── Product Listing Page Filters ───────────────────────────────────────────
export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top Rated" },
];

export const FILTER_BRANDS = ["Gray-Nicolls", "SS", "CA", "Adidas", "Kookaburra", "New Balance", "GM"];
export const FILTER_SIZES = ["S", "M", "L", "XL", "SH", "LH", "Junior", "Youth", "Adults"];
export const FILTER_PRICE_RANGES = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: Infinity },
];
