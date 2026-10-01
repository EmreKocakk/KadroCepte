import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { type Haber } from "@/data/kpss";
import { Logo } from "@/components/Logo";
import { useTema } from "@/hooks/use-tema";
import { HaberDetay } from "@/components/HaberDetay";
import { KurulumRehberi } from "@/components/KurulumRehberi";
import { PuanSimulatoru } from "@/components/PuanSimulatoru";
import { Newspaper, Calculator, Download, Loader2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kadro Cepte — KPSS Atama Haberleri" },
      {
        name: "description",
        content:
          "Sağlık Bakanlığı, MEB, Adalet ve Emniyet atama duyurularını anında takip edin; KPSS puanınızı simüle edin.",
      },
      { property: "og:title", content: "Kadro Cepte — KPSS Atama Haberleri" },
      {
        property: "og:description",
        content:
          "Kurum bazlı KPSS atama duyuruları, kılavuz linkleri ve atama puanı simülatörü tek uygulamada.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnaSayfa,
});

type Sekme = "haberler" | "simulator";

const PAGE_SIZE = 10;

const AYLAR: Record<string, number> = {
  ocak: 0,
  şubat: 1,
  mart: 2,
  nisan: 3,
  mayıs: 4,
  haziran: 5,
  temmuz: 6,
  ağustos: 7,
  eylül: 8,
  ekim: 9,
  kasım: 10,
  aralık: 11,
};

// Hızlı arama için popüler kurum etiketleri
const HIZLI_ARAMALAR = ["Sağlık", "MEB", "Adalet", "Emniyet", "ÖSYM", "Diyanet", "Gençlik"];

function metindenTarihAyrıştır(h: Haber): number {
  const arananMetin = `${h.tarih || ""} ${h.baslik || ""}`;
  const match = arananMetin.match(/(\d{1,2})\s+([a-zA-ZçğıöşüÇĞİÖŞÜ]+)\s+(\d{4})/);

  if (!match || !match[1] || !match[2] || !match[3]) return 0;

  const gun = parseInt(match[1], 10);
  const ayAdi = match[2].toLocaleLowerCase("tr");
  const yil = parseInt(match[3], 10);

  const ayIndex = AYLAR[ayAdi] ?? 0;
  return new Date(yil, ayIndex, gun).getTime();
}

function kisaTarihFormatla(h: Haber): string {
  const ts = metindenTarihAyrıştır(h);
  if (ts > 0) {
    const d = new Date(ts);
    const gun = String(d.getDate()).padStart(2, "0");
    const ay = String(d.getMonth() + 1).padStart(2, "0");
    const yil = d.getFullYear();
    return `${gun}/${ay}/${yil}`;
  }
  return h.tarih || "";
}

