export interface SdgTarget {
  id: string;
  code: string;
  title: string;
  shortLabel: string;
  summary: string;
  indonesiaContext: string;
  schoolInnovation: string;
  keyMetricLabel: string;
  keyMetricValue: string;
  imageSrc: string;
  imageAlt: string;
}

export interface SimulatorParams {
  irrigation: number;
  coldStorage: number;
  foodRescue: number;
  nutritionDiversity: number;
}

export interface ScenarioPreset {
  id: string;
  label: string;
  description: string;
  params: SimulatorParams;
}

export interface SchoolInitiative {
  id: string;
  title: string;
  targetCode: string;
  description: string;
  foodSavedKgPerStudentSemester: number;
  compostKgPerStudentSemester: number;
  nutritionMealsPerStudentSemester: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  topic: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const IMAGES = {
  hero: '/src/assets/images/hero_food_resilience_1794875276896.jpg',
  hydroponics: '/src/assets/images/pillar_school_hydroponics_1794875277546.jpg',
  nutrition: '/src/assets/images/pillar_balanced_nutrition_1794875277530.jpg',
  harvest: '/src/assets/images/pillar_community_harvest_1794875279693.jpg',
};

export const HERO_METRICS = [
  {
    value: '735 Juta',
    label: 'Penduduk dunia mengalami rawan pangan kronis (FAO)',
    context: 'Global',
  },
  {
    value: '30%–33%',
    label: 'Pangan dunia hilang di rantai pasok atau terbuang di konsumsi',
    context: 'Food Loss & Waste',
  },
  {
    value: '21,5%',
    label: 'Prevalensi stunting balita yang terus ditekan di Indonesia',
    context: 'Target Gizi Nasional',
  },
  {
    value: '2030',
    label: 'Batas pencapaian target global SDG 2: Tanpa Kelaparan',
    context: 'Agenda PBB',
  },
];

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'status-quo',
    label: 'Kondisi Awal',
    description: 'Sistem pangan konvensional dengan kehilangan pascapanen moderat dan konsumsi masih bergantung pada satu komoditas.',
    params: {
      irrigation: 52,
      coldStorage: 40,
      foodRescue: 35,
      nutritionDiversity: 48,
    },
  },
  {
    id: 'climate-shock',
    label: 'Krisis Kekeringan',
    description: 'Simulasi dampak El Nino pada lahan tadah hujan saat penyimpanan dingin dan penyelamatan surplus masih rendah.',
    params: {
      irrigation: 24,
      coldStorage: 32,
      foodRescue: 25,
      nutritionDiversity: 38,
    },
  },
  {
    id: 'resilient-village',
    label: 'Mandiri Pangan',
    description: 'Sinergi irigasi presisi, rantai dingin komunitas, bank pangan aktif, dan penganekaragaman pangan lokal.',
    params: {
      irrigation: 88,
      coldStorage: 84,
      foodRescue: 86,
      nutritionDiversity: 90,
    },
  },
];

