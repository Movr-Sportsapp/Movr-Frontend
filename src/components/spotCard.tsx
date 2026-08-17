import { getSportColor } from "../assets/sports";

export default function SpotsCard({
  filled,
  total,
  sportName,
}: {
  filled: number;
  total: number;
  sportName: string;
}) {
  const spotsLeft = total - filled;
  const pct = total > 0 ? Math.min(100, (filled / total) * 100) : 0;
  const color = getSportColor(sportName);
  return (
    <div className="relative overflow-hidden rounded-2xl border mb-5 border-white/10 bg-white/5 p-5">
      <div className="absolute inset-x-0 top-0 h-1 "
       style={{ backgroundColor: color }} />
      <div className="flex items-end justify-between">
        <div>
          <span className="text-4xl font-blackleading-none"
          style={{ color: color }} >
            {spotsLeft}
          </span>
          <p className="mt-1 text-xs text-white/50">{spotsLeft > 0 ? `spots left` : "Full"}</p>
        </div>
        <p className="text-xs font-medium text-white/60">
          {filled} of {total} spots filled
        </p>
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full  transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
