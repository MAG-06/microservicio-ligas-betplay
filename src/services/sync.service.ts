import { getArbolLigas } from "../clients/kambi.client";
import { supabase } from "../clients/supabase.client";
import { aplanarLigas } from "../mappers/kambi.mapper";

export async function sincronizarLigas() {
  const tree = await getArbolLigas();
  const ligas = aplanarLigas(tree);

  const rows = ligas.map((l) => ({
    id: l.id,
    nombre: l.nombre,
    pais: l.pais,
    tipo: l.tipo,
    partidos: l.partidos,
    url: l.ruta,
  }));

  const { error } = await supabase
    .from("ligas_betplay")
    .upsert(rows, { onConflict: "id" });

  if (error) throw error;

  return { sincronizadas: rows.length };
}
