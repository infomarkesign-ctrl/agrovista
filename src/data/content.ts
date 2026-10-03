// Marketing copy for the homepage sections. Facts here must match the legal policies in legal.ts.

export const whyChooseUs: { icon: string; title: string; text: string }[] = [
  { icon: 'Sprout', title: 'Direct from the source', text: 'We buy straight from sugarcane farmers, palm tappers and beekeepers, with no middlemen. That keeps the product fresh and the price fair.' },
  { icon: 'ShieldCheck', title: 'Nothing added, nothing removed', text: 'No sulphur, chemical clarifiers, colours, preservatives or sugar syrup. Just jaggery and honey as nature made them.' },
  { icon: 'FlaskConical', title: 'Checked before packing', text: 'Every batch is checked for colour, aroma, moisture and purity before it is packed and sealed.' },
  { icon: 'PackageCheck', title: 'Food-grade packaging', text: 'Moisture-resistant, food-grade packs that keep jaggery dry and honey fresh all the way to your kitchen.' },
  { icon: 'Truck', title: 'Free delivery across India', text: 'Standard shipping is free on every order, with delivery in 3–7 business days to most pin codes.' },
  { icon: 'Wallet', title: 'Cash on Delivery', text: 'Pay when your order arrives. No advance payment needed.' },
];

export const processSteps: { title: string; text: string }[] = [
  { title: 'Sourcing', text: 'Fresh sugarcane juice, palm sap and raw honey are collected from partner farms and apiaries.' },
  { title: 'Traditional processing', text: 'Jaggery is slow-boiled in open pans. Honey is only strained to remove wax and impurities, never overheated.' },
  { title: 'Quality check', text: 'Each batch is inspected for purity, moisture and taste before it is approved.' },
  { title: 'Hygienic packing', text: 'Packed in food-grade, sealed packs in 250 g to 2 kg sizes.' },
  { title: 'Doorstep delivery', text: 'Dispatched within 1–2 business days and delivered free across India.' },
];

export const benefits: { title: string; points: string[] }[] = [
  {
    title: 'Why choose jaggery over sugar',
    points: [
      'Unrefined, so it keeps the natural minerals of sugarcane and palm sap, such as iron, magnesium and potassium',
      'Made without bleaching agents or chemical clarifiers',
      'A rich caramel flavour that suits tea, sweets, chikki and everyday cooking',
      'Palm jaggery has a lower glycaemic index than cane jaggery and refined sugar',
    ],
  },
  {
    title: 'Why choose natural honey',
    points: [
      'Raw honey keeps its natural enzymes, pollen and antioxidants',
      'Traditionally used to soothe the throat and ease coughs',
      'A natural sweetener for warm water, tea, desserts and breakfast',
      'Each floral variety has its own taste, colour and aroma',
    ],
  },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: 'Is your jaggery chemical-free?',
    a: 'Yes. Our jaggery is made from sugarcane juice or palm sap using traditional open-pan boiling, without sulphur, hydros, chemical clarifiers, colours or preservatives. That is why its colour is golden to dark brown rather than bright yellow.',
  },
  {
    q: 'My honey has crystallised. Is it adulterated?',
    a: 'No. Crystallisation is a natural sign of pure honey, especially mustard and multi-floral varieties in cooler weather. Place the closed jar in warm (not boiling) water for a few minutes and it will turn liquid again.',
  },
  {
    q: 'How should I store jaggery and honey?',
    a: 'Store jaggery in an airtight container in a cool, dry place, away from moisture. Keep honey tightly closed at room temperature, away from direct sunlight. There is no need to refrigerate it. Always use a dry spoon.',
  },
  {
    q: 'Which pack sizes are available?',
    a: 'Jaggery comes in 500 g, 1 kg and 2 kg packs. Honey comes in 250 g, 500 g and 1 kg packs. You can pick the size on each product page. For larger quantities, contact us for bulk pricing.',
  },
  {
    q: 'Do you deliver all over India? How long does it take?',
    a: 'Yes, we deliver across India, and standard shipping is free on all orders. Orders are dispatched within 1–2 business days and usually arrive within 3–7 business days, depending on your location. We currently do not ship outside India.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We currently accept Cash on Delivery, so you pay when your order arrives. The minimum order value is ₹100.',
  },
  {
    q: 'Can I cancel my order?',
    a: 'Yes. Orders can be cancelled free of charge within 12 hours of placing them, or before dispatch, whichever is earlier. Email support@agrovista.shop or call +91 73042 10746 with your order ID.',
  },
  {
    q: 'What if my order arrives damaged or incorrect?',
    a: 'Email support@agrovista.shop within 48 hours of delivery with your order ID and photos. After verification we will arrange a replacement or refund. If you are unhappy with the resolution, write to dispute@agrovista.shop.',
  },
  {
    q: 'Do you supply in bulk or offer private labelling?',
    a: 'Yes. We supply jaggery and honey in bulk to retailers, wholesalers, sweet shops and brands, and offer private-label and custom packaging. Send your requirement through the enquiry form below.',
  },
];

// Shown in the product popup, by category.
export const productCare: Record<string, { label: string; text: string }[]> = {
  Jaggery: [
    { label: 'Ingredients', text: '100% sugarcane juice or palm sap. No additives.' },
    { label: 'Storage', text: 'Airtight container, in a cool and dry place. Keep away from moisture.' },
    { label: 'Natural variation', text: 'Colour and texture vary slightly from batch to batch, as with any natural, unrefined product.' },
  ],
  'Natural Honey': [
    { label: 'Ingredients', text: '100% natural honey. No added sugar or syrup.' },
    { label: 'Storage', text: 'Room temperature, lid tightly closed, away from sunlight. Use a dry spoon.' },
    { label: 'Natural variation', text: 'Pure honey may crystallise in cool weather. Warm the jar gently to make it liquid again.' },
  ],
};

export const deliveryNote = 'Free delivery across India · Dispatched in 1–2 days · Cash on Delivery';
