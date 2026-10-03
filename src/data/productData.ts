// Product, pricing and combo data shared by the website and the server.
// Keep this file free of browser-only imports (images, DOM) so the server can use it.

export const MIN_ORDER_AMOUNT = 100;

export type PackSize = {
  label: string; // e.g. '500 g', '1 kg'
  price: number; // price per pack in INR
  stock: number; // packs available
};

export type ProductData = {
  name: string;
  category: string;
  sizes: PackSize[];
  description: string;
};

export const productData: ProductData[] = [
  // Jaggery
  { name: 'Organic Cane Jaggery', category: 'Jaggery', sizes: [{ label: '500 g', price: 100, stock: 20 }, { label: '1 kg', price: 150, stock: 20 }, { label: '2 kg', price: 250, stock: 20 }], description: 'Certified organic jaggery made from chemical-free sugarcane juice, slow-boiled in open pans.' },
  { name: 'Natural Cane Jaggery', category: 'Jaggery', sizes: [{ label: '500 g', price: 50, stock: 20 }, { label: '1 kg', price: 100, stock: 20 }, { label: '2 kg', price: 150, stock: 20 }], description: 'Pure sugarcane jaggery with no added colour, sulphur or preservatives. Rich golden-brown taste.' },
  { name: 'Traditional Gur', category: 'Jaggery', sizes: [{ label: '500 g', price: 50, stock: 20 }, { label: '1 kg', price: 100, stock: 20 }, { label: '2 kg', price: 200, stock: 20 }], description: 'Village-style gur prepared in iron kadhais, with a deep caramel flavour for sweets and daily use.' },
  { name: 'Organic Palmyra Jaggery', category: 'Jaggery', sizes: [{ label: '500 g', price: 250, stock: 20 }, { label: '1 kg', price: 450, stock: 20 }, { label: '2 kg', price: 850, stock: 20 }], description: 'Organic jaggery from palmyra palm sap (karupatti), low on the glycaemic index and mineral-rich.' },
  { name: 'Palm Jaggery', category: 'Jaggery', sizes: [{ label: '500 g', price: 200, stock: 20 }, { label: '1 kg', price: 400, stock: 20 }, { label: '2 kg', price: 750, stock: 20 }], description: 'Natural palm sap jaggery with a smoky, earthy sweetness. A healthier swap for refined sugar.' },
  { name: 'Jaggery Blocks', category: 'Jaggery', sizes: [{ label: '500 g', price: 50, stock: 20 }, { label: '1 kg', price: 100, stock: 20 }, { label: '2 kg', price: 150, stock: 20 }], description: 'Firm, uniform jaggery blocks, ideal for wholesale, retail repacking and long storage.' },
  { name: 'Jaggery Lumps', category: 'Jaggery', sizes: [{ label: '500 g', price: 50, stock: 20 }, { label: '1 kg', price: 100, stock: 20 }, { label: '2 kg', price: 150, stock: 20 }], description: 'Natural irregular jaggery lumps (bheli), easy to break and perfect for cooking and sweets.' },
  // Natural Honey
  { name: 'Raw Natural Honey', category: 'Natural Honey', sizes: [{ label: '250 g', price: 150, stock: 20 }, { label: '500 g', price: 250, stock: 20 }, { label: '1 kg', price: 450, stock: 20 }], description: 'Unprocessed, unheated honey that keeps its natural enzymes, pollen and antioxidants.' },
  { name: 'Forest Honey', category: 'Natural Honey', sizes: [{ label: '250 g', price: 200, stock: 20 }, { label: '500 g', price: 350, stock: 20 }, { label: '1 kg', price: 650, stock: 20 }], description: 'Wild honey collected from deep forest hives. Dark, bold and full of natural minerals.' },
  { name: 'Wildflower Honey', category: 'Natural Honey', sizes: [{ label: '250 g', price: 150, stock: 20 }, { label: '500 g', price: 300, stock: 20 }, { label: '1 kg', price: 500, stock: 20 }], description: 'Honey from bees foraging on seasonal wildflowers, with a rich and varied floral flavour.' },
  { name: 'Multi-Floral Honey', category: 'Natural Honey', sizes: [{ label: '250 g', price: 150, stock: 20 }, { label: '500 g', price: 250, stock: 20 }, { label: '1 kg', price: 400, stock: 20 }], description: 'A balanced, everyday honey from multiple flower sources. Smooth taste for all uses.' },
  { name: 'Single-Floral Honey', category: 'Natural Honey', sizes: [{ label: '250 g', price: 200, stock: 20 }, { label: '500 g', price: 350, stock: 20 }, { label: '1 kg', price: 600, stock: 20 }], description: 'Monofloral honey sourced mainly from a single flower variety for a distinct, consistent taste.' },
  { name: 'Mustard Flower Honey', category: 'Natural Honey', sizes: [{ label: '250 g', price: 100, stock: 20 }, { label: '500 g', price: 200, stock: 20 }, { label: '1 kg', price: 400, stock: 20 }], description: 'Light, creamy honey from mustard blossoms that crystallises naturally — a sign of purity.' },
  { name: 'Eucalyptus Honey', category: 'Natural Honey', sizes: [{ label: '250 g', price: 150, stock: 20 }, { label: '500 g', price: 250, stock: 20 }, { label: '1 kg', price: 450, stock: 20 }], description: 'Amber honey with a mild herbal, menthol note. Traditionally used for throat and cold relief.' },
  { name: 'Acacia Honey', category: 'Natural Honey', sizes: [{ label: '250 g', price: 250, stock: 20 }, { label: '500 g', price: 400, stock: 20 }, { label: '1 kg', price: 750, stock: 20 }], description: 'Pale, delicate honey from acacia blossoms. Stays liquid longer and has a light, clean sweetness.' },
  { name: 'Jamun Honey', category: 'Natural Honey', sizes: [{ label: '250 g', price: 200, stock: 20 }, { label: '500 g', price: 400, stock: 20 }, { label: '1 kg', price: 700, stock: 20 }], description: 'Dark honey from jamun tree flowers, slightly tangy and valued in traditional wellness.' },
  { name: 'Lychee Honey', category: 'Natural Honey', sizes: [{ label: '250 g', price: 150, stock: 20 }, { label: '500 g', price: 300, stock: 20 }, { label: '1 kg', price: 550, stock: 20 }], description: 'Fruity, aromatic honey from lychee orchards with a fresh floral fragrance.' },
  { name: 'Himalayan Natural Honey', category: 'Natural Honey', sizes: [{ label: '250 g', price: 250, stock: 20 }, { label: '500 g', price: 500, stock: 20 }, { label: '1 kg', price: 900, stock: 20 }], description: 'Pure honey from high-altitude Himalayan flora, collected from pristine mountain apiaries.' },
  { name: 'Organic Natural Honey', category: 'Natural Honey', sizes: [{ label: '250 g', price: 250, stock: 20 }, { label: '500 g', price: 450, stock: 20 }, { label: '1 kg', price: 800, stock: 20 }], description: 'Certified organic honey from pesticide-free zones, tested for purity and quality.' },
];

