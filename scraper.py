import sys
import requests
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from supabase import create_client


# =========================================================
# SUPABASE AYARLARI
# =========================================================

SUPABASE_URL = "https://coyfbgutmjqsqjbptbbj.supabase.co"

SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNveWZiZ3V0bWpxc3FqYnB0YmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NTE5MzEsImV4cCI6MjEwNjQyNzkzMX0.ciAm14nI7G7RVkD31WsNJoP3Xo3HyFYBecL0ykNwSjM"

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


# =========================================================
# ÖSYM AYARLARI
# =========================================================

OSYM_URL = "https://www.osym.gov.tr/Duyurular/Index"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,"
        "application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
    ),
    "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
}


# =========================================================
# ARANACAK KELİMELER
# =========================================================

ANAHTARLAR = [
    "kpss",
    "atama",
    "atama",
    "yerleştirme",
    "yerlestirme",
    "tercih",
    "kadro",
    "pozisyon",
    "personel",
    "memur",
    "sözleşmeli",
    "sozlesmeli",
    "merkezi yerleştirme",
    "merkezi yerlestirme",
]


# =========================================================
# İSTENMEYEN DUYURULAR
# =========================================================

HARIC_TUT = [
    "sınava giriş belgesi",
    "sinava giris belgesi",
    "cevap kağıdı",
    "cevap kagidi",
    "soru kitapçığı",
    "soru kitapcigi",
]


# =========================================================
# TÜRKÇE KÜÇÜLTME
# =========================================================

def tr_kucult(metin):

    if not metin:
        return ""

    return (
        metin
        .replace("İ", "i")
        .replace("I", "ı")
        .replace("Ğ", "ğ")
        .replace("Ü", "ü")
        .replace("Ş", "ş")
        .replace("Ö", "ö")
        .replace("Ç", "ç")
        .lower()
    )


# =========================================================
# ÖSYM SAYFASINI ÇEK
# =========================================================

def osym_sayfasini_getir():

    print("\nÖSYM sayfasına bağlanılıyor...")

    try:

        session = requests.Session()

        response = session.get(
            OSYM_URL,
            headers=HEADERS,
            timeout=30,
            allow_redirects=True
        )

        print(
            f"HTTP DURUMU: {response.status_code}"
        )

        print(
            f"GERÇEK URL: {response.url}"
        )

        response.raise_for_status()

        response.encoding = response.apparent_encoding

        return response.text

    except requests.exceptions.Timeout:

        print("HATA: ÖSYM bağlantısı zaman aşımına uğradı.")

    except requests.exceptions.ConnectionError:

        print("HATA: ÖSYM sunucusuna bağlanılamadı.")

    except requests.exceptions.HTTPError as hata:

        print(f"HATA: ÖSYM HTTP hatası: {hata}")

    except requests.exceptions.RequestException as hata:

        print(f"HATA: ÖSYM bağlantı hatası: {hata}")

    return None


# =========================================================
# DUYURULARI BUL
# =========================================================

def duyurulari_ayikla(html):

    soup = BeautifulSoup(html, "html.parser")

    duyurular = []
    gorulen_linkler = set()

    print("\nÖSYM duyuruları taranıyor...")

    for a in soup.find_all("a", href=True):

        href = a.get("href", "").strip()

        if not href:
            continue

        # Gereksiz linkleri atla
        if href.startswith("#"):
            continue

        if href.lower().startswith("javascript:"):
            continue

        # Linki tam URL yap
        link = urljoin(OSYM_URL, href)

        # Sadece ÖSYM linklerini kabul et
        if "osym.gov.tr" not in link.lower():
            continue

        # Aynı linki ikinci kez alma
        if link in gorulen_linkler:
            continue

        # Başlığı al
        baslik = a.get_text(
            " ",
            strip=True
        )

        # Yazı yoksa title kullan
        if not baslik:

            baslik = a.get(
                "title",
                ""
            ).strip()

        baslik = " ".join(
            baslik.split()
        )

        # Çok kısa başlıkları alma
        if len(baslik) < 10:
            continue

        baslik_kucuk = tr_kucult(baslik)

        # İstenmeyen duyuruları çıkar
        if any(
            kelime in baslik_kucuk
            for kelime in HARIC_TUT
        ):
            continue

        # KPSS / atama / tercih vb. var mı?
        uygun = any(
            kelime in baslik_kucuk
            for kelime in ANAHTARLAR
        )

        if not uygun:
            continue

        gorulen_linkler.add(link)

        duyuru = {
            "baslik": baslik,
            "ozet": (
                "ÖSYM tarafından yayımlanan resmi duyuru. "
                "Detaylar için ÖSYM kaynağını inceleyiniz."
            ),
            "kaynak_url": link,
            "kategori": "KPSS",
        }

        duyurular.append(duyuru)

    return duyurular


# =========================================================
# SUPABASE'DEKİ KAYITLARI KONTROL ET
# =========================================================

