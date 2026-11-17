/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight } from 'lucide-react';
import { HERO_METRICS, IMAGES } from './data/sdg2Data';
import { TopNav } from './components/TopNav';
import { ResilientImage } from './components/ResilientImage';
import { FoodSystemSimulator } from './components/FoodSystemSimulator';
import { SdgTargetsSection } from './components/SdgTargetsSection';
import { InnovationLab } from './components/InnovationLab';
import { QuizSection } from './components/QuizSection';

export default function App() {
  const scrollToSimulator = () => {
    const el = document.getElementById('simulasi');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="beranda" className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopNav onStartSimulation={scrollToSimulator} />

      <main className="flex-1">
        {/* Hero Section: Balanced 2-Column Split with items-stretch */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center py-2">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-4">
                  <span className="text-emerald-700 font-semibold">SDG 2: Zero Hunger</span>
                  <span aria-hidden="true">·</span>
                  <span>Laboratorium Pembelajaran Pelajar SMA Kelas XI</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.12] text-balance">
                  Merancang Ketahanan Pangan dari Sekolah untuk Masa Depan
                </h1>

                <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  Pelajari mengapa kelaparan bukan sekadar kekurangan beras—melainkan persoalan distribusi, susut pascapanen, gizi seimbang, dan keberlanjutan ekologis. Uji skenario secara langsung dan susun proyek inovasi nyatamu.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={scrollToSimulator}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                  >
                    <span>Jelajahi Simulasi Sistem Pangan</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <a
                    href="#inovasi"
                    className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    Rancang Aksi Sekolah
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6 relative min-h-[300px] sm:min-h-[380px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <ResilientImage
                  src={IMAGES.hero}
                  alt="Siswa SMA Indonesia merawat tanaman sayuran hidroponik di rumah kaca sekolah dengan cahaya pagi yang cerah"
                  fallbackTitle="Inovasi Pertanian Hidroponik Siswa SMA"
                  className="w-full h-full object-cover lg:absolute lg:inset-0"
                />
              </div>
            </div>

            {/* Full-Width 4-Column Quantitative Strip below Hero Split */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-xl border border-slate-200 bg-slate-50 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
              {HERO_METRICS.map((item) => (
                <div key={item.label} className="p-5 sm:p-6">
                  <div className="text-xs font-medium text-emerald-700 mb-1">
                    {item.context}
                  </div>
                  <div className="font-mono-tabular text-2xl sm:text-3xl font-semibold text-slate-900">
                    {item.value}
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-snug">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FoodSystemSimulator />
        <SdgTargetsSection />
        <InnovationLab />
        <QuizSection />
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-800">NusaPangan</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Media Edukasi Interaktif SDG 2: Tanpa Kelaparan untuk Pelajar SMA Kelas XI</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#simulasi" className="hover:text-slate-900 transition-colors">
              Simulasi
            </a>
            <a href="#pilar" className="hover:text-slate-900 transition-colors">
              Target SDG 2
            </a>
            <a href="#inovasi" className="hover:text-slate-900 transition-colors">
              Aksi Sekolah
            </a>
            <a href="#kuis" className="hover:text-slate-900 transition-colors">
              Evaluasi
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
