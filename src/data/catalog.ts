import organicCaneJaggeryImg from '../img/organic-cane-jaggery.jpeg';
import naturalCaneJaggeryImg from '../img/natural-cane-jaggery.jpeg';
import traditionalGurImg from '../img/traditional-gur.jpeg';
import organicPalmyraJaggeryImg from '../img/organic-palmyra-jaggery.jpeg';
import palmJaggeryImg from '../img/palm-jaggery.jpeg';
import jaggeryBlocksImg from '../img/jaggery-blocks.jpeg';
import jaggeryLumpsImg from '../img/jaggery-lumps.jpeg';
import rawNaturalHoneyImg from '../img/raw-natural-honey.jpeg';
import forestHoneyImg from '../img/forest-honey.jpeg';
import wildflowerHoneyImg from '../img/wildflower-honey.jpeg';
import multiFloralHoneyImg from '../img/multi-floral-honey.jpeg';
import singleFloralHoneyImg from '../img/single-floral-honey.jpeg';
import mustardFlowerHoneyImg from '../img/mustard-flower-honey.jpeg';
import eucalyptusHoneyImg from '../img/eucalyptus-honey.jpeg';
import acaciaHoneyImg from '../img/acacia-honey.jpeg';
import jamunHoneyImg from '../img/jamun-honey.jpeg';
import lycheeHoneyImg from '../img/lychee-honey.jpeg';
import himalayanNaturalHoneyImg from '../img/himalayan-natural-honey.jpeg';
import organicNaturalHoneyImg from '../img/organic-natural-honey.jpeg';

import { productData, combos, type ProductData, type ComboItem, type Combo } from './productData';

export { combos, indianStates, MIN_ORDER_AMOUNT } from './productData';
export type { PackSize, ProductData, ComboItem, Combo } from './productData';

export type CatalogItem = ProductData & { image: string };

const productImages: Record<string, string> = {
  'Organic Cane Jaggery': organicCaneJaggeryImg,
  'Natural Cane Jaggery': naturalCaneJaggeryImg,
  'Traditional Gur': traditionalGurImg,
  'Organic Palmyra Jaggery': organicPalmyraJaggeryImg,
  'Palm Jaggery': palmJaggeryImg,
  'Jaggery Blocks': jaggeryBlocksImg,
  'Jaggery Lumps': jaggeryLumpsImg,
  'Raw Natural Honey': rawNaturalHoneyImg,
  'Forest Honey': forestHoneyImg,
  'Wildflower Honey': wildflowerHoneyImg,
  'Multi-Floral Honey': multiFloralHoneyImg,
  'Single-Floral Honey': singleFloralHoneyImg,
  'Mustard Flower Honey': mustardFlowerHoneyImg,
  'Eucalyptus Honey': eucalyptusHoneyImg,
  'Acacia Honey': acaciaHoneyImg,
  'Jamun Honey': jamunHoneyImg,
  'Lychee Honey': lycheeHoneyImg,
  'Himalayan Natural Honey': himalayanNaturalHoneyImg,
  'Organic Natural Honey': organicNaturalHoneyImg,
};

export const products: CatalogItem[] = productData.map((p) => ({ ...p, image: productImages[p.name] }));

export const supportEmail = 'support@agrovista.shop';
export const disputeEmail = 'dispute@agrovista.shop';
export const outOfStockContactEmail = supportEmail;

export type ServiceItem = {
  name: string;
  description: string;
};

export const categories: { name: string; icon: string; description: string }[] = [
  { name: 'Jaggery', icon: 'Candy', description: 'Chemical-free cane and palm jaggery, made the traditional way' },
  { name: 'Natural Honey', icon: 'Flower2', description: 'Pure, raw honey from forests, flowers and the Himalayas' },
];

// Resolves a combo item to its product and pack size (prices come from the catalog).
export function resolveComboItem(item: ComboItem) {
  const product = products.find((p) => p.name === item.product);
  const size = product?.sizes.find((s) => s.label === item.size);
  return { product, size, price: size?.price ?? 0 };
}

export const comboItemsSummary = (combo: Combo) =>
  combo.items.map((i) => `${i.product} ${i.size}`).join(', ');

export const comboValue = (combo: Combo) =>
  combo.items.reduce((sum, item) => sum + resolveComboItem(item).price, 0);

export const services: ServiceItem[] = [
  { name: 'Bulk Jaggery Supply', description: 'Cane and palm jaggery in bulk for retailers, sweet shops, bakeries and food businesses.' },
  { name: 'Bulk Honey Supply', description: 'Raw, forest and single-floral honey in bulk containers for resellers and brands.' },
  { name: 'Wholesale & Distributor Supply', description: 'Regular, reliable supply with wholesale pricing for distributors across India.' },
  { name: 'Private Label / White Label', description: 'Your brand on our product, with custom labels, packaging and pack sizes.' },
  { name: 'Custom Shapes & Pack Sizes', description: 'Jaggery blocks, cubes, lumps or powder, packed in the sizes you need.' },
  { name: 'Honey Filtering & Bottling', description: 'Gently strained, never overheated honey, bottled in jars or pouches.' },
  { name: 'Retail & Bulk Packaging', description: 'Food-grade, moisture-resistant packaging, from 250 g retail packs to bulk.' },
  { name: 'Quality Testing', description: 'Batch-wise checks for purity, moisture and taste before dispatch.' },
  { name: 'Pan-India Delivery', description: 'Safe, tracked delivery to homes and businesses across India.' },
];

