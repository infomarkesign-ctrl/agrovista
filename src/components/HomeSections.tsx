import { useState } from 'react';
import { Sprout, ShieldCheck, FlaskConical, PackageCheck, Truck, Wallet, Check, ChevronDown } from 'lucide-react';
import { whyChooseUs, processSteps, benefits, faqs } from '@/data/content';
import naturalCaneJaggeryImg from '@/img/natural-cane-jaggery.jpeg';
import rawNaturalHoneyImg from '@/img/raw-natural-honey.jpeg';

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Sprout, ShieldCheck, FlaskConical, PackageCheck, Truck, Wallet,
};

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <span className="text-emerald-700 text-xs font-semibold tracking-[0.2em] uppercase">{eyebrow}</span>
      <h2 className="mt-3 text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">{title}</h2>
      {text && <p className="mt-4 text-stone-600">{text}</p>}
    </div>
  );
}

export function WhyChooseUs() {
  return (
    <section id="why-us" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <SectionHeading
        eyebrow="Why Agrovista"
        title="Purity you can taste"
        text="We keep it simple: honest sourcing, traditional methods and careful packing, so what reaches you is as close to nature as possible."
      />
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {whyChooseUs.map((f) => {
          const Icon = icons[f.icon] || Sprout;
          return (
            <div key={f.title} className="bg-white rounded-2xl border border-stone-200 p-6 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Icon className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="mt-4 font-semibold text-stone-900">{f.title}</h3>
              <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">{f.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section id="process" className="bg-amber-50/60 border-y border-amber-100">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <SectionHeading
          eyebrow="How it's made"
          title="From farm and hive to your doorstep"
          text="Every pack goes through five simple, careful steps."
        />
        <ol className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {processSteps.map((s, i) => (
            <li key={s.title} className="relative bg-white rounded-2xl border border-amber-100 p-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold flex items-center justify-center shadow-sm">
                {i + 1}
              </div>
              <h3 className="mt-4 font-semibold text-stone-900">{s.title}</h3>
              <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  const images = [naturalCaneJaggeryImg, rawNaturalHoneyImg];
  return (
    <section id="benefits" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <SectionHeading
        eyebrow="Better sweetness"
        title="Why make the switch?"
        text="Small swaps in your kitchen can make a big difference."
      />
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {benefits.map((b, i) => (
          <div key={b.title} className="bg-white rounded-2xl border border-stone-200 overflow-hidden grid sm:grid-cols-5">
            <img src={images[i]} alt={b.title} className="w-full h-48 sm:h-full object-cover sm:col-span-2" />
            <div className="p-6 sm:col-span-3">
              <h3 className="font-bold text-stone-900 text-lg">{b.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {b.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-stone-600">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-stone-400">
        This information is general and not medical advice. People with diabetes or other health conditions should consult their doctor about sweetener intake.
      </p>
    </section>
  );
}

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-white border-y border-stone-200">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <SectionHeading eyebrow="Got questions?" title="Frequently Asked Questions" />
        <div className="mt-10 divide-y divide-stone-200 border-y border-stone-200">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-semibold text-stone-900">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 text-stone-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-emerald-700' : ''}`} />
                </button>
                {isOpen && <p className="pb-5 -mt-1 text-sm text-stone-600 leading-relaxed">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
