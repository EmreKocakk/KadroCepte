// Örnek veriler. İleride Supabase veya harici bir API'den dinamik çekilebilmesi
// için tüm içerik tek bir tipli dizi yapısında tutulur.

export type KategoriId =
  | "tumu"
  | "saglik"
  | "meb"
  | "adalet"
  | "icisleri"
  | "memur";

export type Kategori = { id: KategoriId; ad: string };

export const kategoriler: Kategori[] = [
  { id: "tumu", ad: "Tümü" },
  { id: "saglik", ad: "Sağlık Bakanlığı" },
  { id: "meb", ad: "MEB / Öğretmenlik" },
  { id: "adalet", ad: "Adalet Bakanlığı" },
  { id: "icisleri", ad: "İçişleri / Emniyet" },
  { id: "memur", ad: "Düz Memurluk / 4B" },
];

export type Haber = {
  id: string;
  kategori: Exclude<KategoriId, "tumu">;
  kurum: string;
  baslik: string;
  tarih: string;
  yeni: boolean;
  ozet: string;
  detay: string;
  kilavuzUrl: string;
  resmiGazeteUrl: string;
};

const OSYM = "https://www.osym.gov.tr/";
const RG = "https://www.resmigazete.gov.tr/";

export const haberler: Haber[] = [
  {
    id: "1",
    kategori: "saglik",
    kurum: "Sağlık Bakanlığı",
    baslik: "KPSS-2026/7 Sağlık Bakanlığı Sözleşmeli Sağlık Personeli Tercih Kılavuzu Yayımlandı",
    tarih: "29 Eylül 2026",
    yeni: true,
    ozet:
      "Hemşire, ebe, sağlık teknikeri ve tıbbi sekreter kadroları için merkezi yerleştirme tercihleri ÖSYM AİS üzerinden alınacak.",
    detay:
      "Tercih işlemleri ÖSYM Aday İşlemleri Sistemi üzerinden yapılacaktır. Adaylar en fazla 30 kadro tercih edebilir. Tercih şartları, kadro kodları ve nitelik açıklamaları kılavuzda yer almaktadır. Kılavuzun tamamı ÖSYM duyurular sayfasında yayımlanmıştır.",
    kilavuzUrl: OSYM,
    resmiGazeteUrl: RG,
  },
  {
    id: "2",
    kategori: "meb",
    kurum: "MEB / Öğretmenlik",
    baslik: "MEB Sözleşmeli Öğretmen Ataması Duyurusu: Branş Kontenjanları Açıklandı",
    tarih: "27 Eylül 2026",
    yeni: true,
    ozet:
      "Okul öncesi, sınıf öğretmenliği ve özel eğitim branşlarında kontenjan dağılımı Personel Genel Müdürlüğü tarafından yayımlandı.",
    detay:
      "Başvurular e-Devlet ve MEBBİS üzerinden alınacaktır. Atamalar KPSS P121 puan türüne göre yapılacak olup başvuru takvimi duyuru metninde yer almaktadır.",
    kilavuzUrl: "https://personel.meb.gov.tr/",
    resmiGazeteUrl: RG,
  },
  {
    id: "3",
    kategori: "adalet",
    kurum: "Adalet Bakanlığı",
    baslik: "Adalet Bakanlığı Zabıt Kâtibi, Mübaşir ve İnfaz Koruma Memuru Alım İlanı",
    tarih: "25 Eylül 2026",
    yeni: true,
    ozet:
      "Adli yargı ve ceza infaz kurumları için sözleşmeli personel alımında başvuru şartları ve sınav takvimi duyuruldu.",
    detay:
      "Zabıt kâtipliği için uygulamalı (klavye) sınav ile sözlü sınav yapılacaktır. İnfaz ve koruma memurluğu için fiziki yeterlilik ve sözlü sınav aşamaları bulunmaktadır. Başvurular e-Devlet Kariyer Kapısı üzerinden alınır.",
    kilavuzUrl: "https://www.adalet.gov.tr/",
    resmiGazeteUrl: RG,
  },
  {
    id: "4",
    kategori: "icisleri",
    kurum: "İçişleri / Emniyet",
    baslik: "Polis Akademisi POMEM Dönem Başvuruları ve Fiziki Yeterlilik Takvimi",
    tarih: "22 Eylül 2026",
    yeni: false,
    ozet:
      "Ön lisans ve lisans mezunları için Polis Meslek Eğitim Merkezleri başvuru şartları açıklandı.",
    detay:
      "Başvurular Polis Akademisi Başkanlığı internet sitesi üzerinden yapılmaktadır. KPSS P3 (lisans) ve P93 (ön lisans) puanları değerlendirmeye alınır.",
    kilavuzUrl: "https://www.pa.edu.tr/",
    resmiGazeteUrl: RG,
  },
  {
    id: "5",
    kategori: "memur",
    kurum: "Düz Memurluk / 4B",
    baslik: "KPSS-2026/2 Merkezi Yerleştirme: Ortaöğretim, Ön Lisans ve Lisans Kadroları",
    tarih: "19 Eylül 2026",
    yeni: false,
    ozet:
      "Kamu kurum ve kuruluşlarının memur ve 4B sözleşmeli personel kadroları ÖSYM tarafından ilan edildi.",
    detay:
      "Büro personeli, memur, VHKİ ve destek personeli kadroları dahil çok sayıda kurum yer almaktadır. Tercih kılavuzu ve kadro tabloları ÖSYM duyurular sayfasındadır.",
    kilavuzUrl: OSYM,
    resmiGazeteUrl: RG,
  },
  {
    id: "6",
    kategori: "icisleri",
    kurum: "İçişleri / Emniyet",
    baslik: "Jandarma Genel Komutanlığı Uzman Erbaş ve Sözleşmeli Personel Alımı",
    tarih: "16 Eylül 2026",
    yeni: false,
    ozet:
      "Jandarma ve Sahil Güvenlik Akademisi sözleşmeli personel alım ilanı ve başvuru tarihleri yayımlandı.",
    detay:
      "Başvuru şartları, yaş sınırları ve sağlık kriterleri ilan metninde detaylı olarak yer almaktadır.",
    kilavuzUrl: "https://www.jandarma.gov.tr/",
    resmiGazeteUrl: RG,
  },
];

