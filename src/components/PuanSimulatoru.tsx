import { useMemo, useState } from "react";
import { branslar, duzeyler, type OgrenimDuzeyi } from "@/data/kpss";

type Durum = "yuksek" | "orta" | "dusuk";
type Mod = "net" | "puan";

interface SonucDetay {
  deger: number;
  durum?: Durum;
  hesaplananNet?: {
    gy: number;
    gk: number;
    toplam: number;
  };
}

export function PuanSimulatoru() {
  const [mod, setMod] = useState<Mod>("net");
  const [duzey, setDuzey] = useState<OgrenimDuzeyi>("lisans");

  const liste = useMemo(() => {
    return branslar.filter((b) => b.duzey === duzey);
  }, [duzey]);

  const [bransId, setBransId] = useState<string>("");
  const [puanInput, setPuanInput] = useState("");

  // Net hesaplama state'leri
  const [gyDogru, setGyDogru] = useState("");
  const [gyYanlis, setGyYanlis] = useState("");
  const [gkDogru, setGkDogru] = useState("");
  const [gkYanlis, setGkYanlis] = useState("");

  const [sonuc, setSonuc] = useState<SonucDetay | null>(null);
  const [hata, setHata] = useState<string | null>(null);

  // Puan modunda seçili branş
  const brans = useMemo(() => {
    if (bransId) return branslar.find((b) => b.id === bransId);
    return liste[0];
  }, [bransId, liste]);

  const duzeyBilgi = duzeyler.find((d) => d.id === duzey)!;

  function duzeySec(id: OgrenimDuzeyi) {
    setDuzey(id);
    setBransId("");
    setSonuc(null);
    setHata(null);
  }

  function hesapla() {
    setHata(null);
    let hesaplananPuan = 0;
    let netDetay: { gy: number; gk: number; toplam: number } | undefined;
    let durum: Durum | undefined;

    if (mod === "puan") {
      const deger = Number(puanInput.replace(",", "."));
      if (isNaN(deger) || deger <= 0 || deger > 100) {
        setHata("Lütfen 0 ile 100 arasında geçerli bir KPSS puanı girin.");
        setSonuc(null);
        return;
      }
      hesaplananPuan = deger;

      if (brans) {
        if (hesaplananPuan >= brans.tabanMax) {
          durum = "yuksek";
        } else if (hesaplananPuan >= brans.tabanMin) {
          durum = "orta";
        } else {
          durum = "dusuk";
        }
      }
    } else {
      // Net Hesaplama Modu
      const gyD = Math.min(60, Math.max(0, Number(gyDogru) || 0));
      const gyY = Math.min(60, Math.max(0, Number(gyYanlis) || 0));
      const gkD = Math.min(60, Math.max(0, Number(gkDogru) || 0));
      const gkY = Math.min(60, Math.max(0, Number(gkYanlis) || 0));

      if (gyD + gyY > 60) {
        setHata("Genel Yetenek doğru ve yanlış toplamı 60'ı geçemez.");
        setSonuc(null);
        return;
      }
      if (gkD + gkY > 60) {
        setHata("Genel Kültür doğru ve yanlış toplamı 60'ı geçemez.");
        setSonuc(null);
        return;
      }

      const gyNet = Math.max(0, gyD - gyY / 4);
      const gkNet = Math.max(0, gkD - gkY / 4);
      const toplamNet = gyNet + gkNet;

      if (toplamNet === 0) {
        setHata("Hesaplama yapabilmek için en az 1 doğru girmelisiniz.");
        setSonuc(null);
        return;
      }

      // Öğrenim Düzeyine Göre Dinamik KPSS Katsayı Mimarisi
      let taban = 45.16366;
      let gyCarpan = 0.535;
      let gkCarpan = 0.525;

      if (duzey === "onlisans") {
        taban = 45.10122;
        gyCarpan = 0.530;
        gkCarpan = 0.525;
      } else if (duzey === "ortaogretim") {
        taban = 45.11635;
        gyCarpan = 0.530;
        gkCarpan = 0.525;
      }

      const hamPuan = taban + gyNet * gyCarpan + gkNet * gkCarpan;
      hesaplananPuan = Math.min(100, Math.max(0, hamPuan));
      netDetay = { gy: gyNet, gk: gkNet, toplam: toplamNet };
    }

    setSonuc({
      deger: hesaplananPuan,
      ...(durum ? { durum } : {}),
      ...(netDetay ? { hesaplananNet: netDetay } : {}),
    });
  }

  // Ölçek göstergesi
  const olcekMin = mod === "puan" && brans ? Math.max(0, brans.tabanMin - 10) : 50;
  const olcekMax = mod === "puan" && brans ? Math.min(100, brans.tabanMax + 6) : 100;
  const yuzde = (v: number) =>
    Math.min(100, Math.max(0, ((v - olcekMin) / (olcekMax - olcekMin)) * 100));

  const durumMetni: Record<Durum, { baslik: string; aciklama: string; sinif: string }> = {
    yuksek: {
      baslik: "Atanma ihtimali çok yüksek",
      aciklama: "Puanınız geçmiş yıl tavan puanının üzerinde; ilk tercihlerinizde bile şansınız güçlü.",
      sinif: "bg-accent text-accent-foreground",
    },
    orta: {
      baslik: "Atanma şansınız var",
      aciklama: "Puanınız taban–tavan aralığında. Doğu ve taşra kadrolarını tercih listenize eklemek şansınızı artırır.",
      sinif: "bg-card text-card-foreground border border-border",
    },
    dusuk: {
      baslik: "Taban puanın altında",
      aciklama: "Geçmiş yıl verilerine göre zorlu görünüyor. Kontenjanı yüksek kurumlara ve taşra kadrolarına yönelin.",
      sinif: "bg-ink text-ink-foreground",
    },
  };

  return (
    <section className="rounded-3xl bg-card border border-border p-5 text-card-foreground shadow-sm">
      {/* Üst Başlık & Mod Seçimi */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-display text-xl font-bold">Atama Simülatörü</p>
          <p className="text-xs text-muted-foreground">
            {mod === "net" ? "Netlerini gir, tahmini KPSS puanını hesapla" : "Puanını ve branşını seçip durumunu gör"}
          </p>
        </div>

        <div className="flex rounded-2xl bg-muted p-1 text-xs shrink-0">
          <button
            onClick={() => { setMod("net"); setSonuc(null); setHata(null); }}
            className={`rounded-xl px-2.5 py-1.5 font-semibold transition ${
              mod === "net" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Net Hesapla
          </button>
          <button
            onClick={() => { setMod("puan"); setSonuc(null); setHata(null); }}
            className={`rounded-xl px-2.5 py-1.5 font-semibold transition ${
              mod === "puan" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Puanım Var
          </button>
        </div>
      </div>

      {/* 1. Öğrenim Düzeyi */}
      <p className="mt-4 text-xs font-semibold text-muted-foreground">Öğrenim Düzeyi</p>
      <div className="mt-1 grid grid-cols-3 gap-1 rounded-2xl bg-muted p-1">
        {duzeyler.map((d) => (
          <button
            key={d.id}
            onClick={() => duzeySec(d.id as OgrenimDuzeyi)}
            className={`rounded-xl px-1 py-2 text-xs font-semibold transition ${
              duzey === d.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {d.ad}
          </button>
        ))}
      </div>

      {/* MOD: PUANIM VAR -> 2. Branş Seçimi & 3. Puan Gir */}
      {mod === "puan" && (
        <>
          <div className="mt-3">
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              2. Branş / Bölüm Seçin
            </label>
            <select
              value={brans?.id || ""}
              onChange={(e) => {
                setBransId(e.target.value);
                setSonuc(null);
              }}
              className="w-full rounded-2xl bg-muted px-4 py-3 text-xs text-foreground outline-none border border-border focus:border-accent cursor-pointer"
            >
              {liste.map((b) => (
                <option
                  key={b.id}
                  value={b.id}
                  className="bg-popover text-popover-foreground dark:bg-slate-900 dark:text-slate-100"
                >
                  {b.ad}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              3. KPSS Puanın ({brans?.puanTuru || "P3"})
            </label>
            <div className="flex gap-2">
              <input
                inputMode="decimal"
                value={puanInput}
                onChange={(e) => setPuanInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && hesapla()}
                placeholder="Örn: 78.45"
                className="min-w-0 flex-1 rounded-2xl bg-muted px-4 py-3 text-sm text-foreground outline-none border border-border placeholder:text-muted-foreground/50"
              />
              <button
                onClick={hesapla}
                className="rounded-2xl bg-accent px-5 text-sm font-bold text-accent-foreground hover:opacity-90 transition"
              >
                Hesapla
              </button>
            </div>
          </div>
        </>
      )}

      {/* MOD: NET HESAPLA -> 2. Doğru ve Yanlış Sayıları */}
      {mod === "net" && (
        <div className="mt-3">
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            2. Doğru ve Yanlış Sayıları
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-muted p-2.5">
              <p className="text-[11px] font-bold mb-1.5 opacity-90">Genel Yetenek (60)</p>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="60"
                  placeholder="Doğru"
                  value={gyDogru}
                  onChange={(e) => setGyDogru(e.target.value)}
                  className="w-full rounded-xl bg-background border border-border px-2.5 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground/50"
                />
                <input
                  type="number"
                  min="0"
                  max="60"
                  placeholder="Yanlış"
                  value={gyYanlis}
                  onChange={(e) => setGyYanlis(e.target.value)}
                  className="w-full rounded-xl bg-background border border-border px-2.5 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-muted p-2.5">
              <p className="text-[11px] font-bold mb-1.5 opacity-90">Genel Kültür (60)</p>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="60"
                  placeholder="Doğru"
                  value={gkDogru}
                  onChange={(e) => setGkDogru(e.target.value)}
                  className="w-full rounded-xl bg-background border border-border px-2.5 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground/50"
                />
                <input
                  type="number"
                  min="0"
                  max="60"
                  placeholder="Yanlış"
                  value={gkYanlis}
                  onChange={(e) => setGkYanlis(e.target.value)}
                  className="w-full rounded-xl bg-background border border-border px-2.5 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground/50"
                />
              </div>
            </div>
          </div>

          <button
            onClick={hesapla}
            className="mt-2.5 w-full rounded-2xl bg-accent py-3 text-sm font-bold text-accent-foreground hover:opacity-90 transition"
          >
            Net & Puan Hesapla
          </button>
        </div>
      )}

      {hata && <p className="mt-2 text-xs font-semibold text-amber-500">{hata}</p>}

      {/* Sonuç Kartı */}
      {sonuc && (
        <div className="mt-4 rounded-3xl bg-background border border-border p-4 text-foreground shadow-lg">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                {duzeyBilgi.ad} {mod === "puan" && brans ? `· ${brans.puanTuru}` : ""}
              </p>
              <p className="font-display text-base font-bold leading-snug">
                {mod === "puan" && brans ? brans.ad : "Hesaplanan Puanınız"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground font-semibold">2024 Sınavı Tahmini Puanı</p>
              <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 font-display text-base font-bold text-primary">
                {sonuc.deger.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Net detayları */}
          {sonuc.hesaplananNet && (
            <div className="mt-3 flex gap-2 text-center text-xs bg-muted/60 p-2 rounded-2xl">
              <div className="flex-1">
                <span className="block text-[10px] text-muted-foreground">GY Net</span>
                <span className="font-bold">{sonuc.hesaplananNet.gy.toFixed(2)}</span>
              </div>
              <div className="flex-1 border-x border-border">
                <span className="block text-[10px] text-muted-foreground">GK Net</span>
                <span className="font-bold">{sonuc.hesaplananNet.gk.toFixed(2)}</span>
              </div>
              <div className="flex-1">
                <span className="block text-[10px] text-muted-foreground font-semibold text-primary">Toplam Net</span>
                <span className="font-bold text-primary">{sonuc.hesaplananNet.toplam.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Taban / Tavan Bilgileri & Slider (Sadece Puan modunda Branş seçiliyken) */}
          {mod === "puan" && brans && (
            <>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-muted p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground">Tahmini Taban</p>
                  <p className="font-display text-xl font-bold">{brans.tabanMin.toFixed(2)}</p>
                </div>
                <div className="rounded-2xl bg-muted p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground">Tahmini Tavan</p>
                  <p className="font-display text-xl font-bold">{brans.tabanMax.toFixed(2)}</p>
                </div>
              </div>

              <div className="relative mt-4 h-3 rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 rounded-full bg-primary/30"
                  style={{
                    left: `${yuzde(brans.tabanMin)}%`,
                    width: `${yuzde(brans.tabanMax) - yuzde(brans.tabanMin)}%`,
                  }}
                />
                <div
                  className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-card bg-accent"
                  style={{ left: `${yuzde(sonuc.deger)}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>{olcekMin.toFixed(0)}</span>
                <span>Atama Aralığı</span>
                <span>{olcekMax.toFixed(0)}</span>
              </div>
            </>
          )}

          {/* Durum Mesaj Kartı */}
          {sonuc.durum && (
            <div className={`mt-4 rounded-2xl p-3 ${durumMetni[sonuc.durum].sinif}`}>
              <p className="font-display text-sm font-bold">{durumMetni[sonuc.durum].baslik}</p>
              <p className="mt-1 text-xs leading-relaxed opacity-80">
                {durumMetni[sonuc.durum].aciklama}
              </p>
            </div>
          )}
        </div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        Puan ve net hesaplamaları 2024 KPSS sınav katsayılarına dayalı tahminlerdir; resmî sonuç yerine geçmez.
      </p>
    </section>
  );
}