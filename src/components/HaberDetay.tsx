import type { Haber } from "@/data/kpss";
import { X, ExternalLink, Newspaper, Calendar, Building2, FileText, Search, Info, CheckCircle2 } from "lucide-react";

const AYLAR: Record<string, number> = {
  ocak: 0, şubat: 1, mart: 2, nisan: 3, mayıs: 4, haziran: 5,
  temmuz: 6, ağustos: 7, eylül: 8, ekim: 9, kasım: 10, aralık: 11,
};

function tarihFormatla(tarihStr?: string, baslikStr?: string): string {
  const metin = `${tarihStr || ""} ${baslikStr || ""}`;
  const match = metin.match(/(\d{1,2})\s+([a-zA-ZçğıöşüÇĞİÖŞÜ]+)\s+(\d{4})/);
  
  if (match && match[1] && match[2] && match[3]) {
    const gun = match[1].padStart(2, "0");
    const ayIndex = AYLAR[match[2].toLocaleLowerCase("tr")];
    const ay = ayIndex !== undefined ? String(ayIndex + 1).padStart(2, "0") : "01";
    const yil = match[3];
    return `${gun}/${ay}/${yil}`;
  }
  return tarihStr || "Tarih Belirtilmedi";
}

export function HaberDetay({ haber, kapat }: { haber: Haber; kapat: () => void }) {
  const ozetMetni = haber.ozet?.trim();
  const detayMetni = haber.detay?.trim();

  // Detay metni özetten farklıysa ikisini de göster, değilse sadece detay/özet bas
  const ayriDetayVar = Boolean(detayMetni && detayMetni !== ozetMetni);
  const okumaMetni = detayMetni || ozetMetni || "Bu duyuru için henüz ek detay açıklaması girilmemiştir.";

  // Satırları ayır ve maddeli listeleri tespit et
  const satirlar = okumaMetni.split("\n").map((s) => s.trim()).filter(Boolean);

  const kilavuzVar = Boolean(haber.kilavuzUrl && typeof haber.kilavuzUrl === "string" && haber.kilavuzUrl.startsWith("http"));
  const gazeteVar = Boolean(haber.resmiGazeteUrl && typeof haber.resmiGazeteUrl === "string" && haber.resmiGazeteUrl.startsWith("http"));

  const sorguMetni = `${haber.kurum || ""} ${haber.baslik || ""} resmi duyurusu kılavuzu`;
  const aramaUrl = `https://www.google.com/search?q=${encodeURIComponent(sorguMetni)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity sm:items-center sm:p-4"
      onClick={kapat}
      role="presentation"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-[32px] bg-card p-5 shadow-2xl transition-transform sm:rounded-[32px] sm:p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={haber.baslik}
      >
        {/* Mobil Tutamaç Çubuğu */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted-foreground/20 sm:hidden" />

        {/* Üst Header: Rozetler ve Kapat */}
        <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-primary">
              <Newspaper className="size-3" />
              HABER DETAYI
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-[11px] font-extrabold uppercase text-foreground/80">
              <Building2 className="size-3 text-muted-foreground" />
              {haber.kurum}
            </span>
          </div>

          <button
            onClick={kapat}
            aria-label="Kapat"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-muted/80 text-muted-foreground transition-colors active:scale-95 active:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Başlık ve Tarih Bilgisi */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Calendar className="size-3.5 text-primary" />
            <span>Duyuru Tarihi: {tarihFormatla(haber.tarih, haber.baslik)}</span>
          </div>

          <h2 className="mt-2 font-display text-lg sm:text-xl font-bold leading-snug tracking-tight text-foreground">
            {haber.baslik}
          </h2>
        </div>

        {/* Varsa Kısa Özet Vurgu Kutusu */}
        {ayriDetayVar && ozetMetni && (
          <div className="mt-4 rounded-2xl bg-primary/5 border border-primary/20 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
              <Info className="size-4" />
              <span>Önemli Özet</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 font-medium">
              {ozetMetni}
            </p>
          </div>
        )}

        {/* Detay Metni & İçerik Alanı */}
        <div className="mt-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Açıklama & Detaylar
          </h3>

          <div className="rounded-2xl bg-muted/30 p-4 border border-border/50 space-y-2.5">
            {satirlar.map((satir, idx) => {
              // Liste elemanı mı? (- veya * veya • ile başlıyorsa)
              const isListItem = /^[-\*•]/.test(satir);
              const temizSatir = satir.replace(/^[-\*•]\s*/, "");

              if (isListItem) {
                return (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                    <span>{temizSatir}</span>
                  </div>
                );
              }

              return (
                <p key={idx} className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  {satir}
                </p>
              );
            })}
          </div>
        </div>

        {/* Alt Aksiyon & Kaynak Bağlantı Butonları */}
        <div className="mt-6 space-y-2.5">
          {kilavuzVar ? (
            <a
              href={haber.kilavuzUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-2xl bg-primary py-3.5 px-4 text-center text-xs sm:text-sm font-bold text-primary-foreground shadow-md transition-all active:scale-[0.98] active:opacity-90"
            >
              <ExternalLink className="size-4" />
              Resmî Duyuruyu ve Kılavuzu Aç
            </a>
          ) : (
            <a
              href={aramaUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-2xl bg-primary py-3.5 px-4 text-center text-xs sm:text-sm font-bold text-primary-foreground shadow-md transition-all active:scale-[0.98] active:opacity-90"
            >
              <Search className="size-4" />
              Resmî Kaynakta ve Google'da Ara
            </a>
          )}

          {gazeteVar && (
            <a
              href={haber.resmiGazeteUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-2xl border border-border/80 bg-card py-3 px-4 text-center text-xs sm:text-sm font-bold text-foreground transition-colors active:bg-muted"
            >
              <FileText className="size-4 text-muted-foreground" />
              Resmî Gazete İlan Metnini Gör
            </a>
          )}
        </div>
      </div>
    </div>
  );
}