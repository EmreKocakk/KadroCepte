// Tek kayıt noktası: Service worker yalnızca yayınlanmış sitede kaydedilir.
// Lovable önizleme / geliştirme ortamlarında kayıt yapılmaz ve varsa eski
// kayıtlar temizlenir.

const SW_URL = "/sw.js";

function kayitYapilabilirMi(): boolean {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return false;
  if (!import.meta.env.PROD) return false;
  if (window.self !== window.top) return false;
  if (new URL(window.location.href).searchParams.get("sw") === "off") return false;

  const host = window.location.hostname;
  if (host.startsWith("id-preview--") || host.startsWith("preview--")) return false;
  if (host === "lovableproject.com" || host.endsWith(".lovableproject.com")) return false;
  if (host === "lovableproject-dev.com" || host.endsWith(".lovableproject-dev.com")) return false;
  if (host === "beta.lovable.dev" || host.endsWith(".beta.lovable.dev")) return false;

  return true;
}

async function eskiKayitlariTemizle() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  const kayitlar = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    kayitlar
      .filter((k) => (k.active?.scriptURL ?? k.installing?.scriptURL ?? "").endsWith(SW_URL))
      .map((k) => k.unregister()),
  );
}

export function serviceWorkerKaydet() {
  if (!kayitYapilabilirMi()) {
    void eskiKayitlariTemizle();
    return;
  }
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register(SW_URL, { scope: "/" });
  });
}
