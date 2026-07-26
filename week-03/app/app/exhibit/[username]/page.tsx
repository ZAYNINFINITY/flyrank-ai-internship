import Image from "next/image";
import { notFound } from "next/navigation";
import { FloorDirectory } from "@/components/primitives/floor-directory";
import { Frame } from "@/components/primitives/frame";
import { SpotlightButton } from "@/components/primitives/spotlight-button";
import { exhibits } from "@/lib/mock-data/exhibits";

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function ExhibitPage({ params }: PageProps) {
  const { username } = await params;
  const exhibit = exhibits[username];

  if (!exhibit) {
    notFound();
  }

  const directoryItems = exhibit.projects.map((project, i) => ({
    number: String(i + 1).padStart(2, "0"),
    label: project.title,
    href: `#${project.id}`,
  }));

  return (
    <>
      {/* Room 0 — Entrance */}
      <section className="flex min-h-[100dvh] flex-col justify-center px-6 py-24 sm:px-8 md:px-12">
        <div className="mx-auto w-full max-w-[640px]">
          <div className="flex items-center gap-6">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-text/10">
              <Image
                src={exhibit.avatar}
                alt={exhibit.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div>
              <h1 className="font-heading text-[28px] font-medium text-text md:text-[36px]">
                {exhibit.name}
              </h1>
              <p className="mt-1 font-body text-[15px] text-text/50">
                {exhibit.role}
              </p>
            </div>
          </div>

          <div className="mt-16">
            <FloorDirectory items={directoryItems} />
          </div>
        </div>
      </section>

      {/* Room 1–4 — Projects */}
      {exhibit.projects.map((project) => {
        const isImageLeft = project.imagePosition === "left";

        return (
          <section
            key={project.id}
            id={project.id}
            className={`flex min-h-[100dvh] items-center px-6 py-24 sm:px-8 md:px-12 ${
              project.isLightest ? "!min-h-[60dvh]" : ""
            }`}
          >
            <div className="mx-auto grid w-full max-w-[1120px] grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
              {/* Image frame */}
              <div
                className={`order-1 ${isImageLeft ? "md:order-1" : "md:order-2"}`}
              >
                <Frame className="flex aspect-[4/3] items-center justify-center">
                  {project.image ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 560px"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded border border-text/10">
                        <span className="font-body text-[11px] uppercase tracking-[0.05em] text-text/30">
                          Screenshot
                        </span>
                      </div>
                      <span className="font-body text-[12px] text-text/20">
                        {project.title}
                      </span>
                    </div>
                  )}
                </Frame>
              </div>

              {/* Text content */}
              <div
                className={`order-2 ${isImageLeft ? "md:order-2" : "md:order-1"}`}
              >
                <h2 className="font-heading text-[22px] font-medium text-text md:text-[28px]">
                  {project.title}
                </h2>
                <p className="mt-4 font-body text-[15px] leading-relaxed text-text/60 md:text-[17px]">
                  {project.story}
                </p>
                <p className="mt-4 font-body text-[13px] text-text/40">
                  {project.stack.join(" · ")}
                </p>
              </div>
            </div>
          </section>
        );
      })}

      {/* Final Beat — Isolated CTA */}
      <section className="flex min-h-[100dvh] flex-col items-center justify-center px-6 sm:px-8">
        <p className="mb-8 text-center font-body text-[17px] text-text/60">
          Want to talk about working together?
        </p>
        <SpotlightButton>Book a call</SpotlightButton>
      </section>
    </>
  );
}
