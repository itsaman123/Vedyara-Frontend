import Honey from '../assets/image-1.jpg'
import Haldi from '../assets/haldi.jpeg'
import Dhaniya from '../assets/dhaniya.jpeg'

export type Product = {
  id: string | number;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  image: string;
  images?: string[];
  description: string;
  shortDesc: string;
  benefits: string[];
  weight: string;
  amazonLink: string;
  rating: number;
  reviews: number;
  limited?: boolean;
  featured?: boolean;
};

export interface Category {
  id: string;
  label: string;
  emoji: string;
}

export const products: Product[] = [
  {
    id: 3,
    name: "Vedyara Multi Flora Honey",
    category: "honey",
    price: "₹699",
    originalPrice: "₹1799",
    badge: "Best Seller",
    image: Honey,
    images: [Honey, Haldi, Dhaniya],
    shortDesc: "Pure multi flora honey — raw, unprocessed, sourced from pristine wildflower forests",
    description:
      "Vedyara Multi Flora Honey is sourced from the farm, where bees feed on a variety of wildflowers blooming across pristine forests. This pure multiflora honey is completely raw and unprocessed, retaining all its natural enzymes, antioxidants, and healing properties. Cold-extracted without any heat treatment to preserve full nutritional value.",
    benefits: [
      "Boosts Immunity",
      "Rich in Antioxidants",
      "Natural Energy",
      "Aids Digestion",
    ],
    weight: "1Kg",
    amazonLink: "https://www.amazon.in",
    rating: 4.9,
    reviews: 248,
    limited: false,
    featured: true,
  },
  {
    id: 1,
    name: "Vedyara Multi Flora Honey",
    category: "honey",
    price: "₹449",
    originalPrice: "₹899",
    badge: "Best Seller",
    image: Honey,
    images: [Honey, Haldi, Dhaniya],
    shortDesc: "Pure multi flora honey — raw, unprocessed, sourced from pristine wildflower forests",
    description:
      "Vedyara Multi Flora Honey is sourced from the farm, where bees feed on a variety of wildflowers blooming across pristine forests. This pure multiflora honey is completely raw and unprocessed, retaining all its natural enzymes, antioxidants, and healing properties. Cold-extracted without any heat treatment to preserve full nutritional value.",
    benefits: [
      "Boosts Immunity",
      "Rich in Antioxidants",
      "Natural Energy",
      "Aids Digestion",
    ],
    weight: "500g",
    amazonLink: "https://www.amazon.in",
    rating: 4.9,
    reviews: 312,
    limited: false,
    featured: true,
  },
  {
    id: 5,
    name: "Natural Coriander Powder",
    category: "spices",
    price: "₹99",
    originalPrice: "₹129",
    badge: "Fresh",
    image: Dhaniya,
    images: [Dhaniya, Haldi],
    shortDesc: "Aromatic coriander powder made from premium quality seeds",
    description:
      "Our Natural Coriander Powder is made from carefully selected seeds and ground to preserve its natural aroma and flavor. It aids digestion, supports metabolism, and enhances the taste of every dish.",
    benefits: ["Aromatic", "Digestive Aid", "Rich Flavor", "Pure & Fresh"],
    weight: "200g",
    amazonLink: "https://www.amazon.in",
    rating: 4.5,
    reviews: 98,
    limited: false,
    featured: true,
  },
  {
    id: 6,
    name: "Natural Turmeric Powder",
    category: "spices",
    price: "₹129",
    originalPrice: "₹159",
    badge: "Bestseller",
    image: Haldi,
    images: [Haldi, Dhaniya, Honey],
    shortDesc: "High curcumin turmeric powder for immunity and wellness",
    description:
      "Our Natural Turmeric Powder is sourced from trusted farms and processed to retain high curcumin content. Known for its anti-inflammatory and immunity-boosting properties, it is a staple for both cooking and health.",
    benefits: ["High Curcumin", "Immunity Boost", "Anti-inflammatory", "Pure & Natural"],
    weight: "200g",
    amazonLink: "https://www.amazon.in",
    rating: 4.8,
    reviews: 210,
    limited: false,
    featured: true,
  },
];

export const featuredProducts: Product[] = products.filter(
  (p) => p.featured === true
);

export const categories: Category[] = [
  { id: "all", label: "All Products", emoji: "🌿" },
  { id: "honey", label: "Honey", emoji: "🍯" },
  { id: "spices", label: "Spices & Powders", emoji: "✨" },
];

export const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    avatar: "PS",
    rating: 5,
    review:
      "The Himalayan Honey is absolutely pure and delicious. You can taste the difference from store-bought honey immediately. My whole family loves it!",
    product: "Vedyara Multi Flora Honey",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Rahul Verma",
    location: "Delhi",
    avatar: "RV",
    rating: 5,
    review:
      "The Turmeric Powder has incredible colour and aroma — nothing like the commercial brands. I use it daily and I can feel the difference in my energy levels.",
    product: "Natural Turmeric Powder",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Ananya Patel",
    location: "Ahmedabad",
    avatar: "AP",
    rating: 5,
    review:
      "The Coriander Powder has an incredible fragrance. My curries taste completely different now. Packaging is premium and quality is consistently excellent.",
    product: "Natural Coriander Powder",
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "Deepak Nair",
    location: "Bangalore",
    avatar: "DN",
    rating: 5,
    review:
      "Really happy with the honey quality. My kids love having it with warm milk every night. Vedyara has earned a permanent spot in our kitchen.",
    product: "Vedyara Multi Flora Honey",
    date: "1 week ago",
  },
];

export const whyChooseUs = [
  {
    id: 1,
    icon: "🌿",
    title: "100% Natural",
    description:
      "Pure produce grown without synthetic pesticides or fertilizers. Pure from farm to shelf.",
  },
  {
    id: 2,
    icon: "🚫",
    title: "No Chemicals",
    description:
      "Zero artificial preservatives, colours, or additives. What you see is exactly what nature intended.",
  },
  {
    id: 3,
    icon: "🌾",
    title: "Farm Sourced",
    description:
      "Direct partnerships with small-scale farmers across India. Fresh, traceable, transparent.",
  },
  {
    id: 4,
    icon: "🔬",
    title: "Lab Tested",
    description:
      "Every batch tested for purity, quality and safety in certified laboratories before reaching you.",
  },
];

export const stats = [
  { id: 1, value: "1000+", label: "Happy Customers" },
  { id: 2, value: "100%", label: "Natural" },
  { id: 3, value: "3", label: "Premium Products" },
  { id: 4, value: "4+", label: "Service Years" },
];