export type ComboItem = { product: string; size: string };

export type Combo = {
  name: string;
  tagline: string;
  price: number; // discounted combo price in INR
  stock: number;
  items: ComboItem[];
};

export const combos: Combo[] = [
  {
    name: 'Sweet Starter Pack',
    tagline: 'Try our jaggery and honey',
    price: 500,
    stock: 10,
    items: [
      { product: 'Natural Cane Jaggery', size: '1 kg' },
      { product: 'Jaggery Lumps', size: '1 kg' },
      { product: 'Jaggery Blocks', size: '500 g' },
      { product: 'Raw Natural Honey', size: '500 g' },
      { product: 'Mustard Flower Honey', size: '250 g' },
    ],
  },
  {
    name: 'Healthy Home Combo',
    tagline: 'Everyday swaps for refined sugar',
    price: 800,
    stock: 10,
    items: [
      { product: 'Organic Cane Jaggery', size: '1 kg' },
      { product: 'Traditional Gur', size: '1 kg' },
      { product: 'Natural Cane Jaggery', size: '500 g' },
      { product: 'Multi-Floral Honey', size: '1 kg' },
      { product: 'Eucalyptus Honey', size: '500 g' },
    ],
  },
  {
    name: 'Family Bundle',
    tagline: 'A month of natural sweetness for the family',
    price: 1000,
    stock: 10,
    items: [
      { product: 'Organic Cane Jaggery', size: '2 kg' },
      { product: 'Natural Cane Jaggery', size: '2 kg' },
      { product: 'Raw Natural Honey', size: '1 kg' },
      { product: 'Wildflower Honey', size: '500 g' },
    ],
  },
  {
    name: 'Palm & Honey Wellness',
    tagline: 'Palm jaggery and wellness honeys',
    price: 1200,
    stock: 10,
    items: [
      { product: 'Organic Palmyra Jaggery', size: '1 kg' },
      { product: 'Palm Jaggery', size: '500 g' },
      { product: 'Forest Honey', size: '500 g' },
      { product: 'Jamun Honey', size: '500 g' },
    ],
  },
  {
    name: 'Floral Honey Collection',
    tagline: 'Six single-source honeys to taste and compare',
    price: 1500,
    stock: 10,
    items: [
      { product: 'Acacia Honey', size: '500 g' },
      { product: 'Single-Floral Honey', size: '500 g' },
      { product: 'Lychee Honey', size: '500 g' },
      { product: 'Wildflower Honey', size: '500 g' },
      { product: 'Eucalyptus Honey', size: '500 g' },
      { product: 'Mustard Flower Honey', size: '500 g' },
    ],
  },
  {
    name: 'Premium Gift Hamper',
    tagline: 'Our finest honey and jaggery, ready to gift',
    price: 2000,
    stock: 10,
    items: [
      { product: 'Himalayan Natural Honey', size: '1 kg' },
      { product: 'Organic Natural Honey', size: '500 g' },
      { product: 'Acacia Honey', size: '500 g' },
      { product: 'Organic Palmyra Jaggery', size: '1 kg' },
      { product: 'Organic Cane Jaggery', size: '1 kg' },
    ],
  },
];

export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
];
