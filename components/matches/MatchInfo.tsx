import type { MatchPost } from "@/types";

/** Plain scoreboard block — no team hub links. */
export function MatchInfo({ match }: { match: MatchPost }) {
  return (
    <section className="mb-8 border border-[var(--line)] bg-[var(--surface)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
            Home
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-xl">
            {match.team_home}
          </p>
        </div>
        <p className="font-[family-name:var(--font-display)] text-3xl tracking-wide">
          {match.score_home} – {match.score_away}
        </p>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
            Away
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-xl">
            {match.team_away || "—"}
          </p>
        </div>
      </div>
      {match.goalscorers.length > 0 && (
        <ul className="mt-4 space-y-1 border-t border-[var(--line)] pt-4 text-sm text-[var(--muted)]">
          {match.goalscorers.map((goal, index) => (
            <li key={`${goal.player}-${index}`}>
              {goal.player} {goal.time}&apos; (
              {goal.team === "home" ? match.team_home : match.team_away})
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
