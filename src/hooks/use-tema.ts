import { useCallback, useEffect, useState } from "react";

export type Tema = "acik" | "koyu";

const DEPO_ANAHTARI = "kpss-tema";

export function useTema() {
  const [tema, setTema] = useState<Tema>("acik");

  useEffect(() => {
    const kayitli = window.localStorage.getItem(DEPO_ANAHTARI) as Tema | null;
    const sistemKoyu = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const baslangic: Tema = kayitli ?? (sistemKoyu ? "koyu" : "acik");
    setTema(baslangic);
    document.documentElement.classList.toggle("dark", baslangic === "koyu");
  }, []);

  const temaDegistir = useCallback(() => {
    setTema((onceki) => {
      const yeni: Tema = onceki === "koyu" ? "acik" : "koyu";
      document.documentElement.classList.toggle("dark", yeni === "koyu");
      window.localStorage.setItem(DEPO_ANAHTARI, yeni);
      return yeni;
    });
  }, []);

  return { tema, temaDegistir };
}
