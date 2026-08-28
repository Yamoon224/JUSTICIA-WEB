"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useEstSombre } from "@/lib/theme";

/**
 * Rampe catégorielle (identité) validée CVD-safe par /dataviz — la palette
 * de marque (seal/gold/forest/rust) n'a que 4 teintes et échoue le
 * validateur (chroma trop faible sur --forest, --gold et --seal trop
 * proches en vision protan). Cette rampe à 8 teintes n'est utilisée que
 * pour l'identité de séries dans un donut ; le reste de l'appli continue de
 * référencer uniquement les jetons de marque.
 */
const RAMPE_CATEGORIELLE = {
  light: ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"],
  dark: ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9", "#e66767"],
};

const COULEUR_NEUTRE = { light: "#c3c2b7", dark: "#383835" };

function useJetons() {
  const sombre = useEstSombre();
  return {
    sombre,
    seal: sombre ? "#4ade80" : "#157347",
    ink: sombre ? "#eef4f0" : "#171a18",
    inkSoft: sombre ? "#a9b6ae" : "#5b625d",
    inkFaint: sombre ? "#6d7972" : "#93998f",
    ligne: sombre ? "#263029" : "#e2e8e3",
    paperRaised: sombre ? "#161f1a" : "#ffffff",
    categoriel: sombre ? RAMPE_CATEGORIELLE.dark : RAMPE_CATEGORIELLE.light,
    neutre: sombre ? COULEUR_NEUTRE.dark : COULEUR_NEUTRE.light,
  };
}

function InfoBulle({
  active,
  payload,
  unite,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: unknown; payload?: { label: string } }>;
  unite?: string;
}) {
  const jetons = useJetons();
  if (!active || !payload?.length) return null;
  const item = payload[0];

  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-[var(--shadow-card)]"
      style={{ background: jetons.paperRaised, borderColor: jetons.ligne, color: jetons.ink }}
    >
      <div className="font-medium">{item.payload?.label}</div>
      <div style={{ color: jetons.inkSoft }}>
        {String(item.value)} {unite}
      </div>
    </div>
  );
}

/**
 * Comparaison d'une métrique unique sur plusieurs catégories ordonnées (une
 * seule série : une seule teinte de marque suffit, la couleur n'encode pas
 * l'identité ici — la position/l'étiquette le fait déjà).
 */
export function BarChartCard({
  donnees,
  hauteur = 220,
}: {
  donnees: { label: string; valeur: number }[];
  hauteur?: number;
}) {
  const jetons = useJetons();

  if (donnees.length === 0) {
    return <p className="text-sm text-ink-faint">Aucune donnée.</p>;
  }

  return (
    <div style={{ width: "100%", height: hauteur }}>
      <ResponsiveContainer>
        <BarChart data={donnees} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 0 }} barSize={10}>
          <CartesianGrid horizontal={false} stroke={jetons.ligne} />
          <XAxis type="number" allowDecimals={false} tick={{ fill: jetons.inkFaint, fontSize: 11 }} axisLine={{ stroke: jetons.ligne }} tickLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            width={128}
            tick={{ fill: jetons.inkSoft, fontSize: 11.5 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip cursor={{ fill: jetons.ligne, opacity: 0.5 }} content={(props) => <InfoBulle {...props} />} />
          <Bar dataKey="valeur" fill={jetons.seal} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Répartition d'un total en parts (identité de série : la rampe
 * catégorielle validée CVD-safe, jamais les teintes de marque). Légende
 * directe sous le donut — jamais la couleur seule pour distinguer les
 * parts.
 */
export function PieChartCard({ donnees }: { donnees: { label: string; valeur: number }[] }) {
  const jetons = useJetons();

  if (donnees.length === 0) {
    return <p className="text-sm text-ink-faint">Aucune donnée.</p>;
  }

  const total = donnees.reduce((somme, item) => somme + item.valeur, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto h-36 w-36 shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={donnees}
              dataKey="valeur"
              nameKey="label"
              innerRadius="62%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
            >
              {donnees.map((entree, index) => (
                <Cell key={entree.label} fill={jetons.categoriel[index % jetons.categoriel.length]} />
              ))}
            </Pie>
            <Tooltip content={(props) => <InfoBulle {...props} unite="dossier(s)" />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="flex flex-col gap-1.5">
        {donnees.map((entree, index) => (
          <li key={entree.label} className="flex items-start justify-between gap-3 text-xs">
            <span className="flex items-start gap-2 text-ink-soft">
              <span
                className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: jetons.categoriel[index % jetons.categoriel.length] }}
                aria-hidden="true"
              />
              {entree.label}
            </span>
            <span className="shrink-0 font-medium text-ink">
              {entree.valeur} <span className="text-ink-faint">({Math.round((entree.valeur / total) * 100)}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
