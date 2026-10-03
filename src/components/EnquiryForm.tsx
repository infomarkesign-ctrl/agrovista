import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { postJSON } from '@/lib/auth';

const inputCls = 'w-full px-3 py-2.5 rounded-lg border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm';

export function EnquiryForm() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setSending(true);
    setStatus(null);
    try {
      const { ok, data } = await postJSON('/api/enquiry', Object.fromEntries(fd.entries()));
      if (ok) {
        form.reset();
        setStatus({ ok: true, text: data.message || 'Thank you! We will contact you shortly.' });
      } else {
        setStatus({ ok: false, text: data.error || 'Could not send your enquiry.' });
      }
    } catch {
      setStatus({ ok: false, text: 'Could not send your enquiry. Please check your connection and try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 text-stone-800 shadow-xl">
      <h3 className="font-semibold text-stone-900">Quick Enquiry</h3>
      <p className="text-xs text-stone-500 mt-1 mb-4">Bulk orders, private label or product questions. We reply within 1–2 business days.</p>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="name" required maxLength={100} autoComplete="name" placeholder="Name *" className={inputCls} />
          <input name="email" required type="email" autoComplete="email" placeholder="Email *" className={inputCls} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="phone" type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} autoComplete="tel-national" placeholder="Phone (optional)" className={inputCls} />
          <input name="product" maxLength={200} placeholder="Product (e.g. Palm Jaggery)" className={inputCls} />
        </div>
        <textarea name="message" rows={3} maxLength={3000} placeholder="Your requirement, e.g. quantity, pack size, delivery city" className={`${inputCls} resize-none`} />
        {status && (
          <div className={`flex items-start gap-2 text-sm rounded-lg px-3 py-2.5 border ${status.ok ? 'text-emerald-800 bg-emerald-50 border-emerald-200' : 'text-red-700 bg-red-50 border-red-200'}`}>
            {status.ok ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
            <span>{status.text}</span>
          </div>
        )}
        <button type="submit" disabled={sending} className="w-full py-3 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition disabled:opacity-60 flex items-center justify-center gap-2">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {sending ? 'Sending...' : 'Send Enquiry'}
        </button>
      </form>
    </div>
  );
}
