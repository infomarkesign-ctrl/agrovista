export type LegalSection = {
  heading: string;
  body: string[];
};

export type LegalPageContent = {
  id: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export const legalPages: LegalPageContent[] = [
  {
    id: 'terms',
    title: 'Terms & Conditions',
    updated: 'July 26, 2026',
    intro:
      'These Terms & Conditions govern your use of the AGROVISTA ENTERPRISE website and your purchase of products or services from us. By placing an order or browsing our catalog, you agree to these terms.',
    sections: [
      {
        heading: '1. About Us',
        body: [
          'AGROVISTA ENTERPRISE ("we", "us", "our") is a supplier of natural jaggery (cane and palm) and pure natural honey based in India.',
        ],
      },
      {
        heading: '2. Orders & Acceptance',
        body: [
          'All orders placed through this website are offers to purchase, subject to acceptance and confirmation by our team.',
          'We reserve the right to refuse or cancel any order due to product unavailability, pricing errors, quality-control concerns, or suspected fraudulent activity.',
        ],
      },
      {
        heading: '3. Product Information & Pricing',
        body: [
          'We make every effort to display accurate descriptions, images and prices. Natural produce may vary slightly in appearance, weight and colour from the images shown.',
          'Prices listed are per unit (kg/litre) in INR and are subject to change without prior notice. GST and other applicable taxes are added at checkout.',
        ],
      },
      {
        heading: '4. Bulk Orders',
        body: [
          'Bulk sourcing, private-label and OEM orders are handled on a case-by-case basis with separate commercial terms, quality certifications and documentation as agreed with the buyer.',
        ],
      },
      {
        heading: '5. Limitation of Liability',
        body: [
          'AGROVISTA ENTERPRISE shall not be liable for indirect, incidental or consequential losses arising from the use of our products or website, except as required by applicable law.',
        ],
      },
      {
        heading: '6. Governing Law',
        body: [
          'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts having authority over our registered place of business.',
        ],
      },
      {
        heading: '7. Contact',
        body: [
          'For questions about these Terms & Conditions, contact us at support@agrovista.shop or +91 73042 10746.',
          'For disputes or complaints about an order, write to dispute@agrovista.shop with your order ID and details of the issue. We aim to respond within 2 business days.',
        ],
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    updated: 'July 26, 2026',
    intro:
      'This Privacy Policy explains how AGROVISTA ENTERPRISE collects, uses and protects the personal information you share with us when using this website or placing an order.',
    sections: [
      {
        heading: '1. Information We Collect',
        body: [
          'Contact details such as name, email address, phone number and shipping address, provided when placing an order or submitting an enquiry.',
          'Order details, including products purchased, quantities and delivery preferences.',
          'Basic technical data such as browser type and pages visited, used to improve website performance.',
        ],
      },
      {
        heading: '2. How We Use Your Information',
        body: [
          'To process and fulfil orders, arrange delivery, and communicate order status.',
          'To respond to enquiries about products or bulk sourcing.',
          'To improve our catalog, services and website experience.',
          'We do not sell or rent your personal information to third parties.',
        ],
      },
      {
        heading: '3. Data Sharing',
        body: [
          'We may share necessary order information with logistics partners, payment processors and regulatory authorities strictly for the purpose of fulfilling and documenting your order.',
        ],
      },
      {
        heading: '4. Data Security',
        body: [
          'We use reasonable technical and organizational measures to protect your data. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.',
        ],
      },
      {
        heading: '5. Your Rights',
        body: [
          'You may request access to, correction of, or deletion of your personal data by contacting us at support@agrovista.shop.',
        ],
      },
      {
        heading: '6. Cookies',
        body: [
          'Our website may use basic cookies to remember cart contents and preferences during your session. No third-party advertising cookies are used.',
        ],
      },
    ],
  },
  {
    id: 'refund',
    title: 'Refund Policy',
    updated: 'July 26, 2026',
    intro:
      'We want you to be satisfied with your purchase. This Refund Policy explains when and how refunds are issued for orders placed with AGROVISTA ENTERPRISE.',
    sections: [
      {
        heading: '1. Eligibility for Refund',
        body: [
          'Refunds are considered for products that arrive damaged, spoiled, significantly different from the description, or short in quantity versus the invoice.',
          'A refund request must be raised within 48 hours of delivery, along with photographic evidence and the order ID.',
        ],
      },
      {
        heading: '2. Non-Refundable Situations',
        body: [
          'Natural variation in colour, size or moisture content typical of agricultural produce is not grounds for a refund.',
          'Refunds are not issued for change of mind once perishable or bulk goods have been dispatched.',
        ],
      },
      {
        heading: '3. Refund Process',
        body: [
          'Once a claim is verified by our quality team, approved refunds are processed to the original payment method or bank account within 7–10 business days.',
          'For cash-on-delivery or bank-transfer orders, refunds are issued via bank transfer to the details provided by the customer.',
        ],
      },
      {
        heading: '4. Partial Refunds',
        body: [
          'If only part of an order is affected, a partial refund proportionate to the affected items will be issued.',
        ],
      },
      {
        heading: '5. Contact for Refunds',
        body: [
          'To raise a refund request, email support@agrovista.shop with your order ID or call +91 73042 10746.',
          'If you are not satisfied with how your refund request was handled, you can raise a dispute at dispute@agrovista.shop.',
        ],
      },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping Policy',
    updated: 'July 26, 2026',
    intro:
      'This Shipping Policy outlines how AGROVISTA ENTERPRISE processes, packs and delivers orders within India.',
    sections: [
      {
        heading: '1. Order Processing',
        body: [
          'Orders are processed within 1–2 business days of confirmation. Bulk orders may require additional processing time for quality checks and packaging.',
        ],
      },
      {
        heading: '2. Domestic Delivery',
        body: [
          'Standard domestic delivery typically takes 3–7 business days depending on the destination.',
          'Standard shipping within India is free on all orders.',
          'We currently deliver only within India and do not accept international orders.',
        ],
      },
      {
        heading: '3. Packaging',
        body: [
          'Products are packed in food-grade, moisture-resistant packaging suited for the product type, with custom and private-label packaging available on request.',
        ],
      },
      {
        heading: '4. Tracking & Delays',
        body: [
          'Tracking details are shared once an order is dispatched. Delivery timelines are estimates and may be affected by weather or logistics disruptions beyond our control.',
        ],
      },
      {
        heading: '5. Contact',
        body: [
          'For shipping queries, contact support@agrovista.shop or +91 73042 10746.',
        ],
      },
    ],
  },
  {
    id: 'cancellation',
    title: 'Cancellation Policy',
    updated: 'July 26, 2026',
    intro:
      'This Cancellation Policy describes how you can cancel an order placed with AGROVISTA ENTERPRISE and what to expect once a cancellation is requested.',
    sections: [
      {
        heading: '1. Cancellation Window',
        body: [
          'Orders can be cancelled free of charge within 12 hours of placement or before the order has been dispatched, whichever is earlier.',
        ],
      },
      {
        heading: '2. After Dispatch',
        body: [
          'Once an order has been dispatched, it cannot be cancelled. You may instead refer to our Refund Policy if the delivered goods are damaged or incorrect.',
        ],
      },
      {
        heading: '3. Bulk Orders',
        body: [
          'Cancellations for bulk or private-label orders are subject to the specific commercial terms agreed at the time of order confirmation, as such orders often involve upfront processing or packaging costs.',
        ],
      },
      {
        heading: '4. How to Cancel',
        body: [
          'To cancel an order, email support@agrovista.shop or call +91 73042 10746 with your order ID as soon as possible.',
        ],
      },
      {
        heading: '5. Refund of Cancelled Orders',
        body: [
          'Where payment was already made for a successfully cancelled order, the amount will be refunded per our Refund Policy within 7–10 business days.',
        ],
      },
    ],
  },
];
