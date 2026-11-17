import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { SDG_TARGETS } from '../data/sdg2Data';
import { ResilientImage } from './ResilientImage';

export function SdgTargetsSection() {
  const [selectedId, setSelectedId] = useState<string>(SDG_TARGETS[0].id);
  const activeTarget = SDG_TARGETS.find((t) => t.id === selectedId) ?? SDG_TARGETS[0];

  return (
    <section id="pilar" className="py-16 lg:py-20 border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-emerald-700 mb-2">
              02. Kerangka Empat Target SDG 2
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight text-balance">
              Memahami Pilar Tanpa Kelaparan dan Konteks Indonesia
            </h2>
          </div>

          {/* Interactive segmented filter tabs */}
          <div
            role="tablist"
            aria-label="Pilih Target SDG 2"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/80 rounded-lg self-start lg:self-auto"
          >
            {SDG_TARGETS.map((target) => {
              const isSelected = target.id === activeTarget.id;
              return (
                <button
                  key={target.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedId(target.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-700 ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {target.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Single-elevation balanced split panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="lg:col-span-5 relative min-h-[280px] bg-slate-100">
            <ResilientImage
              src={activeTarget.imageSrc}
              alt={activeTarget.imageAlt}
              fallbackTitle={activeTarget.shortLabel}
              className="w-full h-full object-cover lg:absolute lg:inset-0"
            />
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-3">
                <span className="text-emerald-700 font-semibold">{activeTarget.code}</span>
                <span aria-hidden="true">·</span>
                <span>{activeTarget.keyMetricLabel}:</span>
                <span className="font-mono-tabular text-slate-900 font-semibold">
                  {activeTarget.keyMetricValue}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight text-balance">
                {activeTarget.title}
              </h3>

              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                {activeTarget.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">
                  Realitas di Indonesia
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {activeTarget.indonesiaContext}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-emerald-800 mb-2">
                  Peluang Inovasi Siswa Kelas XI
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {activeTarget.schoolInnovation}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#inovasi"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <span>Rancang proyek sekolah berdasarkan target ini</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
