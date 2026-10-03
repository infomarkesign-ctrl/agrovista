import { useMemo, useState } from 'react';
import {
  Sprout, Leaf, Flower2, Candy,
  Search, Menu, X, ChevronRight, Truck, ShieldCheck, PackageCheck,
  Phone, Mail, MapPin, ArrowUpRight, Quote, ShoppingCart, LogIn, LogOut, User,
} from 'lucide-react';
import { categories, products, services, supportEmail, disputeEmail } from '@/data/catalog';
import type { CatalogItem } from '@/data/catalog';
import { CartProvider, useCart } from '@/lib/cart';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutPage } from '@/components/CheckoutPage';
import { LegalPage } from '@/components/LegalPage';
import { AuthPage } from '@/components/AuthPage';
import { CombosSection } from '@/components/CombosSection';
import { WhyChooseUs, ProcessSection, BenefitsSection, FaqSection } from '@/components/HomeSections';
import { EnquiryForm } from '@/components/EnquiryForm';
import forestHoneyImg from '@/img/forest-honey.jpeg';
import palmJaggeryImg from '@/img/palm-jaggery.jpeg';
import organicCaneJaggeryImg from '@/img/organic-cane-jaggery.jpeg';
import { AuthProvider, useAuth } from '@/lib/auth';
import { legalPages } from '@/data/legal';
import organicHoneyImg from '@/img/raw-natural-honey.jpeg';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sprout, Flower2, Candy,
};

