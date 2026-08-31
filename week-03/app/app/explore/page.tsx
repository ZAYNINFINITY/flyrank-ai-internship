import { Reveal } from "@/components/ops/reveal";
import { S } from "@/components/ops/theme";
import { exploreExhibits } from "@/lib/mock-data/explore-exhibits";

export default function ExplorePage() {
  const hasLiveExhibits = exploreExhibits.some((e) => e.status === "live");

  return (
    <main
      className="min-h-[100dvh]"
      style={{
        backgroundColor: S.bg,
        color: S.text,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
      }}
    >
      <section className="px-6 pt-20 pb-24 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <p
            className="text-[11px] uppercase tracking-[0.2em] mb-6"
            style={{ fontFamily: "monospace", color: S.accent }}
          >
            Explore
          </p>
          <h1
            className="text-[36px] font-medium leading-[1.1] md:text-[52px]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Walk the floor.
          </h1>
          <p
            className="mt-6 max-w-[560px] text-[15px] leading-[1.75]"
            style={{ color: "rgba(46,40,33,0.55)" }}
          >
            {hasLiveExhibits
              ? "Every exhibit here is a room you can walk into — scroll to move, click to inspect. Open rooms are live; the rest open soon."
              : "The first exhibits are being built. Yours could be next."}
          </p>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exploreExhibits.map((exhibit, i) => {
              const isLive = exhibit.status === "live";
              return (
                <Reveal key={exhibit.username} delay={i * 70} className="h-full">
                  {isLive ? (
                    <a
                      href={`/exhibit/${exhibit.username}`}
                      className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <div
                        className="flex h-full flex-col rounded-[3px] p-6 transition-all duration-300 group-hover:-translate-y-1"
                        style={{
                          border: `1px solid ${S.border}`,
                          backgroundColor: "rgba(248,243,233,0.45)",
                        }}
                      >
                        <p
                          className="text-[10px] uppercase tracking-[0.15em]"
                          style={{ fontFamily: "monospace", color: S.accent }}
                        >
                          ● Live
                        </p>
                        <h2
                          className="mt-4 text-[22px] font-medium"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          {exhibit.name}
                        </h2>
                        <p
                          className="mt-2 text-[14px] leading-[1.7]"
                          style={{ color: "rgba(46,40,33,0.5)" }}
                        >
                          {exhibit.tagline}
                        </p>
                        <p
                          className="mt-8 flex items-center gap-2 text-[13px] transition-colors duration-300"
                          style={{ color: "rgba(46,40,33,0.4)" }}
                        >
                          Visit the room
                          <span
                            className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                            style={{ color: S.accent }}
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div aria-disabled="true" className="h-full">
                      <div
                        className="flex h-full flex-col rounded-[3px] border p-6"
                        style={{
                          borderStyle: "dashed",
                          borderColor: S.border,
                          backgroundColor: "rgba(248,243,233,0.3)",
                        }}
                      >
                        <p
                          className="text-[10px] uppercase tracking-[0.15em]"
                          style={{ fontFamily: "monospace", color: "rgba(46,40,33,0.3)" }}
                        >
                          Coming soon
                        </p>
                        <h2
                          className="mt-4 text-[22px] font-medium"
                          style={{
                            fontFamily: "Georgia, serif",
                            color: "rgba(46,40,33,0.4)",
                          }}
                        >
                          {exhibit.name}
                        </h2>
                        <p
                          className="mt-2 text-[14px] leading-[1.7]"
                          style={{ color: "rgba(46,40,33,0.3)" }}
                        >
                          Coming soon — build it with the curator
                        </p>
                      </div>
                    </div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
