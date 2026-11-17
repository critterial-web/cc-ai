import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
  StepForward,
  XCircle,
} from 'lucide-react';
import { SCENARIO_PRESETS, type SimulatorParams } from '../data/sdg2Data';

interface SimulationMetrics {
  harvestIndex: number;
  postHarvestLossPct: number;
  wasteReductionPct: number;
  nutritionAdequacyPct: number;
  resilienceScore: number;
  mealsSavedMonthly: number;
  statusLevel: 'stabil' | 'waspada' | 'kritis';
  statusLabel: string;
  bottleneckNote: string;
  monthlySeries: { month: number; nutrition: number; lossAndWaste: number }[];
}

function computeSimulation(params: SimulatorParams): SimulationMetrics {
  const { irrigation, coldStorage, foodRescue, nutritionDiversity } = params;

  // Produksi dipengaruhi kuat oleh irigasi berkelanjutan dan keragaman komoditas adaptif iklim
  const harvestIndex = Math.round(
    Math.min(100, 22 + irrigation * 0.62 + nutritionDiversity * 0.22)
  );

  // Susut pascapanen (Food Loss) turun drastis bila rantai dingin & penyimpanan baik
  const postHarvestLossPct = Math.max(
    4,
    Math.round(36 - coldStorage * 0.31)
  );

  // Penyelamatan surplus (Food Rescue) mengurangi Food Waste
  const wasteReductionPct = Math.round(15 + foodRescue * 0.8);

  // Kecukupan gizi seimbang membutuhkan pasokan bersih dan diversifikasi protein/mikronutrien
  const supplyFactor = (harvestIndex * (100 - postHarvestLossPct)) / 100;
  const nutritionAdequacyPct = Math.min(
    100,
    Math.round(supplyFactor * 0.45 + nutritionDiversity * 0.42 + foodRescue * 0.16)
  );

  const resilienceScore = Math.min(
    100,
    Math.round(
      harvestIndex * 0.26 +
        (100 - postHarvestLossPct) * 0.22 +
        wasteReductionPct * 0.22 +
        nutritionAdequacyPct * 0.3
    )
  );

  const mealsSavedMonthly = Math.round(
    (foodRescue * 18 + coldStorage * 11) * (0.6 + harvestIndex / 200)
  );

  let statusLevel: 'stabil' | 'waspada' | 'kritis' = 'waspada';
  let statusLabel = 'Waspada · Rantai Pangan Rentan';
  if (resilienceScore >= 75 && nutritionAdequacyPct >= 72) {
    statusLevel = 'stabil';
    statusLabel = 'Stabil · Ketahanan Pangan Tangguh';
  } else if (resilienceScore < 50 || nutritionAdequacyPct < 48) {
    statusLevel = 'kritis';
    statusLabel = 'Kritis · Risiko Rawan Pangan';
  }

  let bottleneckNote =
    'Keseimbangan sistem cukup baik. Tingkatkan teknologi penyimpanan dan diversifikasi pangan lokal untuk mencapai status tangguh.';
  if (irrigation < 40) {
    bottleneckNote =
      'Hambatan Utama di Hulu: Rendahnya irigasi berkelanjutan membuat produksi panen merosot saat musim kemarau sehingga pasokan awal tidak mencukupi.';
  } else if (coldStorage < 42 && harvestIndex >= 60) {
    bottleneckNote =
      'Paradoks Pascapanen: Produksi lahan sudah tinggi, tetapi minimnya rantai dingin menyebabkan hingga ' +
      postHarvestLossPct +
      '% hasil panen membusuk sebelum tiba di meja makan.';
  } else if (foodRescue < 45) {
    bottleneckNote =
      'Kebocoran di Hilir: Banyak pangan layak makan terbuang menjadi limbah. Aktivasi bank pangan komunitas dapat langsung menyelamatkan ribuan porsi.';
  } else if (nutritionDiversity < 50) {
    bottleneckNote =
      'Risiko Kelaparan Tersembunyi: Kalori dasar terpenuhi, namun kurangnya keragaman lauk dan sayuran menghambat pemenuhan protein serta zat besi untuk cegah stunting.';
  } else if (resilienceScore >= 78) {
    bottleneckNote =
      'Sinergi Optimal: Irigasi presisi menjaga panen, rantai dingin menekan susut pascapanen, food rescue mengalirkan surplus, dan pangan lokal memenuhi gizi seimbang.';
  }

  // Proyeksi 12 bulan memperhitungkan fluktuasi musim kemarau (bulan 6-9)
  const monthlySeries = Array.from({ length: 12 }, (_, idx) => {
    const month = idx + 1;
    const drySeasonStress = month >= 6 && month <= 9 ? 1 - (100 - irrigation) * 0.0028 : 1;
    const seasonalWave = Math.sin((month / 12) * Math.PI * 2) * 3;
    const nutrition = Math.max(
      18,
      Math.min(98, Math.round(nutritionAdequacyPct * drySeasonStress + seasonalWave))
    );
    const lossAndWaste = Math.max(
      5,
      Math.min(
        65,
        Math.round(postHarvestLossPct * 0.65 + (100 - wasteReductionPct) * 0.35 - seasonalWave * 0.5)
      )
    );
    return { month, nutrition, lossAndWaste };
  });

  return {
    harvestIndex,
    postHarvestLossPct,
    wasteReductionPct,
    nutritionAdequacyPct,
    resilienceScore,
    mealsSavedMonthly,
    statusLevel,
    statusLabel,
    bottleneckNote,
    monthlySeries,
  };
}

