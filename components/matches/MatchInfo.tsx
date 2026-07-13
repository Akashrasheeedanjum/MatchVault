import Link from "next/link";
import type { MatchPost } from "@/types";
import { teamSlug } from "@/lib/teams";

export function MatchInfo({ match }: { match: MatchPost }) {
  return (
    <section
      aria-label="Match statistics"
      className="mb-10 grid gap-6 border border-[var(--line)] bg-[var(--surface)] p-5 sm:grid-cols-3 sm:p-6"
    >
      <div className="sm:col-span-3">
        <div className="flex items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Home</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-xl sm:text-2xl">
              <Link
                href={`/teams/${teamSlug(match.team_home)}`}
                className="hover:text-[var(--pitch)]"
              >
                {match.team_home}
              </Link>
            </p>
          </div>
          <div className="text-center">
            <p className="font-[family-name:var(--font-display)] text-4xl text-[var(--pitch)] sm:text-5xl">
              {match.score_home}–{match.score_away}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">Full time</p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Away</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-xl sm:text-2xl">
              <Link
                href={`/teams/${teamSlug(match.team_away)}`}
                className="hover:text-[var(--pitch)]"
              >
                {match.team_away}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <StatBar
        label="Possession"
        home={match.possession.home}
        away={match.possession.away}
        suffix="%"
      />
      <StatBar
        label="Shots"
        home={match.shots.home}
        away={match.shots.away}
      />
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Goalscorers
        </p>
        <ul className="space-y-2 text-sm">
          {match.goalscorers.map((goal) => (
            <li key={`${goal.player}-${goal.time}`} className="flex justify-between gap-2">
              <span>
                {goal.player}{" "}
                <span className="text-[var(--muted)]">
                  ({goal.team === "home" ? match.team_home : match.team_away})
                </span>
              </span>
              <span className="font-medium text-[var(--pitch)]">{goal.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StatBar({
  label,
  home,
  away,
  suffix = "",
}: {
  label: string;
  home: number;
  away: number;
  suffix?: string;
}) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-semibold">
          {home}
          {suffix}
        </span>
        <span className="text-xs uppercase tracking-wider text-[var(--muted)]">
          {label}
        </span>
        <span className="font-semibold">
          {away}
          {suffix}
        </span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-[var(--mist)]">
        <div
          className="bg-[var(--pitch)]"
          style={{ width: `${homePct}%` }}
        />
        <div
          className="bg-[var(--gold)]"
          style={{ width: `${100 - homePct}%` }}
        />
      </div>
    </div>
  );
}
