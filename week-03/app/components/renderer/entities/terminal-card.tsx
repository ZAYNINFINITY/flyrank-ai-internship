import type { EntityComponentProps } from "@/components/renderer/entity-view";

export function TerminalCard({ entityId, anchor }: EntityComponentProps) {
  return (
    <div className="bg-[var(--color-text)]/5 p-4 font-mono text-xs">
      <div className="flex items-center gap-2 mb-3 opacity-30">
        <span className="w-2 h-2 rounded-full bg-red-400" />
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        <span className="w-2 h-2 rounded-full bg-green-400" />
        <span className="ml-2 uppercase tracking-[0.15em]">{anchor.label}</span>
      </div>
      <p className="opacity-50">
        <span className="text-green-400/60">$</span> foyer --exhibit {entityId}
      </p>
      <p className="mt-1 opacity-30">Loading exhibit data...</p>
    </div>
  );
}
