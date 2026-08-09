import { MotionButton } from "@/components/primitives/motion-button";
import { Frame } from "@/components/primitives/frame";
import { MuseumTagLabel } from "@/components/primitives/museum-tag-label";

const exhibits = [
  { name: "POS-it", href: "/exhibit/zayn#pos-it" },
  { name: "Collaborative Workspace", href: "/exhibit/zayn#collaborative-workspace" },
  { name: "ScrollStreak", href: "/exhibit/zayn#scrollstreak" },
];

export default function HomePage() {
  return (
    <>
      {/* Beat 1 — Entrance */}
      <section className="flex min-h-[100dvh] items-center">
        <div className="mx-auto w-full max-w-[640px] px-6 sm:px-8 md:px-12">
          <h1 className="font-heading text-[36px] leading-[1.08] tracking-tight text-text sm:text-[56px] md:text-[80px]">
            A room for every project you&apos;ve shipped.
          </h1>
          <p className="mt-5 max-w-[480px] font-body text-[17px] leading-relaxed text-text/60 md:text-[19px]">
            An open-source platform where any developer gets a gallery-style
            exhibit page for their projects — real space, real story, nothing
            competing for attention.
          </p>
          <div className="mt-8">
            <MotionButton variant="solid" label="Create your exhibit" />
          </div>
        </div>
      </section>

      {/* Beat 2 — What this is */}
      <section className="flex min-h-[100dvh] items-center">
        <div className="mx-auto w-full max-w-[560px] px-6 sm:px-8 md:px-12">
          <p className="text-center font-body text-[17px] leading-relaxed text-text/70 sm:text-[18px] md:text-[19px]">
            Every project gets a room of its own. Not a card in a grid, not a
            thumbnail in a cluster — a dedicated page with space to tell the
            story behind what you built. Plinth is open-source, and yours starts
            here.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {exhibits.map((exhibit) => (
              <a
                key={exhibit.name}
                href={exhibit.href}
                className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Frame className="flex h-full flex-col justify-between transition-colors duration-200 group-hover:border-text/20">
                  <div className="flex-1" />
                  <div className="mt-6">
                    <MuseumTagLabel variant="placeholder" className="mb-2 block">
                      LIVE
                    </MuseumTagLabel>
                    <p className="font-heading text-[15px] text-text">
                      {exhibit.name}
                    </p>
                  </div>
                </Frame>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Beat 3 — Explore CTA */}
      <section className="flex min-h-[60dvh] items-center">
        <div className="mx-auto w-full max-w-[560px] px-6 text-center sm:px-8 md:px-12">
          <div className="flex flex-col items-center gap-4">
            <a
              href="/entrance"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[3px] border border-text/25 bg-transparent px-8 py-3 font-body text-sm font-medium text-text transition-colors duration-200 hover:border-text/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Enter the Museum
            </a>
            <a
              href="/explore"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[3px] border border-text/10 bg-transparent px-8 py-3 font-body text-sm text-text/60 transition-colors duration-200 hover:border-text/30 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Explore all exhibits
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
