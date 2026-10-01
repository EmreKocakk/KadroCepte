import { useState } from "react";

type Cihaz = "ios" | "android";

export function KurulumRehberi({ kapat }: { kapat: () => void }) {
  const [cihaz, setCihaz] = useState<Cihaz>("ios");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-0 sm:items-center sm:p-4"
      onClick={kapat}
      role="presentation"
    >
      <div
        className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card p-5 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Uygulamayı telefona yükleme rehberi"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-lg font-bold">Uygulamayı Telefona Yükle</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ana ekrana ekleyip atama bildirimlerini kaçırmayın.
            </p>
          </div>
          <button
            onClick={kapat}
            className="shrink-0 rounded-full bg-muted px-3 py-1.5 text-sm font-semibold"
          >
            Kapat
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
          <button
            onClick={() => setCihaz("ios")}
            className={`rounded-xl py-2 text-sm font-semibold ${
              cihaz === "ios" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
            }`}
          >
            iPhone (Safari)
          </button>
          <button
            onClick={() => setCihaz("android")}
            className={`rounded-xl py-2 text-sm font-semibold ${
              cihaz === "android" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
            }`}
          >
            Android (Chrome)
          </button>
        </div>

        <ol className="mt-4 space-y-3">
          {(cihaz === "ios"
            ? [
                "Safari tarayıcısında bu sayfayı açın.",
                "Ekranın altındaki Paylaş simgesine dokunun.",
                "Listeden “Ana Ekrana Ekle” seçeneğini seçin.",
                "Sağ üstteki “Ekle” butonuna dokunun.",
                "Uygulama artık ana ekranınızda, oradan açabilirsiniz.",
              ]
            : [
                "Chrome tarayıcısında bu sayfayı açın.",
                "Sağ üstteki üç nokta menüsüne dokunun.",
                "“Uygulamayı yükle” veya “Ana ekrana ekle” seçeneğine dokunun.",
                "Açılan pencerede “Yükle” butonunu onaylayın.",
                "Bildirim izni sorulursa “İzin Ver” deyin.",
              ]
          ).map((adim, i) => (
            <li key={adim} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed">{adim}</span>
            </li>
          ))}
        </ol>

        <p className="mt-4 rounded-2xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
          Not: Uygulama çevrimdışı önbellek desteklidir; internet olmadığında da son
          görüntülenen haberlere erişebilirsiniz.
        </p>
      </div>
    </div>
  );
}