function AnaSayfa() {
  const { tema, temaDegistir } = useTema();
  const [sekme, setSekme] = useState<Sekme>("haberler");
  const [arama, setArama] = useState("");
  const [detay, setDetay] = useState<Haber | null>(null);
  const [rehberAcik, setRehberAcik] = useState(false);
  const [telegramBilgi, setTelegramBilgi] = useState(false);

  const [tumHaberler, setTumHaberler] = useState<Haber[]>([]);
  const [loading, setLoading] = useState(true);
  const [aktifSayfa, setAktifSayfa] = useState(1);

  const handleAramaDegis = (val: string) => {
    setArama(val);
    setAktifSayfa(1);
    setSekme("haberler");
  };

  const sayfaDegistir = (yeniSayfa: number) => {
    setAktifSayfa(yeniSayfa);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    async function duyurulariGetir() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("haberler").select("*");

        if (error) {
          console.error("Duyurular çekilirken hata oluştu:", error.message);
        } else {
          setTumHaberler((data as Haber[]) || []);
        }
      } catch (err) {
        console.error("Beklenmeyen hata:", err);
      } finally {
        setLoading(false);
      }
    }

    if (sekme === "haberler") {
      duyurulariGetir();
    }
  }, [sekme]);

  // Filtrele ve Sırala
  const islenmisHaberler = useMemo(() => {
    let sonuc = [...tumHaberler];

    const q = arama.trim().toLocaleLowerCase("tr");
    if (q.length > 0) {
      sonuc = sonuc.filter(
        (h) =>
          h.baslik?.toLocaleLowerCase("tr").includes(q) ||
          h.kurum?.toLocaleLowerCase("tr").includes(q) ||
          h.ozet?.toLocaleLowerCase("tr").includes(q)
      );
    }

    sonuc.sort((a, b) => metindenTarihAyrıştır(b) - metindenTarihAyrıştır(a));

    return sonuc;
  }, [tumHaberler, arama]);

  const toplamKayit = islenmisHaberler.length;
  const toplamSayfa = Math.ceil(toplamKayit / PAGE_SIZE) || 1;

  const sayfaHaberleri = useMemo(() => {
    const start = (aktifSayfa - 1) * PAGE_SIZE;
    return islenmisHaberler.slice(start, start + PAGE_SIZE);
  }, [islenmisHaberler, aktifSayfa]);

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
          <div className="flex shrink-0 items-center gap-2">
            <Logo className="size-10" />
            <div className="leading-tight">
              <p className="font-display text-[15px] font-bold">Kadro Cepte</p>
              <p className="-mt-0.5 text-[11px] text-muted-foreground">KPSS Atama</p>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-2">
              <span className="text-sm text-muted-foreground">🔍</span>
              <input
                value={arama}
                onChange={(e) => handleAramaDegis(e.target.value)}
                type="text"
                placeholder="Kurum veya pozisyon ara"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {arama && (
                <button onClick={() => handleAramaDegis("")} className="text-muted-foreground hover:text-foreground">
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={temaDegistir}
            aria-label="Tema değiştir"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-lg text-ink-foreground"
          >
            {tema === "koyu" ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pb-28">
        {sekme === "haberler" && (
          <>
            <section className="pb-3 pt-5">
              <h1 className="font-display text-[32px] font-bold leading-[1.08] tracking-tight">
                Atama haberleri,
                <br />
                <span className="text-primary">tek yerde.</span>
              </h1>
              <p className="mt-2 text-xs text-muted-foreground">
                Anlık duyuruları takip edin, puanınızı simüle edin.
              </p>
            </section>

            {/* Hızlı Arama Etiketleri */}
            <section className="mb-4">
              <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
                {HIZLI_ARAMALAR.map((etiket) => {
                  const aktif = arama.toLocaleLowerCase("tr") === etiket.toLocaleLowerCase("tr");
                  return (
                    <button
                      key={etiket}
                      onClick={() => handleAramaDegis(aktif ? "" : etiket)}
                      className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                        aktif
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border border-border/70 bg-card text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      #{etiket}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {arama ? `"${arama}" İçin Sonuçlar` : "Güncel Duyurular"} ({toplamKayit})
                </p>
                {loading && <Loader2 className="size-4 animate-spin text-primary" />}
              </div>

              {loading && tumHaberler.length === 0 && (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 animate-pulse rounded-3xl bg-card/60" />
                  ))}
                </div>
              )}

              {!loading && islenmisHaberler.length === 0 && (
                <div className="rounded-3xl border border-border bg-card p-6 text-center">
                  <p className="text-sm font-semibold">Sonuç bulunamadı</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Aradığınız kelimeye uygun duyuru bulunmuyor.
                  </p>
                  {arama && (
                    <button
                      onClick={() => handleAramaDegis("")}
                      className="mt-3 rounded-xl bg-muted px-3 py-1.5 text-xs font-semibold text-primary"
                    >
                      Aramayı Temizle
                    </button>
                  )}
                </div>
              )}

              {sayfaHaberleri.map((h) => (
                <article
                  key={h.id}
                  onClick={() => setDetay(h)}
                  className="group relative cursor-pointer rounded-3xl border border-border/60 bg-card p-4 shadow-sm transition-all active:scale-[0.98] active:bg-muted/30"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-primary">
                        <Newspaper className="size-3" />
                        HABER
                      </span>

                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-foreground/80">
                        {h.kurum}
                      </span>

                      {h.yeni && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                          YENİ
                        </span>
                      )}
                    </div>

                    <span className="shrink-0 rounded-lg bg-muted/70 px-2.5 py-1 font-mono text-[11px] font-semibold text-muted-foreground">
                      {kisaTarihFormatla(h)}
                    </span>
                  </div>

                  <h3 className="mt-2.5 font-display text-[16px] font-bold leading-snug tracking-tight text-foreground">
                    {h.baslik}
                  </h3>

                  {h.ozet && (
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground/90">
                      {h.ozet}
                    </p>
                  )}

                  <div className="mt-3.5 flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-xs font-bold text-primary-foreground transition-opacity active:opacity-90">
                    <span className="tracking-wide">Duyuruyu ve Kılavuzu İncele</span>
                    <ChevronRight className="size-4 stroke-[2.5]" />
                  </div>
                </article>
              ))}

              {!loading && islenmisHaberler.length > 0 && toplamSayfa > 1 && (
                <div className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-sm">
                  <button
                    onClick={() => sayfaDegistir(aktifSayfa - 1)}
                    disabled={aktifSayfa === 1}
                    className="flex items-center gap-1 rounded-xl bg-muted px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80 disabled:opacity-30 disabled:hover:bg-muted"
                  >
                    <ChevronLeft className="size-4" />
                    Önceki
                  </button>

                  <span className="text-xs font-bold text-muted-foreground">
                    Sayfa <span className="text-foreground">{aktifSayfa}</span> / {toplamSayfa}
                  </span>

                  <button
                    onClick={() => sayfaDegistir(aktifSayfa + 1)}
                    disabled={aktifSayfa === toplamSayfa}
                    className="flex items-center gap-1 rounded-xl bg-muted px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80 disabled:opacity-30 disabled:hover:bg-muted"
                  >
                    Sonraki
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {sekme === "simulator" && (
          <div className="pt-5">
            <PuanSimulatoru />
          </div>
        )}

        <section className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent/15 text-2xl">
                ✈️
              </div>
              <div className="flex-1">
                <p className="font-display text-base font-bold">Telegram Kanalı</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Çok Yakında</p>
              </div>
            </div>
            <button
              onClick={() => setTelegramBilgi(true)}
              className="mt-4 w-full rounded-2xl bg-muted py-3 text-sm font-semibold text-muted-foreground"
            >
              Telegram Kanalı (Çok Yakında)
            </button>
            {telegramBilgi && (
              <p className="mt-3 rounded-2xl bg-accent/15 p-3 text-center text-xs font-semibold">
                🚀 Telegram kanalımız çok yakında yayında olacak!
              </p>
            )}
          </div>

          <div className="rounded-3xl bg-ink p-5 text-ink-foreground">
            <div className="flex items-center gap-3">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink-foreground/10 text-2xl">
                📲
              </div>
              <div className="flex-1">
                <p className="font-display text-base font-bold">Uygulamayı Yükle</p>
                <p className="mt-0.5 text-xs text-ink-foreground/60">
                  Ana ekrana ekle, bildirimleri aç.
                </p>
              </div>
            </div>
            <button
              onClick={() => setRehberAcik(true)}
              className="mt-4 w-full rounded-2xl bg-accent py-3 text-sm font-bold text-accent-foreground"
            >
              Uygulamayı Telefona Yükle / Bildirimleri Aç
            </button>
          </div>
        </section>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto grid max-w-md grid-cols-3">
          {[
            { id: "haberler", ad: "Haberler", Icon: Newspaper },
            { id: "simulator", ad: "Net & Atama", Icon: Calculator },
            { id: "yukle", ad: "Yükle", Icon: Download },
          ].map(({ id, ad, Icon }) => {
            const isActive = sekme === id;
            return (
              <button
                key={id}
                onClick={() => (id === "yukle" ? setRehberAcik(true) : setSekme(id as any))}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 transition-all ${
                  isActive
                    ? "text-primary font-bold scale-105"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className={`size-5 transition-transform ${
                    isActive ? "stroke-[2.5px]" : "stroke-[1.75px]"
                  }`}
                />
                <span className={`text-[11px] ${isActive ? "font-semibold" : "font-medium"}`}>
                  {ad}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {detay && <HaberDetay haber={detay} kapat={() => setDetay(null)} />}
      {rehberAcik && <KurulumRehberi kapat={() => setRehberAcik(false)} />}
    </div>
  );
}