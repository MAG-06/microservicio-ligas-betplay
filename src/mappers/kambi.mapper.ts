import type { KambiGroup, KambiGroupTree } from "../types/kambi.types";
import type { Liga, TipoLiga } from "../types/dominio";

const JUVENIL = ["reserve", "u23", "u21", "u20", "u19", "under 2", "sub-2", "juvenil"];
const FEMENINO = ["(w)", "women", "(f)", "femenin"];

export function clasificar(...nombres: string[]): TipoLiga {
  const t = nombres.join(" ").toLowerCase();
  if (JUVENIL.some((x) => t.includes(x))) return "juvenil_reservas";
  if (FEMENINO.some((x) => t.includes(x))) return "femenino";
  return "normal";
}

function crearLiga(
  g: KambiGroup,
  ruta: string[],
  pais: string | null,
  tipoPadre: TipoLiga | null,
): Liga {
  const ruta4 = [...ruta, "all", "all", "all", "all"].slice(0, 4);
  return {
    id: g.id,
    nombre: g.name,
    pais,
    tipo: tipoPadre ?? clasificar(g.name, g.englishName ?? "", pais ?? ""),
    partidos: g.eventCount ?? 0,
    ruta: ruta4.join("/"),
  };
}

export function aplanarLigas(tree: KambiGroupTree): Liga[] {
  const futbol = tree.group.groups.find((g) => g.termKey === "football");
  if (!futbol) return [];

  const ligas: Liga[] = [];
  for (const g of futbol.groups ?? []) {
    const tk = g.termKey;
    let tipoPadre: TipoLiga | null =
      tk === "esports_football" ? "esports" : tk === "specials" ? "especiales" : null;

    if (!tipoPadre) {
      const c = clasificar(g.name, g.englishName ?? "");
      tipoPadre = c !== "normal" ? c : null;
    }

    if (g.groups?.length) {
      for (const h of g.groups) {
        ligas.push(crearLiga(h, ["football", tk, h.termKey], g.name, tipoPadre));
      }
    } else {
      ligas.push(crearLiga(g, ["football", tk], null, tipoPadre));
    }
  }
  return ligas;
}