export type OgrenimDuzeyi = "lisans" | "onlisans" | "ortaogretim";

export interface Brans {
  id: string;
  ad: string;
  duzey: OgrenimDuzeyi;
  puanTuru: string;
  tabanMin: number;
  tabanMax: number;
  aciklama?: string;
}

export const duzeyler = [
  { id: "lisans", ad: "Lisans (P3)" },
  { id: "onlisans", ad: "Ön Lisans (P93)" },
  { id: "ortaogretim", ad: "Ortaöğretim (P94)" },
];

export const branslar: Brans[] = [
  // ==========================================
  // LİSANS (P3) BRANŞLARI
  // ==========================================
  { id: "l-bilgisayar-muh", ad: "Bilgisayar Mühendisliği", duzey: "lisans", puanTuru: "P3", tabanMin: 78, tabanMax: 93, aciklama: "Kadro sayısına göre 80 üstü güvenli bölgedir." },
  { id: "l-insaat-muh", ad: "İnşaat Mühendisliği", duzey: "lisans", puanTuru: "P3", tabanMin: 78, tabanMax: 88 },
  { id: "l-elektrik-muh", ad: "Elektrik-Elektronik Mühendisliği", duzey: "lisans", puanTuru: "P3", tabanMin: 76, tabanMax: 90 },
  { id: "l-makine-muh", ad: "Makine Mühendisliği", duzey: "lisans", puanTuru: "P3", tabanMin: 77, tabanMax: 88 },
  { id: "l-harita-muh", ad: "Harita / Geomatik Mühendisliği", duzey: "lisans", puanTuru: "P3", tabanMin: 75, tabanMax: 86 },
  { id: "l-hemsirelik", ad: "Hemşirelik (Lisans)", duzey: "lisans", puanTuru: "P3", tabanMin: 68, tabanMax: 82, aciklama: "Sağlık Bakanlığı alımlarında taban puanlar düşebilir." },
  { id: "l-ebelik", ad: "Ebelik", duzey: "lisans", puanTuru: "P3", tabanMin: 65, tabanMax: 78 },
  { id: "l-fizyoterapi", ad: "Fizyoterapi ve Rehabilitasyon", duzey: "lisans", puanTuru: "P3", tabanMin: 80, tabanMax: 90 },
  { id: "l-psikoloji", ad: "Psikoloji", duzey: "lisans", puanTuru: "P3", tabanMin: 82, tabanMax: 92 },
  { id: "l-sosyal-hizmet", ad: "Sosyal Hizmet", duzey: "lisans", puanTuru: "P3", tabanMin: 78, tabanMax: 88 },
  { id: "l-hukuk", ad: "Hukuk / Avukatlık", duzey: "lisans", puanTuru: "P3", tabanMin: 81, tabanMax: 92 },
  { id: "l-iibf-genel", ad: "İKT / İŞL / Kamu Yönetimi (4001 / Düz Memurluk)", duzey: "lisans", puanTuru: "P3", tabanMin: 75, tabanMax: 88 },
  { id: "l-sinif-ogretmenlik", ad: "Sınıf Öğretmenliği", duzey: "lisans", puanTuru: "P3", tabanMin: 68, tabanMax: 78 },
  { id: "l-turkce-ogretmenlik", ad: "Türkçe Öğretmenliği", duzey: "lisans", puanTuru: "P3", tabanMin: 72, tabanMax: 83 },
  { id: "l-matematik-ogretmenlik", ad: "İlköğretim Matematik Öğretmenliği", duzey: "lisans", puanTuru: "P3", tabanMin: 66, tabanMax: 78 },
  { id: "l-ingilizce-ogretmenlik", ad: "İngilizce Öğretmenliği", duzey: "lisans", puanTuru: "P3", tabanMin: 74, tabanMax: 84 },
  { id: "l-pdr", ad: "Rehberlik ve Psikolojik Danışmanlık (PDR)", duzey: "lisans", puanTuru: "P3", tabanMin: 71, tabanMax: 82 },
  { id: "l-okul-oncesi", ad: "Okul Öncesi Öğretmenliği", duzey: "lisans", puanTuru: "P3", tabanMin: 67, tabanMax: 78 },
  { id: "l-ozel-egitim", ad: "Özel Eğitim Öğretmenliği", duzey: "lisans", puanTuru: "P3", tabanMin: 62, tabanMax: 75 },
  { id: "l-mimar", ad: "Mimar", duzey: "lisans", puanTuru: "P3", tabanMin: 77, tabanMax: 88 },
  { id: "l-diyetisyen", ad: "Diyetisyenlik", duzey: "lisans", puanTuru: "P3", tabanMin: 83, tabanMax: 93 },

  // ==========================================
  // ÖN LİSANS (P93) BRANŞLARI
  // ==========================================
  { id: "ol-adalet", ad: "Adalet / Ceza İnfaz", duzey: "onlisans", puanTuru: "P93", tabanMin: 72, tabanMax: 85 },
  { id: "ol-bilgisayar-prog", ad: "Bilgisayar Programcılığı / Bilişim Teknikeri", duzey: "onlisans", puanTuru: "P93", tabanMin: 68, tabanMax: 82 },
  { id: "ol-elektrik-tekniker", ad: "Elektrik Teknikeri", duzey: "onlisans", puanTuru: "P93", tabanMin: 72, tabanMax: 84 },
  { id: "ol-insaat-tekniker", ad: "İnşaat Teknikeri", duzey: "onlisans", puanTuru: "P93", tabanMin: 70, tabanMax: 82 },
  { id: "ol-makine-tekniker", ad: "Makine Teknikeri", duzey: "onlisans", puanTuru: "P93", tabanMin: 69, tabanMax: 80 },
  { id: "ol-tibbi-sekreter", ad: "Tıbbi Dokümantasyon ve Sekreterlik", duzey: "onlisans", puanTuru: "P93", tabanMin: 65, tabanMax: 78 },
  { id: "ol-anestezi", ad: "Anestezi Teknikeri", duzey: "onlisans", puanTuru: "P93", tabanMin: 78, tabanMax: 88 },
  { id: "ol-paramedik", ad: "İlk ve Acil Yardım (Paramedik)", duzey: "onlisans", puanTuru: "P93", tabanMin: 76, tabanMax: 86 },
  { id: "ol-radyoloji", ad: "Tıbbi Görüntüleme Teknikleri (Radyoloji)", duzey: "onlisans", puanTuru: "P93", tabanMin: 74, tabanMax: 85 },
  { id: "ol-laboratuvar", ad: "Tıbbi Laboratuvar Teknikleri", duzey: "onlisans", puanTuru: "P93", tabanMin: 71, tabanMax: 82 },
  { id: "ol-agiz-dis", ad: "Ağız ve Diş Sağlığı", duzey: "onlisans", puanTuru: "P93", tabanMin: 73, tabanMax: 83 },
  { id: "ol-buro-yonetimi", ad: "Büro Yönetimi ve Yönetici Asistanlığı", duzey: "onlisans", puanTuru: "P93", tabanMin: 66, tabanMax: 80 },
  { id: "ol-harita-kadastro", ad: "Harita ve Kadastro Teknikeri", duzey: "onlisans", puanTuru: "P93", tabanMin: 70, tabanMax: 82 },
  { id: "ol-itfaiye", ad: "İtfaiyecilik ve Sivil Savunma", duzey: "onlisans", puanTuru: "P93", tabanMin: 67, tabanMax: 78 },
  { id: "ol-guvenlik", ad: "Koruma ve Güvenlik Görevlisi (Ön Lisans)", duzey: "onlisans", puanTuru: "P93", tabanMin: 71, tabanMax: 82 },

  // ==========================================
  // ORTAÖĞRETİM / LİSE (P94) BRANŞLARI
  // ==========================================
  { id: "o-duz-memur", ad: "Düz Memur (Herhangi Lise Mezunu - 2001)", duzey: "ortaogretim", puanTuru: "P94", tabanMin: 78, tabanMax: 92, aciklama: "Nitelik kodu genel olduğu için rekabet yüksektir." },
  { id: "o-hizmetli", ad: "Destek Personeli / Hizmetli", duzey: "ortaogretim", puanTuru: "P94", tabanMin: 68, tabanMax: 85 },
  { id: "o-teknisyen", ad: "Teknisyen (Meslek Lisesi - Elektrik/Makine/Bilişim)", duzey: "ortaogretim", puanTuru: "P94", tabanMin: 69, tabanMax: 82, aciklama: "Alan mezuniyeti gerektirdiği için puanlar düşebilir." },
  { id: "o-guvenlik", ad: "Koruma ve Güvenlik Görevlisi (Lise)", duzey: "ortaogretim", puanTuru: "P94", tabanMin: 72, tabanMax: 84 },
  { id: "o-sofor", ad: "Şoför (Lise Mezunu + Ehliyet)", duzey: "ortaogretim", puanTuru: "P94", tabanMin: 72, tabanMax: 88 },
  { id: "o-ikm", ad: "İnfaz Koruma Memuru (İKM - Lise)", duzey: "ortaogretim", puanTuru: "P94", tabanMin: 74, tabanMax: 85 },
  { id: "o-zabita", ad: "Zabıta Memuru (Lise)", duzey: "ortaogretim", puanTuru: "P94", tabanMin: 80, tabanMax: 92 },
  { id: "o-asci", ad: "Aşçı / Kaloriferci", duzey: "ortaogretim", puanTuru: "P94", tabanMin: 70, tabanMax: 82 },
  { id: "o-saglik-tek", ad: "Sağlık Teknisyeni / Hemşire (Sağlık Meslek Lisesi)", duzey: "ortaogretim", puanTuru: "P94", tabanMin: 72, tabanMax: 84 },
  { id: "o-bekci", ad: "Çarşı ve Mahalle Bekçisi (Lise)", duzey: "ortaogretim", puanTuru: "P94", tabanMin: 82, tabanMax: 94 },
];