export const SDG_TARGETS: SdgTarget[] = [
  {
    id: 'target-2-1',
    code: 'Target 2.1',
    shortLabel: '2.1 Akses Pangan',
    title: 'Mengakhiri Kelaparan dan Menjamin Akses Pangan Aman Sepanjang Tahun',
    summary:
      'Memastikan seluruh lapisan masyarakat—terutama keluarga rentan dan anak usia sekolah—memperoleh akses pangan yang aman, cukup, dan bergizi sepanjang tahun.',
    indonesiaContext:
      'Di Indonesia, tantangan akses pangan sering kali bukan karena ketiadaan bahan makanan, melainkan distribusi antarwilayah, fluktuasi harga musiman, serta tingginya makanan layak makan yang terbuang di kota.',
    schoolInnovation:
      'Membentuk jaringan berbagi surplus makanan layak konsumsi dari acara sekolah atau kantin yang bekerja sama dengan komunitas panti asuhan dan bank pangan lokal.',
    keyMetricLabel: 'Potensi penyelamatan pangan kota',
    keyMetricValue: '23–48 Juta Ton/Tahun (Bappenas)',
    imageSrc: IMAGES.harvest,
    imageAlt: 'Hasil panen lokal sorgum, ubi jalar, dan sayuran segar dalam keranjang anyaman bambu di sentra pangan komunitas',
  },
  {
    id: 'target-2-2',
    code: 'Target 2.2',
    shortLabel: '2.2 Gizi & Stunting',
    title: 'Mengakhiri Segala Bentuk Malnutrisi Termasuk Stunting dan Kekurangan Gizi Mikro',
    summary:
      'Ketahanan pangan tidak hanya soal kenyang kalori, tetapi juga pemenuhan protein hewani/nabati, zat besi, vitamin A, dan zinc untuk mencegah stunting dan anemia remaja.',
    indonesiaContext:
      'Remaja putri dan balita rentan mengalami anemia serta kekurangan gizi mikro apabila pola makan didominasi karbohidrat sederhana tanpa sayur, buah, dan protein lokal seperti ikan atau tempe.',
    schoolInnovation:
      'Kampanye "Isi Piringku" versi kantin sekolah: mewajibkan label informasi gizi sederhana pada menu kantin serta menyisipkan sayuran daun kelor, ikan lokal, dan tempe.',
    keyMetricLabel: 'Target penurunan stunting nasional',
    keyMetricValue: '14% (Sasaran Percepatan Gizi)',
    imageSrc: IMAGES.nutrition,
    imageAlt: 'Piring gizi seimbang berisi nasi merah lokal, ikan panggang, tempe, tumis sayuran hijau, dan buah tropis',
  },
  {
    id: 'target-2-3',
    code: 'Target 2.3',
    shortLabel: '2.3 Petani Kecil',
    title: 'Menggandakan Produktivitas dan Pendapatan Petani Skala Kecil',
    summary:
      'Petani gurem, nelayan kecil, dan peternak lokal memproduksi sebagian besar pangan segar kita, namun sering menerima margin terkecil karena panjangnya rantai perantara dan susut pascapanen.',
    indonesiaContext:
      'Kurangnya akses teknologi pascapanen, pengeringan gabah, dan rantai dingin membuat hasil sayur dan buah petani cepat membusuk sebelum tiba di pasar.',
    schoolInnovation:
      'Proyek Kewirausahaan (PKWU) Kelas XI bermitra langsung dengan kelompok tani sekitar sekolah untuk memasarkan produk olahan tahan lama atau sistem pra-pesan mingguan.',
    keyMetricLabel: 'Proporsi petani skala kecil',
    keyMetricValue: '>55% Rumah Tangga Tani',
    imageSrc: IMAGES.harvest,
    imageAlt: 'Pengemasan hasil panen petani lokal di pusat distribusi pangan',
  },
  {
    id: 'target-2-4',
    code: 'Target 2.4',
    shortLabel: '2.4 Pertanian Lestari',
    title: 'Mewujudkan Sistem Produksi Pangan Berkelanjutan dan Tangguh Perubahan Iklim',
    summary:
      'Menjaga kesuburan tanah, menghemat air irigasi, mengurangi pupuk kimia sintetis berlebih, dan beradaptasi terhadap cuaca ekstrem seperti kekeringan maupun banjir.',
    indonesiaContext:
      'Ketergantungan tinggi pada satu jenis tanaman pangan membuat sistem pangan rentan saat iklim berubah. Diversifikasi ke sorgum, sagu, sukun, dan ubi jalar memperkuat daya tahan ekologis.',
    schoolInnovation:
      'Membangun instalasi hidroponik bertenaga surya mini atau kebun vertikal berbasis sensor kelembapan sederhana di lahan sempit sekolah.',
    keyMetricLabel: 'Efisiensi air irigasi tetes & hidroponik',
    keyMetricValue: 'Hemat hingga 70–85% air',
    imageSrc: IMAGES.hydroponics,
    imageAlt: 'Sistem irigasi tetes presisi pada budidaya sayuran hijau berkelanjutan di lahan terasering',
  },
];

