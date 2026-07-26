import { exhibits } from "@/lib/mock-data/exhibits";

export default async function HealthPage() {
  const exhibitList = Object.values(exhibits);

  return (
    <section className="min-h-[100dvh] px-6 py-24 sm:px-8 md:px-12">
      <div className="mx-auto max-w-[720px]">
        <p className="font-body text-[11px] uppercase tracking-[0.05em] text-text/30">
          Developer
        </p>
        <h1 className="mt-4 font-heading text-[28px] font-medium text-text md:text-[36px]">
          Health check
        </h1>
        <p className="mt-4 font-body text-[15px] leading-relaxed text-text/50">
          This route fetches and renders mock data, proving the data-fetching
          pattern works. In production, this would hit a real API.
        </p>

        <div className="mt-12 space-y-6">
          {exhibitList.map((exhibit) => (
            <div
              key={exhibit.username}
              className="rounded-[3px] border border-text/10 p-6"
            >
              <p className="font-body text-[11px] uppercase tracking-[0.05em] text-text/30">
                Exhibit
              </p>
              <p className="mt-2 font-heading text-[17px] font-medium text-text">
                {exhibit.name}
              </p>
              <p className="mt-1 font-body text-[14px] text-text/50">
                {exhibit.role}
              </p>
              <p className="mt-3 font-body text-[13px] text-text/40">
                {exhibit.projects.length} projects
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
