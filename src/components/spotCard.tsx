export default function SpotsCard({
  filled,
  total,
}: {
  filled: number;
  total: number;
}) {
  const spotsLeft = total - filled;
  const pct = total > 0 ? Math.min(100, (filled / total) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border mb-5 border-white/10 bg-white/5 p-5">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lime-400 to-lime-500" />
      <div className="flex items-end justify-between">
        <div>
          <span className="text-4xl font-black text-lime-400 leading-none">
            {filled}
          </span>
          <p className="mt-1 text-xs text-white/50">of {total} spots filled</p>
        </div>
        <p className="text-xs font-medium text-white/60">
          {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
        </p>
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-lime-400 to-lime-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
