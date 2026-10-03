import { ArrowLeft, FileText } from 'lucide-react';
import { legalPages } from '@/data/legal';

export function LegalPage({
  pageId,
  onBack,
  onNavigate,
}: {
  pageId: string;
  onBack: () => void;
  onNavigate: (id: string) => void;
}) {
  const page = legalPages.find((p) => p.id === pageId) ?? legalPages[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <button onClick={onBack} className="flex items-center gap-2 text-stone-600 hover:text-emerald-700 transition mb-6 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-stone-200 p-4 lg:sticky lg:top-24">
            <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-2 mb-2">Legal</h2>
            <nav className="space-y-1">
              {legalPages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onNavigate(p.id)}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    p.id === page.id
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  {p.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-10">
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">{page.title}</h1>
            <p className="mt-2 text-xs text-stone-400 uppercase tracking-wider">Last updated: {page.updated}</p>
            <p className="mt-5 text-stone-600 leading-relaxed">{page.intro}</p>

            <div className="mt-8 space-y-7">
              {page.sections.map((s) => (
                <div key={s.heading}>
                  <h2 className="font-semibold text-stone-900">{s.heading}</h2>
                  <div className="mt-2 space-y-2">
                    {s.body.map((p, i) => (
                      <p key={i} className="text-sm text-stone-600 leading-relaxed">{p}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
