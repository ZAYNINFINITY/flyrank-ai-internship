import { Frame } from "@/components/primitives/frame";
import { MuseumTagLabel } from "@/components/primitives/museum-tag-label";
import { exploreExhibits } from "@/lib/mock-data/explore-exhibits";

export default function ExplorePage() {
  const liveExhibits = exploreExhibits.filter((e) => e.status === "live");
  const hasLiveExhibits = liveExhibits.length > 0;

  return (
    <section className="min-h-[100dvh] px-6 py-24 sm:px-8 md:px-12">
      <div className="mx-auto max-w-[1120px]">
        <h1 className="font-heading text-[28px] font-medium text-text md:text-[36px]">
          Explore exhibits
        </h1>

        {!hasLiveExhibits && (
          <p className="mt-4 max-w-[480px] font-body text-[16px] leading-relaxed text-text/50">
            The first exhibits are being built. Yours could be next.
          </p>
        )}

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {exploreExhibits.map((exhibit) => {
            const isLive = exhibit.status === "live";

            if (isLive) {
              return (
                <a
                  key={exhibit.username}
                  href={`/exhibit/${exhibit.username}`}
                  className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <Frame className="flex h-full flex-col transition-colors duration-200 group-hover:border-text/20">
                    <div className="flex-1" />
                    <div className="mt-6">
                      <MuseumTagLabel variant="live" className="mb-2 block">
                        LIVE
                      </MuseumTagLabel>
                      <p className="font-heading text-[17px] font-medium text-text">
                        {exhibit.name}
                      </p>
                      <p className="mt-1 font-body text-[14px] text-text/50">
                        {exhibit.tagline}
                      </p>
                      <p className="mt-3 font-body text-[13px] text-text/40 transition-colors duration-200 group-hover:text-text/60">
                        View exhibit →
                      </p>
                    </div>
                  </Frame>
                </a>
              );
            }

            return (
              <div key={exhibit.username} aria-disabled="true">
                <Frame className="flex h-full flex-col cursor-default">
                  <div className="flex-1" />
                  <div className="mt-6">
                    <MuseumTagLabel variant="placeholder" className="mb-2 block">
                      OPENING SOON
                    </MuseumTagLabel>
                    <p className="font-heading text-[17px] font-medium text-text/30">
                      {exhibit.name}
                    </p>
                    <p className="mt-1 font-body text-[14px] text-text/20">
                      {exhibit.tagline}
                    </p>
                  </div>
                </Frame>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
