// ─── Image Asset URLs ───────────────────────────────────────────────────────
export const ASSETS = {
  logo: "/assets/logo.png",
  heroBanner: "/banner1.webp",
  secondBanner: "/banner2.webp",
  thirdBanner: "/banner3.webp",
  giftCard: "/assets/gift-card.svg",
  // Photographic images — replace these files in /public/assets/ with real images
  brandImage: "",
  playerImage: "",
  socialImage: "",
  // Department placeholder colours (used as fallback when no image)
  grayNicollsBats: "", cricketSpikes: "", adidasShoes: "", thighPads: "",
  accessories: "", abdoGuards: "", matchBalls: "",
  cricketBats: "", battingPads: "", battingGloves: "", helmets: "",
  adultShoes: "", kidsShoes: "",
  wicketKeeping: "", personalProtection: "", bagsLuggage: "", balls: "", clothing: "",
  batProduct: "", glovesProduct: "", padsProduct: "", bagProduct: "",
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
  { label: "Stores", href: "/stores" },
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
  { label: "Cricket Blogs", href: "/blogs/cricket" },
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