const categoryChip: Record<string, string> = {
  'Jaggery': 'bg-amber-100 text-amber-900 border-amber-200',
  'Natural Honey': 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

const categoryAccent: Record<string, string> = {
  'Jaggery': 'from-amber-600 to-orange-700',
  'Natural Honey': 'from-yellow-400 to-amber-500',
};

type View = 'catalog' | 'checkout' | 'legal' | 'login' | 'signup';

function AppInner() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [view, setView] = useState<View>('catalog');
  const [legalPageId, setLegalPageId] = useState<string>('terms');
  const [afterAuth, setAfterAuth] = useState<View>('catalog');
  const { count } = useCart();
  const { user } = useAuth();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchQ = q === '' || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [activeCategory, query]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => { map[p.category] = (map[p.category] || 0) + 1; });
    return map;
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const goCatalog = () => { setView('catalog'); window.scrollTo({ top: 0 }); };
  const goLegal = (id: string) => { setLegalPageId(id); setView('legal'); window.scrollTo({ top: 0 }); };
  const goLogin = (next: View = 'catalog') => { setAfterAuth(next); setView('login'); setMenuOpen(false); window.scrollTo({ top: 0 }); };
  const goCheckout = () => {
    setCartOpen(false);
    if (!user) { goLogin('checkout'); return; }
    setView('checkout');
    window.scrollTo({ top: 0 });
  };

  if (view === 'login' || view === 'signup') {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header
          onLogo={goCatalog}
          onCart={() => setCartOpen(true)}
          onLogin={() => goLogin()}
          cartCount={count}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          scrollTo={scrollTo}
          showNav={false}
        />
        <AuthPage
          mode={view}
          onModeChange={(m) => setView(m)}
          onSuccess={() => { setView(afterAuth); setAfterAuth('catalog'); window.scrollTo({ top: 0 }); }}
        />
        <Footer setActiveCategory={setActiveCategory} scrollTo={goCatalog} goLegal={goLegal} />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={goCheckout} />
      </div>
    );
  }

  if (view === 'legal') {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header
          onLogo={goCatalog}
          onCart={() => setCartOpen(true)}
          onLogin={() => goLogin()}
          cartCount={count}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          scrollTo={scrollTo}
          showNav={false}
        />
        <LegalPage pageId={legalPageId} onBack={goCatalog} onNavigate={(id) => { setLegalPageId(id); window.scrollTo({ top: 0 }); }} />
        <Footer setActiveCategory={setActiveCategory} scrollTo={goCatalog} goLegal={goLegal} />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={goCheckout} />
      </div>
    );
  }

  if (view === 'checkout') {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header
          onLogo={goCatalog}
          onCart={() => setCartOpen(true)}
          onLogin={() => goLogin()}
          cartCount={count}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          scrollTo={scrollTo}
          showNav={false}
        />
        {user ? (
          <CheckoutPage onBack={goCatalog} />
        ) : (
          <AuthPage mode="login" onModeChange={(m) => { setAfterAuth('checkout'); setView(m); }} onSuccess={() => window.scrollTo({ top: 0 })} />
        )}
        <Footer setActiveCategory={setActiveCategory} scrollTo={goCatalog} goLegal={goLegal} />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={goCheckout} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 antialiased">
      <Header
        onLogo={() => scrollTo('top')}
        onCart={() => setCartOpen(true)}
        onLogin={() => goLogin()}
        cartCount={count}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        scrollTo={scrollTo}
        showNav
      />

      {/* Hero */}
      <section id="top" className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-800 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0, transparent 40%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs font-medium tracking-wide">
              <Leaf className="w-3.5 h-3.5" /> Pure Jaggery & Natural Honey
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Nature's Sweetness,<br />
              <span className="text-emerald-300">Pure &amp; Unrefined</span>
            </h1>
            <p className="mt-6 text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
              Chemical-free cane &amp; palm jaggery and raw natural honey, sourced directly from Indian farmers and beekeepers. Made the traditional way, packed fresh and delivered free to your doorstep anywhere in India.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => scrollTo('products')} className="px-6 py-3 rounded-xl bg-emerald-400 text-emerald-950 font-semibold hover:bg-emerald-300 transition shadow-lg shadow-emerald-900/30">
                Shop Products
              </button>
              <button onClick={() => scrollTo('combos')} className="px-6 py-3 rounded-xl bg-amber-400 text-amber-950 font-semibold hover:bg-amber-300 transition shadow-lg shadow-emerald-900/30">
                Combo Offers
              </button>
              <button onClick={() => scrollTo('contact')} className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition backdrop-blur">
                Bulk Enquiry
              </button>
            </div>
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
              {[
                { n: '100%', l: 'Natural' },
                { n: String(products.length), l: 'Products' },
                { n: 'Free', l: 'Delivery' },
                { n: 'COD', l: 'Available' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl md:text-3xl font-bold text-emerald-300">{s.n}</div>
                  <div className="text-xs text-emerald-200/80 uppercase tracking-wider mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {[
              { img: organicHoneyImg, label: 'Raw Natural Honey', cls: 'row-span-2 h-full' },
              { img: palmJaggeryImg, label: 'Palm Jaggery', cls: 'h-48' },
              { img: forestHoneyImg, label: 'Forest Honey', cls: 'h-48' },
            ].map((t) => (
              <div key={t.label} className={`relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 ${t.cls}`}>
                <img src={t.img} alt={t.label} className="w-full h-full object-cover" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur text-xs font-medium">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      </section>

      {/* Trust strip */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Leaf, t: '100% Natural', d: 'No chemicals, colours or added sugar' },
            { icon: ShieldCheck, t: 'Quality Checked', d: 'Every batch checked before packing' },
            { icon: Truck, t: 'Free Delivery', d: 'Across India in 3–7 business days' },
            { icon: PackageCheck, t: 'Cash on Delivery', d: 'Pay when your order arrives' },
          ].map((f) => (
            <div key={f.t} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <div className="font-semibold text-stone-900 text-sm">{f.t}</div>
                <div className="text-xs text-stone-500">{f.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-emerald-700 text-xs font-semibold tracking-[0.2em] uppercase">What we offer</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">Product Categories</h2>
          <p className="mt-4 text-stone-600">Two natural sweeteners, done right — traditional jaggery and pure, raw honey.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto gap-5">
          {categories.map((c) => {
            const Icon = iconMap[c.icon] || Sprout;
            const accent = categoryAccent[c.name] || 'from-emerald-500 to-green-600';
            return (
              <button
                key={c.name}
                onClick={() => { setActiveCategory(c.name); scrollTo('products'); }}
                className="group text-left bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-stone-300 group-hover:text-emerald-600 group-hover:rotate-45 transition-all" />
                </div>
                <h3 className="mt-4 font-semibold text-stone-900 text-lg">{c.name}</h3>
                <p className="mt-1 text-sm text-stone-500 leading-relaxed">{c.description}</p>
                <div className="mt-4 text-xs font-medium text-stone-400">{counts[c.name] || 0} products</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-emerald-700 text-xs font-semibold tracking-[0.2em] uppercase">Browse the range</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">Product Catalog</h2>
            <p className="mt-4 text-stone-600">Search and filter across our range of jaggery and honey. Click any product to view details and add to cart.</p>
          </div>

          <div className="mt-10 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products or categories..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-stone-800 placeholder:text-stone-400"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <FilterChip label="All" count={products.length} active={activeCategory === 'All'} onClick={() => setActiveCategory('All')} />
            {categories.map((c) => (
              <FilterChip key={c.name} label={c.name} count={counts[c.name] || 0} active={activeCategory === c.name} onClick={() => setActiveCategory(c.name)} />
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between text-sm text-stone-500">
            <span>Showing <span className="font-semibold text-stone-800">{filtered.length}</span> products{activeCategory !== 'All' && <> in <span className="font-semibold text-stone-800">{activeCategory}</span></>}</span>
            {activeCategory !== 'All' && (
              <button onClick={() => setActiveCategory('All')} className="text-emerald-700 hover:text-emerald-800 font-medium">Clear filter</button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-12 text-center py-16 text-stone-400">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No products match your search.</p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p) => {
                const chip = categoryChip[p.category] || 'bg-stone-100 text-stone-700 border-stone-200';
                return (
                  <button
                    key={p.name}
                    onClick={() => setSelected(p)}
                    className="group text-left bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-emerald-300 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-md border ${chip} uppercase tracking-wider`}>
                        {p.category}
                      </span>
                      <h3 className="mt-2.5 font-semibold text-stone-900">{p.name}</h3>
                      <p className="mt-1 text-xs text-stone-500 line-clamp-2">{p.description}</p>
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {p.sizes.map((s) => (
                          <span key={s.label} className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-stone-200 text-stone-500">{s.label}</span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="flex items-baseline font-bold text-stone-900">
                          <span className="text-xs font-normal text-stone-400 mr-1">From</span>
                          <span className="text-base">₹</span>{Math.min(...p.sizes.map((s) => s.price)).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs font-medium text-emerald-700 group-hover:underline">View</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Combos */}
      <CombosSection />

      <ProcessSection />
      <WhyChooseUs />

      {/* Services */}
      <section id="services" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-emerald-700 text-xs font-semibold tracking-[0.2em] uppercase">Beyond products</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">Services We Offer</h2>
          <p className="mt-4 text-stone-600">From farm and hive sourcing to packaging, private branding and delivery across India — your complete jaggery and honey partner.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <div key={s.name} className="group flex items-start gap-4 bg-white rounded-xl border border-stone-200 p-5 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-stone-900 text-[15px]">{s.name}</h3>
                <p className="mt-1 text-sm text-stone-500 leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BenefitsSection />

      {/* About */}
      <section id="about" className="bg-emerald-950 text-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-emerald-300 text-xs font-semibold tracking-[0.2em] uppercase">Who we are</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Sweetness the way nature made it</h2>
            <p className="mt-5 text-emerald-100/80 leading-relaxed">
              AGROVISTA ENTERPRISE is a Maharashtra-based supplier of natural jaggery and pure honey. We started with a simple belief: the sweeteners on Indian tables should be as pure as the ones our grandparents used.
            </p>
            <p className="mt-4 text-emerald-100/80 leading-relaxed">
              Our jaggery is made from chemical-free sugarcane and palm sap using traditional open-pan methods. Our honey comes from trusted beekeepers in forests, farms and the Himalayan foothills, and is never adulterated or overheated. Today we serve households, retailers, sweet shops and wholesalers across India.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
              {[
                'Sourced from farmers & beekeepers',
                'No chemicals, colours or sugar syrup',
                'Delivery across India',
                'Private label & OEM support',
              ].map((p) => (
                <div key={p} className="flex items-start gap-2 text-sm text-emerald-100/90">
                  <ShieldCheck className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                  {p}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img src={organicCaneJaggeryImg} alt="Organic cane jaggery" className="w-full h-80 object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white text-stone-800 rounded-xl shadow-xl p-5 max-w-[220px] hidden sm:block">
              <Quote className="w-5 h-5 text-emerald-600 mb-2" />
              <p className="text-sm font-medium leading-snug">Pure from the farm and the hive, straight to you.</p>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />

      {/* Contact / CTA */}
      <section id="contact" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-green-800 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 90% 10%, white 0, transparent 40%)' }} />
          <div className="relative px-6 md:px-12 py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Get in touch</h2>
              <p className="mt-4 text-emerald-100/90 leading-relaxed max-w-md">
                Questions about an order, bulk pricing or private labelling? Send us an enquiry or reach us directly. We usually reply within 1–2 business days.
              </p>
              <div className="mt-8 space-y-3 text-sm">
                <a href={`mailto:${supportEmail}`} className="flex items-center gap-3 hover:text-emerald-200 transition">
                  <Mail className="w-4 h-4" /> <span><span className="text-emerald-200/80">Support:</span> {supportEmail}</span>
                </a>
                <a href={`mailto:${disputeEmail}`} className="flex items-center gap-3 hover:text-emerald-200 transition">
                  <Mail className="w-4 h-4" /> <span><span className="text-emerald-200/80">Disputes &amp; complaints:</span> {disputeEmail}</span>
                </a>
                <a href="tel:+917304210746" className="flex items-center gap-3 hover:text-emerald-200 transition">
                  <Phone className="w-4 h-4" /> +91 73042 10746
                </a>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Chakreshwar Mandir, Near Chaudhari Niwas, Umrale, Nallasopara West, Palghar, Maharashtra – 401203, India</span>
                </div>
              </div>
            </div>
            <EnquiryForm />
          </div>
        </div>
      </section>

      <Footer setActiveCategory={setActiveCategory} scrollTo={scrollTo} goLegal={goLegal} />

      {/* Floating cart button (mobile) */}
      <button
        onClick={() => setCartOpen(true)}
        className="md:hidden fixed bottom-5 right-5 z-30 w-14 h-14 rounded-full bg-emerald-700 text-white shadow-xl flex items-center justify-center"
      >
        <ShoppingCart className="w-6 h-6" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
            {count}
          </span>
        )}
      </button>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={goCheckout}
      />
    </div>
  );
}

function Header({
  onLogo, onCart, onLogin, cartCount, menuOpen, setMenuOpen, scrollTo, showNav,
}: {
  onLogo: () => void;
  onCart: () => void;
  onLogin: () => void;
  cartCount: number;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  scrollTo: (id: string) => void;
  showNav: boolean;
}) {
  const { user, logout } = useAuth();
  const displayName = user ? (user.fullName.split(' ')[0] || user.email || user.phoneNumber) : null;
  return (
    <>
      <div className="bg-emerald-900 text-emerald-50 text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5" /> Pure jaggery & natural honey — delivered across India
          </span>
          <div className="hidden sm:flex items-center gap-4">
            <a href={`mailto:${supportEmail}`} className="flex items-center gap-1.5 hover:text-white"><Mail className="w-3.5 h-3.5" /> {supportEmail}</a>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> +91 73042 10746</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={onLogo} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center shadow-sm">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div className="text-left leading-tight">
              <div className="font-bold tracking-tight text-stone-900 text-[15px]">AGROVISTA</div>
              <div className="text-[10px] font-medium text-emerald-700 tracking-[0.2em] uppercase">Enterprise</div>
            </div>
          </button>

          {showNav && (
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
              <button onClick={() => scrollTo('categories')} className="hover:text-emerald-700 transition">Categories</button>
              <button onClick={() => scrollTo('products')} className="hover:text-emerald-700 transition">Products</button>
              <button onClick={() => scrollTo('combos')} className="hover:text-emerald-700 transition">Combos</button>
              <button onClick={() => scrollTo('services')} className="hover:text-emerald-700 transition">Services</button>
              <button onClick={() => scrollTo('about')} className="hover:text-emerald-700 transition">About</button>
              <button onClick={() => scrollTo('faq')} className="hover:text-emerald-700 transition">FAQ</button>
              <button onClick={() => scrollTo('contact')} className="ml-2 px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition shadow-sm">Get Quote</button>
            </nav>
          )}

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center">
                <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-stone-700">
                  <User className="w-4 h-4 text-emerald-700" /> Hi, {displayName}
                </span>
                <button onClick={logout} title="Log out" className="p-2.5 rounded-lg hover:bg-stone-100 transition text-stone-500 hover:text-stone-800">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={onLogin} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 transition">
                <LogIn className="w-4 h-4" /> <span className="hidden sm:inline">Log in</span>
              </button>
            )}
            <button onClick={onCart} className="relative p-2.5 rounded-lg hover:bg-stone-100 transition text-stone-700">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            {showNav && (
              <button className="lg:hidden p-2 -mr-2 text-stone-700" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
        {showNav && menuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-1 text-sm font-medium text-stone-700">
            <button onClick={() => scrollTo('categories')} className="block w-full text-left py-2">Categories</button>
            <button onClick={() => scrollTo('products')} className="block w-full text-left py-2">Products</button>
            <button onClick={() => scrollTo('combos')} className="block w-full text-left py-2">Combos</button>
            <button onClick={() => scrollTo('services')} className="block w-full text-left py-2">Services</button>
            <button onClick={() => scrollTo('about')} className="block w-full text-left py-2">About</button>
            <button onClick={() => scrollTo('faq')} className="block w-full text-left py-2">FAQ</button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-left py-2 text-emerald-700 font-semibold">Get Quote</button>
          </div>
        )}
      </header>
    </>
  );
}

function Footer({
  setActiveCategory, scrollTo, goLegal,
}: {
  setActiveCategory: (c: string) => void;
  scrollTo: (id: string) => void;
  goLegal: (id: string) => void;
}) {
  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">AGROVISTA</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-emerald-500">Enterprise</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed">Natural cane &amp; palm jaggery and pure, raw honey, sourced from Indian farmers and beekeepers and delivered across India.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Products</h4>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.name}><button onClick={() => { setActiveCategory(c.name); scrollTo('products'); }} className="hover:text-emerald-400 transition">{c.name}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => scrollTo('about')} className="hover:text-emerald-400 transition">About Us</button></li>
            <li><button onClick={() => scrollTo('services')} className="hover:text-emerald-400 transition">Services</button></li>
            <li><button onClick={() => scrollTo('products')} className="hover:text-emerald-400 transition">Catalog</button></li>
            <li><button onClick={() => scrollTo('combos')} className="hover:text-emerald-400 transition">Combo Offers</button></li>
            <li><button onClick={() => scrollTo('faq')} className="hover:text-emerald-400 transition">FAQ</button></li>
            <li><button onClick={() => scrollTo('contact')} className="hover:text-emerald-400 transition">Bulk Enquiry</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            {legalPages.map((p) => (
              <li key={p.id}><button onClick={() => goLegal(p.id)} className="hover:text-emerald-400 transition">{p.title}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li><a href={`mailto:${supportEmail}`} className="flex items-center gap-2 hover:text-emerald-400 transition"><Mail className="w-4 h-4 shrink-0" /> <span>Support: {supportEmail}</span></a></li>
            <li><a href={`mailto:${disputeEmail}`} className="flex items-center gap-2 hover:text-emerald-400 transition"><Mail className="w-4 h-4 shrink-0" /> <span>Disputes: {disputeEmail}</span></a></li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 73042 10746</li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> Chakreshwar Mandir, Near Chaudhari Niwas, Umrale, Nallasopara West, Palghar, Maharashtra – 401203, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 py-5 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} AGROVISTA ENTERPRISE. All rights reserved.</span>
          <span>Jaggery · Palm Jaggery · Raw Honey · Forest Honey · Made in India</span>
        </div>
      </div>
    </footer>
  );
}

function FilterChip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
        active
          ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
          : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300 hover:text-emerald-700'
      }`}
    >
      {label} <span className={`ml-1 ${active ? 'text-emerald-200' : 'text-stone-400'}`}>({count})</span>
    </button>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  );
}