export const SCHOOL_INITIATIVES: SchoolInitiative[] = [
  {
    id: 'hydroponics',
    title: 'Kebun Hidroponik Vertikal OSIS',
    targetCode: 'Target 2.4',
    description: 'Menanam sawi, selada, dan bayam di lorong sekolah dengan sirkulasi air tertutup untuk suplai kantin.',
    foodSavedKgPerStudentSemester: 0.45,
    compostKgPerStudentSemester: 0.1,
    nutritionMealsPerStudentSemester: 3.5,
  },
  {
    id: 'plate-zero-waste',
    title: 'Gerakan Habiskan Bekal & Sisa Kantin',
    targetCode: 'Target 2.1',
    description: 'Audit mingguan sisa makanan piring kantin serta edukasi takaran porsi agar tidak ada makanan terbuang.',
    foodSavedKgPerStudentSemester: 1.8,
    compostKgPerStudentSemester: 0.2,
    nutritionMealsPerStudentSemester: 4.5,
  },
  {
    id: 'food-rescue',
    title: 'Bank Surplus Acara Sekolah',
    targetCode: 'Target 2.1',
    description: 'Menyalurkan kelebihan konsumsi rapat, seminar, dan bazar sekolah yang masih higienis dalam waktu <2 jam.',
    foodSavedKgPerStudentSemester: 1.1,
    compostKgPerStudentSemester: 0.05,
    nutritionMealsPerStudentSemester: 3.0,
  },
  {
    id: 'compost-loop',
    title: 'Komposter Organik Limbah Dapur',
    targetCode: 'Target 2.4',
    description: 'Mengolah kulit buah dan sisa sayur kantin menjadi pupuk organik cair untuk kebun pangan sekolah.',
    foodSavedKgPerStudentSemester: 0.2,
    compostKgPerStudentSemester: 1.65,
    nutritionMealsPerStudentSemester: 0.5,
  },
  {
    id: 'local-grain',
    title: 'Hari Pangan Lokal Non-Beras & Gizi Seimbang',
    targetCode: 'Target 2.2',
    description: 'Menyajikan olahan singkong, ubi ungu, jagung, dan tempe satu hari per minggu di kantin sekolah.',
    foodSavedKgPerStudentSemester: 0.3,
    compostKgPerStudentSemester: 0.15,
    nutritionMealsPerStudentSemester: 6.0,
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    topic: 'Food Loss vs Food Waste',
    question:
      'Sebagian besar sayuran segar dari kebun petani membusuk di truk pengangkut sebelum sempat dibeli konsumen karena tidak ada pendingin. Dalam kajian SDG 2, kondisi ini digolongkan sebagai apa?',
    options: [
      'Food Waste (pemborosan oleh konsumen akhir)',
      'Food Loss (kehilangan pangan pada tahap produksi, pascapanen, dan distribusi)',
      'Overnutrition (kelebihan asupan energi harian)',
      'Malabsorpsi nutrisi',
    ],
    correctIndex: 1,
    explanation:
      'Tepat! Food Loss terjadi di hulu rantai pasok (panen, penyimpanan, distribusi) akibat minimnya infrastruktur seperti rantai dingin, sedangkan Food Waste terjadi di tingkat ritel dan konsumen.',
  },
  {
    id: 'q2',
    topic: 'Gizi & Pencegahan Stunting',
    question:
      'Mengapa pemenuhan kebutuhan kalori harian saja belum cukup untuk mencapai Target SDG 2.2 dalam mencegah stunting?',
    options: [
      'Karena kalori hanya berasal dari air minum',
      'Karena tubuh membutuhkan zat gizi makro (terutama protein) dan gizi mikro (zat besi, zinc, vitamin) untuk pertumbuhan linier dan perkembangan otak',
      'Karena makanan bergizi selalu harus diimpor dari luar negeri',
      'Karena stunting hanya dipengaruhi oleh jam tidur siswa',
    ],
    correctIndex: 1,
    explanation:
      'Benar! Fenomena "kelaparan tersembunyi" (hidden hunger) terjadi ketika seseorang kenyang karbohidrat tetapi kekurangan protein, zat besi, zinc, dan vitamin esensial.',
  },
  {
    id: 'q3',
    topic: 'Diversifikasi Pangan Lokal',
    question:
      'Manakah langkah diversifikasi pangan yang paling efektif memperkuat ketahanan pangan Indonesia saat terjadi musim kemarau panjang?',
    options: [
      'Mengandalkan hanya satu jenis beras untuk seluruh wilayah',
      'Mengembangkan konsumsi dan budidaya sumber pangan lokal adaptif iklim seperti sorgum, sagu, singkong, dan ubi jalar',
      'Menghentikan seluruh aktivitas pertanian lahan kering',
      'Mengganti seluruh makan siang dengan minuman berkarbonasi',
    ],
    correctIndex: 1,
    explanation:
      'Sorgum, ubi jalar, dan sagu memiliki toleransi kekeringan dan kecocokan ekologis lokal yang tinggi, sehingga risiko gagal panen massal jauh lebih kecil.',
  },
  {
    id: 'q4',
    topic: 'Pertanian Berkelanjutan',
    question:
      'Bagaimana sistem irigasi tetes dan hidroponik membantu pencapaian Target SDG 2.4 di wilayah padat penduduk atau lahan sempit?',
    options: [
      'Menggunakan air lima kali lebih banyak daripada irigasi genangan',
      'Mengalirkan air dan nutrisi tepat ke zona akar sehingga menghemat air hingga 70–85% dan tetap produktif di lahan terbatas',
      'Menghilangkan kebutuhan cahaya matahari pada tanaman hijau',
      'Memerlukan pembukaan hutan primer secara luas',
    ],
    correctIndex: 1,
    explanation:
      'Irigasi presisi dan hidroponik meminimalkan penguapan dan limpasan air, sangat ideal diterapkan sebagai laboratorium pertanian urban di lingkungan SMA.',
  },
  {
    id: 'q5',
    topic: 'Aksi Pelajar Kelas XI',
    question:
      'Jika siswa kelas XI ingin menurunkan emisi gas metana dari sampah organik kantin sekaligus membantu kebun sekolah, inovasi paling tepat adalah...',
    options: [
      'Membuang sisa sayur dan buah ke tempat pembuangan akhir bercampur plastik',
      'Memilah limbah organik kantin menjadi kompos atau eco-enzyme untuk menyuburkan tanaman kebun sekolah',
      'Membakar seluruh sampah sisa makanan di halaman sekolah',
      'Menyimpan sisa makanan basah dalam kantong tertutup tanpa pengolahan',
    ],
    correctIndex: 1,
    explanation:
      'Limbah makanan yang menumpuk di TPA menghasilkan gas metana yang kuat. Mengolahnya menjadi kompos menutup siklus nutrisi kembali ke kebun pangan sekolah!',
  },
];