export function FoodSystemSimulator() {
  const [params, setParams] = useState<SimulatorParams>(SCENARIO_PRESETS[0].params);
  const [activePreset, setActivePreset] = useState<string>(SCENARIO_PRESETS[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeMonth, setActiveMonth] = useState<number>(1);

  const metrics = useMemo(() => computeSimulation(params), [params]);

  useEffect(() => {
    if (!isPlaying) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const timer = window.setInterval(() => {
      setActiveMonth((prev) => (prev >= 12 ? 1 : prev + 1));
    }, 1100);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const handleSliderChange = (key: keyof SimulatorParams, value: number) => {
    setActivePreset('custom');
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectPreset = (presetId: string) => {
    const found = SCENARIO_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setActivePreset(found.id);
    setParams(found.params);
  };

  const handleReset = () => {
    setActivePreset(SCENARIO_PRESETS[0].id);
    setParams(SCENARIO_PRESETS[0].params);
    setActiveMonth(1);
    setIsPlaying(true);
  };

  const currentMonthPoint = metrics.monthlySeries[activeMonth - 1];

  const statusStyles = {
    stabil: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      Icon: CheckCircle2,
      iconColor: 'text-emerald-700',
    },
    waspada: {
      container: 'bg-amber-50 border-amber-200 text-amber-900',
      Icon: AlertTriangle,
      iconColor: 'text-amber-700',
    },
    kritis: {
      container: 'bg-red-50 border-red-200 text-red-900',
      Icon: XCircle,
      iconColor: 'text-red-700',
    },
  }[metrics.statusLevel];

  const StatusIcon = statusStyles.Icon;

  // Build SVG polyline points for the 12-month coordinate chart (viewBox 0 0 640 210)
  const chartWidth = 640;
  const chartHeight = 200;
  const padLeft = 44;
  const padRight = 18;
  const padTop = 18;
  const padBottom = 30;
  const innerW = chartWidth - padLeft - padRight;
  const innerH = chartHeight - padTop - padBottom;

  const getX = (month: number) => padLeft + ((month - 1) / 11) * innerW;
  const getY = (val: number) => padTop + ((100 - val) / 100) * innerH;

  const nutritionPoints = metrics.monthlySeries
    .map((pt) => `${getX(pt.month).toFixed(1)},${getY(pt.nutrition).toFixed(1)}`)
    .join(' ');

  const lossPoints = metrics.monthlySeries
    .map((pt) => `${getX(pt.month).toFixed(1)},${getY(pt.lossAndWaste).toFixed(1)}`)
    .join(' ');

  return (
    <section id="simulasi" className="py-16 lg:py-20 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <p className="text-sm font-medium text-emerald-700 mb-2">
            01. Simulasi Sistem Pangan Wilayah
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight text-balance">
            Uji Bagaimana Keputusan Hulu hingga Hilir Mengubah Ketahanan Pangan
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Kelaparan jarang disebabkan oleh satu faktor saja. Atur keempat tuas intervensi di sebelah kanan untuk mengamati pergeseran alur pangan, penyusutan pascapanen, dan kecukupan gizi sepanjang 12 bulan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Top Zone: Interactive Stage (65% -> 8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Dual-coded status bar + key tabular readout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 bg-slate-50">
              <div className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg border text-sm font-semibold ${statusStyles.container}`}>
                <StatusIcon className={`w-4 h-4 shrink-0 ${statusStyles.iconColor}`} aria-hidden="true" />
                <span>{metrics.statusLabel}</span>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <div className="text-xs text-slate-500">Indeks Ketahanan</div>
                  <div className="font-mono-tabular text-2xl font-semibold text-slate-900">
                    {metrics.resilienceScore}
                    <span className="text-sm font-normal text-slate-500">/100</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200 hidden sm:block" aria-hidden="true" />
                <div>
                  <div className="text-xs text-slate-500">Porsi Diselamatkan</div>
                  <div className="font-mono-tabular text-2xl font-semibold text-emerald-700">
                    {metrics.mealsSavedMonthly.toLocaleString('id-ID')}
                    <span className="text-xs font-normal text-slate-500 ml-1">porsi/bln</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive SVG System Flow Stage */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Diagram Alur Rantai Pangan & Kebocoran Nutrisi
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Simulasi Bulan ke-{activeMonth} · Amati perbandingan aliran pangan sehat terhadap susut pascapanen
                  </p>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-700"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Jeda</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Putar</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setActiveMonth((prev) => (prev >= 12 ? 1 : prev + 1));
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-700"
                  >
                    <StepForward className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Langkah +1</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <svg
                  viewBox="0 0 760 220"
                  className="w-full min-w-[600px] h-auto"
                  role="img"
                  aria-label="Diagram alur sistem pangan dari produksi, penyimpanan dingin, penyelamatan surplus, hingga kecukupan gizi masyarakat"
                >
                  {/* Connection Paths */}
                  <path
                    d="M 168 85 C 195 85, 195 85, 222 85"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 168 85 C 195 85, 195 85, 222 85"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    className={isPlaying ? 'animate-flow-dash' : ''}
                  />

                  <path
                    d="M 382 85 C 409 85, 409 85, 436 85"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 382 85 C 409 85, 409 85, 436 85"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    className={isPlaying ? 'animate-flow-dash' : ''}
                  />

                  <path
                    d="M 596 85 C 618 85, 618 85, 636 85"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 596 85 C 618 85, 618 85, 636 85"
                    fill="none"
                    stroke="#047857"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    className={isPlaying ? 'animate-flow-dash' : ''}
                  />

                  {/* Downward Loss / Waste Leakage Branches */}
                  <path
                    d="M 302 128 L 302 168"
                    fill="none"
                    stroke={metrics.postHarvestLossPct > 22 ? '#dc2626' : '#d97706'}
                    strokeWidth={Math.max(2, metrics.postHarvestLossPct / 7)}
                    strokeDasharray="4 4"
                    className={isPlaying ? 'animate-flow-dash' : ''}
                  />
                  <path
                    d="M 516 128 L 516 168"
                    fill="none"
                    stroke={metrics.wasteReductionPct < 55 ? '#dc2626' : '#059669'}
                    strokeWidth={Math.max(2, (100 - metrics.wasteReductionPct) / 14)}
                    strokeDasharray="4 4"
                    className={isPlaying ? 'animate-flow-dash' : ''}
                  />

                  {/* Node 1: Produksi */}
                  <g transform="translate(12, 35)">
                    <rect
                      width="156"
                      height="96"
                      rx="10"
                      fill="#ffffff"
                      stroke={metrics.harvestIndex >= 65 ? '#059669' : '#d97706'}
                      strokeWidth="1.5"
                    />
                    <text x="14" y="25" fontSize="11" fontWeight="600" fill="#64748b">
                      01. PRODUKSI
                    </text>
                    <text x="14" y="45" fontSize="13" fontWeight="600" fill="#0f172a">
                      Panen & Hidroponik
                    </text>
                    <text
                      x="14"
                      y="76"
                      fontSize="20"
                      fontWeight="700"
                      fontFamily="IBM Plex Mono, monospace"
                      fill="#047857"
                    >
                      {metrics.harvestIndex}%
                    </text>
                    <text x="72" y="75" fontSize="11" fill="#475569">
                      kapasitas
                    </text>
                  </g>

                  {/* Node 2: Penyimpanan & Rantai Dingin */}
                  <g transform="translate(222, 35)">
                    <rect
                      width="160"
                      height="96"
                      rx="10"
                      fill="#ffffff"
                      stroke={metrics.postHarvestLossPct <= 15 ? '#0284c7' : '#d97706'}
                      strokeWidth="1.5"
                    />
                    <text x="14" y="25" fontSize="11" fontWeight="600" fill="#64748b">
                      02. PASCAPANEN
                    </text>
                    <text x="14" y="45" fontSize="13" fontWeight="600" fill="#0f172a">
                      Rantai Dingin
                    </text>
                    <text
                      x="14"
                      y="76"
                      fontSize="20"
                      fontWeight="700"
                      fontFamily="IBM Plex Mono, monospace"
                      fill="#0284c7"
                    >
                      {100 - metrics.postHarvestLossPct}%
                    </text>
                    <text x="76" y="75" fontSize="11" fill="#475569">
                      terjaga
                    </text>
                  </g>

                  {/* Leakage Label 1 */}
                  <text
                    x="302"
                    y="188"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill={metrics.postHarvestLossPct > 22 ? '#b91c1c' : '#b45309'}
                  >
                    Susut Pascapanen: {metrics.postHarvestLossPct}%
                  </text>

                  {/* Node 3: Distribusi & Food Rescue */}
                  <g transform="translate(436, 35)">
                    <rect
                      width="160"
                      height="96"
                      rx="10"
                      fill="#ffffff"
                      stroke={metrics.wasteReductionPct >= 65 ? '#059669' : '#d97706'}
                      strokeWidth="1.5"
                    />
                    <text x="14" y="25" fontSize="11" fontWeight="600" fill="#64748b">
                      03. DISTRIBUSI
                    </text>
                    <text x="14" y="45" fontSize="13" fontWeight="600" fill="#0f172a">
                      Penyelamatan Surplus
                    </text>
                    <text
                      x="14"
                      y="76"
                      fontSize="20"
                      fontWeight="700"
                      fontFamily="IBM Plex Mono, monospace"
                      fill="#047857"
                    >
                      {metrics.wasteReductionPct}%
                    </text>
                    <text x="76" y="75" fontSize="11" fill="#475569">
                      tersalur
                    </text>
                  </g>

                  {/* Leakage Label 2 */}
                  <text
                    x="516"
                    y="188"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill={metrics.wasteReductionPct < 55 ? '#b91c1c' : '#047857'}
                  >
                    Limbah Konsumsi: {100 - metrics.wasteReductionPct}%
                  </text>

                  {/* Node 4: Kecukupan Gizi */}
                  <g transform="translate(636, 35)">
                    <rect
                      width="112"
                      height="96"
                      rx="10"
                      fill="#ffffff"
                      stroke={metrics.nutritionAdequacyPct >= 70 ? '#047857' : '#dc2626'}
                      strokeWidth="1.5"
                    />
                    <text x="12" y="25" fontSize="11" fontWeight="600" fill="#64748b">
                      04. DAMPAK
                    </text>
                    <text x="12" y="45" fontSize="13" fontWeight="600" fill="#0f172a">
                      Gizi Warga
                    </text>
                    <text
                      x="12"
                      y="76"
                      fontSize="20"
                      fontWeight="700"
                      fontFamily="IBM Plex Mono, monospace"
                      fill={metrics.nutritionAdequacyPct >= 70 ? '#047857' : '#b45309'}
                    >
                      {metrics.nutritionAdequacyPct}%
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Live Coordinate Chart: 12-Month Projection */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Proyeksi 12 Bulan: Kecukupan Gizi vs Kehilangan Pangan
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bulan 6–9 memodelkan tekanan musim kemarau pada produksi pangan daerah
                  </p>
                </div>

                <div className="flex items-center gap-5 text-xs font-medium">
                  <span className="inline-flex items-center gap-2 text-emerald-800">
                    <span className="w-3 h-0.5 bg-emerald-700 inline-block" aria-hidden="true" />
                    Gizi Tercukupi ({currentMonthPoint.nutrition}%)
                  </span>
                  <span className="inline-flex items-center gap-2 text-amber-800">
                    <span className="w-3 h-0.5 bg-amber-600 inline-block" aria-hidden="true" />
                    Susut & Limbah ({currentMonthPoint.lossAndWaste}%)
                  </span>
                </div>
              </div>

              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-auto"
                role="img"
                aria-label="Grafik proyeksi 12 bulan perbandingan persentase gizi tercukupi dan kehilangan pangan"
              >
                {/* Horizontal gridlines */}
                {[0, 25, 50, 75, 100].map((tick) => {
                  const y = getY(tick);
                  return (
                    <g key={tick}>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={chartWidth - padRight}
                        y2={y}
                        stroke="#e2e8f0"
                        strokeWidth="1"
                      />
                      <text
                        x={padLeft - 8}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="10"
                        fontFamily="IBM Plex Mono, monospace"
                        fill="#64748b"
                      >
                        {tick}%
                      </text>
                    </g>
                  );
                })}

                {/* Dry season shaded band (Month 6 to 9) */}
                <rect
                  x={getX(6)}
                  y={padTop}
                  width={getX(9) - getX(6)}
                  height={innerH}
                  fill="#fef3c7"
                  opacity="0.45"
                />
                <text
                  x={(getX(6) + getX(9)) / 2}
                  y={padTop + 13}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="500"
                  fill="#92400e"
                >
                  Puncak Kemarau
                </text>

                {/* Active Month Marker Line */}
                <line
                  x1={getX(activeMonth)}
                  y1={padTop}
                  x2={getX(activeMonth)}
                  y2={chartHeight - padBottom}
                  stroke="#0f172a"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {/* Series Lines */}
                <polyline
                  fill="none"
                  stroke="#047857"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={nutritionPoints}
                />
                <polyline
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={lossPoints}
                />

                {/* Active Data Points */}
                <circle
                  cx={getX(activeMonth)}
                  cy={getY(currentMonthPoint.nutrition)}
                  r="5"
                  fill="#047857"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <circle
                  cx={getX(activeMonth)}
                  cy={getY(currentMonthPoint.lossAndWaste)}
                  r="5"
                  fill="#d97706"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Month Axis Labels */}
                {metrics.monthlySeries.map((pt) => (
                  <text
                    key={pt.month}
                    x={getX(pt.month)}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight={pt.month === activeMonth ? '700' : '400'}
                    fontFamily="IBM Plex Mono, monospace"
                    fill={pt.month === activeMonth ? '#0f172a' : '#64748b'}
                  >
                    B{pt.month}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* Right Zone: Control & Concept Deck (35% -> 4 cols) */}
          <div className="lg:col-span-4 space-y-6 rounded-xl border border-slate-200 bg-slate-50 p-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-3">
                Pilih Skenario Cepat
              </h3>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-lg">
                {SCENARIO_PRESETS.map((preset) => {
                  const isActive = activePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`px-2.5 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer truncate focus-visible:outline-2 focus-visible:outline-emerald-700 ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-5 pt-2 border-t border-slate-200">
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <label htmlFor="slider-irrigation" className="font-medium text-slate-800">
                    Irigasi & Pertanian Lestari
                  </label>
                  <span className="font-mono-tabular text-xs font-semibold text-emerald-800">
                    {params.irrigation}%
                  </span>
                </div>
                <input
                  id="slider-irrigation"
                  type="range"
                  min={10}
                  max={100}
                  value={params.irrigation}
                  onChange={(e) => handleSliderChange('irrigation', Number(e.target.value))}
                  className="sdg-slider w-full"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Efisiensi air, irigasi tetes, dan hidroponik tahan kemarau.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <label htmlFor="slider-cold" className="font-medium text-slate-800">
                    Penyimpanan & Rantai Dingin
                  </label>
                  <span className="font-mono-tabular text-xs font-semibold text-emerald-800">
                    {params.coldStorage}%
                  </span>
                </div>
                <input
                  id="slider-cold"
                  type="range"
                  min={10}
                  max={100}
                  value={params.coldStorage}
                  onChange={(e) => handleSliderChange('coldStorage', Number(e.target.value))}
                  className="sdg-slider w-full"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Menekan pembusukan sayur dan ikan saat distribusi (Food Loss).
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <label htmlFor="slider-rescue" className="font-medium text-slate-800">
                    Penyelamatan Surplus Pangan
                  </label>
                  <span className="font-mono-tabular text-xs font-semibold text-emerald-800">
                    {params.foodRescue}%
                  </span>
                </div>
                <input
                  id="slider-rescue"
                  type="range"
                  min={10}
                  max={100}
                  value={params.foodRescue}
                  onChange={(e) => handleSliderChange('foodRescue', Number(e.target.value))}
                  className="sdg-slider w-full"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Penyaluran makanan layak santap melalui bank pangan (Food Rescue).
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <label htmlFor="slider-nutrition" className="font-medium text-slate-800">
                    Diversifikasi Pangan & Gizi
                  </label>
                  <span className="font-mono-tabular text-xs font-semibold text-emerald-800">
                    {params.nutritionDiversity}%
                  </span>
                </div>
                <input
                  id="slider-nutrition"
                  type="range"
                  min={10}
                  max={100}
                  value={params.nutritionDiversity}
                  onChange={(e) => handleSliderChange('nutritionDiversity', Number(e.target.value))}
                  className="sdg-slider w-full"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Kombinasi sorgum, umbi lokal, tempe, ikan, dan sayur kaya zat besi.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-semibold text-slate-500 mb-2">
                Analisis Dinamika Sistem
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {metrics.bottleneckNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
