import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Check, Copy, Download, Plus, Trash2 } from 'lucide-react';
import { SCHOOL_INITIATIVES } from '../data/sdg2Data';

interface CustomIdea {
  id: string;
  title: string;
  targetCode: string;
  actionPlan: string;
}

const STORAGE_KEY_IDEAS = 'nusapangan_class11_ideas_v1';

const DEFAULT_IDEAS: CustomIdea[] = [
  {
    id: 'idea-sample-1',
    title: 'Kulkas Berbagi & Pemantau Suhu Kantin',
    targetCode: 'Target 2.1',
    actionPlan:
      'Menyediakan lemari pendingin kecil berlabel tanggal kedaluwarsa untuk menyalurkan roti dan lauk bersih sisa acara OSIS kepada petugas kebersihan dan warga sekitar.',
  },
];

export function InnovationLab() {
  const [studentCount, setStudentCount] = useState<number>(360);
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'hydroponics',
    'plate-zero-waste',
    'local-grain',
  ]);

  const [ideas, setIdeas] = useState<CustomIdea[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_IDEAS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage read errors
    }
    return DEFAULT_IDEAS;
  });

  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('Target 2.1');
  const [newPlan, setNewPlan] = useState('');
  const [formError, setFormError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_IDEAS, JSON.stringify(ideas));
    } catch {
      // ignore storage write errors
    }
  }, [ideas]);

  const toggleInitiative = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const impact = useMemo(() => {
    const active = SCHOOL_INITIATIVES.filter((item) => selectedIds.includes(item.id));
    const foodSavedKg = Math.round(
      active.reduce((sum, item) => sum + item.foodSavedKgPerStudentSemester * studentCount, 0)
    );
    const compostKg = Math.round(
      active.reduce((sum, item) => sum + item.compostKgPerStudentSemester * studentCount, 0)
    );
    const mealsEquivalent = Math.round(
      active.reduce((sum, item) => sum + item.nutritionMealsPerStudentSemester * studentCount, 0)
    );
    // Rata-rata 1 kg limbah pangan yang dicegah menghemat ~2.5 kg CO2e
    const co2PreventedKg = Math.round(foodSavedKg * 2.5);

    return {
      activeCount: active.length,
      foodSavedKg,
      compostKg,
      mealsEquivalent,
      co2PreventedKg,
    };
  }, [selectedIds, studentCount]);

  const handleAddIdea = (e: FormEvent) => {
    e.preventDefault();
    const cleanTitle = newTitle.trim();
    const cleanPlan = newPlan.trim();
    if (cleanTitle.length < 4 || cleanPlan.length < 10) {
      setFormError('Lengkapi judul inovasi (min. 4 karakter) dan langkah aksi (min. 10 karakter).');
      return;
    }
    setFormError('');
    const created: CustomIdea = {
      id: `idea-${Date.now()}`,
      title: cleanTitle,
      targetCode: newTarget,
      actionPlan: cleanPlan,
    };
    setIdeas((prev) => [created, ...prev]);
    setNewTitle('');
    setNewPlan('');
  };

  const handleRemoveIdea = (id: string) => {
    setIdeas((prev) => prev.filter((item) => item.id !== id));
  };

  const buildSummaryText = () => {
    const selectedPrograms = SCHOOL_INITIATIVES.filter((i) => selectedIds.includes(i.id))
      .map((i) => `- ${i.title} (${i.targetCode})`)
      .join('\n');

    const customList = ideas
      .map((idea, index) => `${index + 1}. ${idea.title} [${idea.targetCode}]\n   ${idea.actionPlan}`)
      .join('\n');

    return [
      'RANCANGAN AKSI INOVASI SDG 2: ZERO HUNGER (KELAS XI)',
      '====================================================',
      `Skala Partisipasi: ${studentCount} siswa per semester`,
      '',
      'Program Sekolah Dipilih:',
      selectedPrograms || '- Belum ada program dipilih',
      '',
      'Estimasi Dampak Terukur (1 Semester):',
      `- Pangan diselamatkan: ${impact.foodSavedKg.toLocaleString('id-ID')} kg`,
      `- Setara porsi bergizi: ${impact.mealsEquivalent.toLocaleString('id-ID')} porsi`,
      `- Pupuk kompos dihasilkan: ${impact.compostKg.toLocaleString('id-ID')} kg`,
      `- Emisi karbon tercegah: ${impact.co2PreventedKg.toLocaleString('id-ID')} kg CO2e`,
      '',
      'Ide Inovasi Siswa:',
      customList || '- Belum ada ide tambahan',
    ].join('\n');
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildSummaryText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback ignored gracefully
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([buildSummaryText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rencana-inovasi-sdg2-kelas-xi.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="inovasi" className="py-16 lg:py-20 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <p className="text-sm font-medium text-emerald-700 mb-2">
            03. Laboratorium Aksi & Dampak Sekolah
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight text-balance">
            Rancang Proyek Nyata SDG 2 di Lingkungan Sekolahmu
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Hitung dampak terukur program pangan sekolah selama satu semester, lalu catat ide inovasimu sendiri untuk dipresentasikan di kelas atau program OSIS.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: School Initiative Selector & Calculator */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <label htmlFor="student-scale" className="text-sm font-semibold text-slate-900">
                  Jumlah Siswa & Warga Sekolah Terlibat
                </label>
                <span className="font-mono-tabular text-base font-semibold text-emerald-800">
                  {studentCount.toLocaleString('id-ID')} siswa
                </span>
              </div>
              <input
                id="student-scale"
                type="range"
                min={50}
                max={1200}
                step={10}
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
                className="sdg-slider w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1.5 font-mono-tabular">
                <span>50 siswa (1–2 kelas)</span>
                <span>600 siswa</span>
                <span>1.200 siswa (1 sekolah)</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Pilih Paket Aksi Sekolah ({impact.activeCount} dipilih)
              </h3>

              <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white overflow-hidden">
                {SCHOOL_INITIATIVES.map((item) => {
                  const checked = selectedIds.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className={`flex items-start gap-4 p-4 sm:p-5 cursor-pointer transition-colors ${
                        checked ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleInitiative(item.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                          <span className="font-semibold text-emerald-700">{item.targetCode}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-tabular">
                            +{item.nutritionMealsPerStudentSemester} porsi/siswa
                          </span>
                        </div>
                        <div className="text-base font-semibold text-slate-900">
                          {item.title}
                        </div>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Calculated Impact Summary Grid (Flat single-elevation) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 rounded-xl border border-slate-200 bg-slate-50 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
              <div className="p-4 sm:p-5">
                <div className="text-xs text-slate-500">Pangan Terselamatkan</div>
                <div className="font-mono-tabular text-xl sm:text-2xl font-semibold text-slate-900 mt-1">
                  {impact.foodSavedKg.toLocaleString('id-ID')}
                  <span className="text-xs font-normal text-slate-500 ml-1">kg</span>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <div className="text-xs text-slate-500">Setara Porsi Bergizi</div>
                <div className="font-mono-tabular text-xl sm:text-2xl font-semibold text-emerald-700 mt-1">
                  {impact.mealsEquivalent.toLocaleString('id-ID')}
                  <span className="text-xs font-normal text-slate-500 ml-1">porsi</span>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <div className="text-xs text-slate-500">Pupuk Kompos</div>
                <div className="font-mono-tabular text-xl sm:text-2xl font-semibold text-slate-900 mt-1">
                  {impact.compostKg.toLocaleString('id-ID')}
                  <span className="text-xs font-normal text-slate-500 ml-1">kg</span>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <div className="text-xs text-slate-500">Emisi Dicegah</div>
                <div className="font-mono-tabular text-xl sm:text-2xl font-semibold text-slate-900 mt-1">
                  {impact.co2PreventedKg.toLocaleString('id-ID')}
                  <span className="text-xs font-normal text-slate-500 ml-1">kg CO₂e</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Student Innovation Notebook & Export */}
          <div className="lg:col-span-5 space-y-6 rounded-xl border border-slate-200 bg-slate-50 p-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Catatan Ide Inovasi Kelas XI
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Tambahkan gagasan orisinal kelompokmu lalu unduh ringkasan proyeknya untuk presentasi.
              </p>
            </div>

            <form onSubmit={handleAddIdea} className="space-y-4">
              <div>
                <label htmlFor="idea-title" className="block text-xs font-medium text-slate-700 mb-1">
                  Judul Inovasi
                </label>
                <input
                  id="idea-title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Aplikasi Jadwal Panen Hidroponik Kelas"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label htmlFor="idea-target" className="block text-xs font-medium text-slate-700 mb-1">
                  Keterkaitan Target SDG 2
                </label>
                <select
                  id="idea-target"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="Target 2.1">Target 2.1 · Akses Pangan & Bank Makanan</option>
                  <option value="Target 2.2">Target 2.2 · Gizi Seimbang & Cegah Stunting</option>
                  <option value="Target 2.3">Target 2.3 · Pemberdayaan Petani Lokal</option>
                  <option value="Target 2.4">Target 2.4 · Pertanian Berkelanjutan</option>
                </select>
              </div>

              <div>
                <label htmlFor="idea-plan" className="block text-xs font-medium text-slate-700 mb-1">
                  Langkah Pelaksanaan Singkat
                </label>
                <textarea
                  id="idea-plan"
                  rows={3}
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value)}
                  placeholder="Jelaskan cara kerja, pihak yang terlibat di sekolah, dan manfaat utamanya..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              {formError && (
                <p role="alert" className="text-xs font-medium text-red-700">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Simpan Ide ke Rencana</span>
              </button>
            </form>

            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-700">
                  Daftar Gagasan Tersimpan ({ideas.length})
                </h4>
              </div>

              {ideas.length === 0 ? (
                <p className="text-xs text-slate-500 py-3">
                  Belum ada gagasan tersimpan. Gunakan formulir di atas untuk menambahkan ide proyekmu.
                </p>
              ) : (
                <ul className="divide-y divide-slate-200 border-y border-slate-200 bg-white rounded-lg overflow-hidden">
                  {ideas.map((idea) => (
                    <li key={idea.id} className="p-3.5 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-emerald-700 mb-0.5">
                          {idea.targetCode}
                        </div>
                        <div className="text-sm font-semibold text-slate-900">
                          {idea.title}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {idea.actionPlan}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveIdea(idea.id)}
                        aria-label={`Hapus ide ${idea.title}`}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                      <span>Ringkasan Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Salin Ringkasan</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Unduh Rencana (.txt)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
