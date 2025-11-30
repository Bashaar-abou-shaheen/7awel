import { notFound } from 'next/navigation';
import { getPromotionById } from '@/lib/api';
import { Promotion } from '@/types/promotion';
import { PromotionDetailActions } from '@/components/PromotionDetailActions';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PromotionDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let promo: Promotion;
  try {
    promo = await getPromotionById(id);
  } catch (e) {
    console.error('Error fetching promotion:', e);
    return notFound();
  }

  const isExpired = promo.expiresAt && new Date(promo.expiresAt) < new Date();

  return (
    <div className="min-h-screen text-gray-900 flex">
      <main className="flex-1 p-6 max-w-4xl mx-auto">
        <div className="mb-4 text-xs">
          <a
            href="/promotions"
            className="text-gray-500 hover:text-gray-700 underline underline-offset-2"
          >
            ← Back to promotions
          </a>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-7 shadow-md flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">{promo.title}</h1>
                <p className="text-sm text-gray-500">{promo.merchant}</p>
              </div>

              <PromotionDetailActions promo={promo} />
            </div>

            <div className="flex flex-wrap gap-2 text-[12px]">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600/20 text-blue-800 border border-blue-300 font-medium">
                Reward: {promo.rewardAmount} {promo.rewardCurrency}
              </span>
              <span
                className={
                  'inline-flex items-center px-3 py-1 rounded-full border font-medium ' +
                  (isExpired
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : 'bg-green-100 text-green-800 border-green-300')
                }
              >
                {isExpired
                  ? 'Expired'
                  : promo.daysUntilExpiry != null
                    ? `${promo.daysUntilExpiry} days left`
                    : 'No expiry date'}
              </span>
            </div>

            <section className="mt-3 space-y-1">
              <h2 className="text-sm font-semibold text-gray-700">Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{promo.description}</p>
            </section>

            <section className="mt-3 space-y-1">
              <h2 className="text-sm font-semibold text-gray-700">Terms & Conditions</h2>
              <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">{promo.terms}</p>
            </section>

            <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-gray-500">
              <div>
                <div className="font-semibold text-gray-600 mb-1">Created At</div>
                <div>{new Date(promo.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-600 mb-1">Expires At</div>
                <div>{promo.expiresAt ? new Date(promo.expiresAt).toLocaleString() : '—'}</div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