def mevcut_linkleri_getir():

    print("\nSupabase kontrol ediliyor...")

    try:

        response = (
            supabase
            .table("haberler")
            .select("kaynak_url")
            .execute()
        )

        mevcut_linkler = set()

        for satir in response.data or []:

            link = satir.get("kaynak_url")

            if link:
                mevcut_linkler.add(link)

        print(
            f"Supabase'de {len(mevcut_linkler)} mevcut duyuru bulundu."
        )

        return mevcut_linkler

    except Exception as hata:

        print(
            "\nSUPABASE OKUMA HATASI:"
        )

        print(hata)

        return None


# =========================================================
# SADECE YENİ DUYURULARI BUL
# =========================================================

def yeni_duyurulari_bul(duyurular):

    mevcut_linkler = mevcut_linkleri_getir()

    # Supabase okunamadıysa yanlışlıkla
    # bütün duyuruları yeni olarak eklemeyelim.
    if mevcut_linkler is None:

        print(
            "Supabase kontrol edilemedi. "
            "Yeni kayıt eklenmeyecek."
        )

        return []

    yeni = []

    for duyuru in duyurular:

        if duyuru["kaynak_url"] not in mevcut_linkler:

            yeni.append(duyuru)

    return yeni


# =========================================================
# SUPABASE'E KAYDET
# =========================================================

def supabase_kaydet(yeni_duyurular):

    if not yeni_duyurular:

        print(
            "\nYeni duyuru yok."
        )

        return

    print(
        f"\n{len(yeni_duyurular)} yeni duyuru Supabase'e ekleniyor..."
    )

    eklenen_sayi = 0

    for duyuru in yeni_duyurular:

        try:

            response = (
                supabase
                .table("haberler")
                .insert(duyuru)
                .execute()
            )

            if response.data:

                eklenen_sayi += 1

                print(
                    f"\n✓ EKLENDİ:"
                )

                print(
                    f"  {duyuru['baslik']}"
                )

                print(
                    f"  {duyuru['kaynak_url']}"
                )

        except Exception as hata:

            print(
                f"\n✗ KAYIT HATASI:"
            )

            print(
                f"  {duyuru['baslik']}"
            )

            print(
                f"  {hata}"
            )

    print(
        f"\nToplam {eklenen_sayi} yeni duyuru eklendi."
    )


# =========================================================
# DEBUG DOSYASI
# =========================================================

def debug_kaydet(html):

    try:

        with open(
            "osym_debug.html",
            "w",
            encoding="utf-8"
        ) as dosya:

            dosya.write(html)

        print(
            "\nÖSYM HTML dosyası kaydedildi:"
        )

        print(
            "osym_debug.html"
        )

    except Exception as hata:

        print(
            f"Debug dosyası oluşturulamadı: {hata}"
        )


# =========================================================
# ANA PROGRAM
# =========================================================

def main():

    print("=" * 60)
    print("ÖSYM KPSS ATAMA DUYURU BOTU")
    print("=" * 60)

    # -----------------------------------------------------
    # 1. ÖSYM'den sayfayı al
    # -----------------------------------------------------

    html = osym_sayfasini_getir()

    if not html:

        print(
            "\nÖSYM sayfasına erişilemedi."
        )

        sys.exit(1)

    print(
        f"\nHTML başarıyla alındı."
    )

    print(
        f"HTML boyutu: {len(html):,} karakter"
    )

    # -----------------------------------------------------
    # 2. Duyuruları tara
    # -----------------------------------------------------

    duyurular = duyurulari_ayikla(html)

    print(
        f"\nFiltreye uyan duyuru sayısı: {len(duyurular)}"
    )

    # -----------------------------------------------------
    # 3. Bulunan duyuruları göster
    # -----------------------------------------------------

    if duyurular:

        print("\nBULUNAN DUYURULAR:")

        print("-" * 60)

        for i, duyuru in enumerate(
            duyurular,
            start=1
        ):

            print(
                f"{i}. {duyuru['baslik']}"
            )

            print(
                f"   {duyuru['kaynak_url']}"
            )

    else:

        print(
            "\nKPSS / atama ile ilgili duyuru bulunamadı."
        )

        debug_kaydet(html)

        return

    # -----------------------------------------------------
    # 4. Daha önce eklenenleri kontrol et
    # -----------------------------------------------------

    yeni = yeni_duyurulari_bul(
        duyurular
    )

    print(
        f"\nYENİ DUYURU SAYISI: {len(yeni)}"
    )

    # -----------------------------------------------------
    # 5. Yeni duyuruları Supabase'e ekle
    # -----------------------------------------------------

    if yeni:

        supabase_kaydet(
            yeni
        )

    else:

        print(
            "\n✓ Yeni duyuru bulunmadı."
        )

        print(
            "Supabase'deki kayıtların hepsi zaten mevcut."
        )

    print(
        "\n" + "=" * 60
    )

    print(
        "BOT TAMAMLANDI"
    )

    print(
        "=" * 60
    )


# =========================================================
# PROGRAMI BAŞLAT
# =========================================================

if __name__ == "__main__":

    main()