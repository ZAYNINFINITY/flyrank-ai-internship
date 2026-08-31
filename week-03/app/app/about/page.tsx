import { Reveal } from "@/components/ops/reveal";
import { S } from "@/components/ops/theme";
import { ContactForm } from "@/components/ops/contact-form";

/* eslint-disable @next/next/no-img-element */

const rooms = [
  {
    src: "/images/about/entrance.webp",
    name: "The Entrance Hall",
    note: "Where every visit begins — the lobby sets the tone before you walk in.",
  },
  {
    src: "/images/about/corridor.webp",
    name: "The Main Corridor",
    note: "Exhibits hang on the walls as you move through the space, room to room.",
  },
  {
    src: "/images/about/reception.webp",
    name: "The Reception Desk",
    note: "A human receptionist — not a card grid — greets you at the door.",
  },
];

const makerLinks = [
  {
    label: "GitHub",
    href: "https://github.com/ZAYNINFINITY",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/zain-ul-abideen-429735231/",
  },
  {
    label: "Portfolio",
    href: "https://zainportfoli0.netlify.app",
  },
];

export default function AboutPage() {
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
      {/* ── 01 · Hero ─────────────────────────────────────── */}
      <section className="px-6 pt-20 pb-24 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="max-w-[760px]">
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "monospace", color: S.accent }}
            >
              About Foyer
            </p>
            <h1
              className="text-[36px] font-medium leading-[1.1] md:text-[52px]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              A museum built for how developers actually work.
            </h1>

            <div className="mt-10 space-y-6">
              <p
                className="text-[15px] leading-[1.75]"
                style={{ color: "rgba(46,40,33,0.55)" }}
              >
                Foyer is an open digital museum for developers. Most developer
                portfolios compress years of work into identical card grids —
                tiny thumbnails fighting for attention, with no room to tell the
                story behind what was built. Foyer gives every project its own
                space.
              </p>
              <p
                className="text-[15px] leading-[1.75]"
                style={{ color: "rgba(46,40,33,0.55)" }}
              >
                The name comes from architecture: a foyer is the entrance hall
                of a museum. It sets the tone for everything that follows —
                that&apos;s what Foyer does for your projects.
              </p>
              <p
                className="text-[15px] leading-[1.75]"
                style={{ color: "rgba(46,40,33,0.55)" }}
              >
                Any developer can exhibit their work. Create a profile, curate
                collections, and build a public gallery that reflects how you
                actually think about your craft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · Walk the floor ───────────────────────────── */}
      <section className="px-6 pb-24 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-16"
              style={{ fontFamily: "monospace", color: S.muted }}
            >
              Walk the floor
            </p>
          </Reveal>

          <div className="space-y-20">
            {rooms.map((room) => (
              <Reveal key={room.name}>
                <div>
                  <div
                    className="overflow-hidden rounded-[3px]"
                    style={{ border: `1px solid ${S.border}` }}
                  >
                    <img
                      src={room.src}
                      alt={`${room.name} in Foyer`}
                      className="block h-auto w-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <p
                      className="text-[20px] font-medium"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {room.name}
                    </p>
                    <p
                      className="max-w-[420px] text-[14px] leading-[1.7]"
                      style={{ color: "rgba(46,40,33,0.45)" }}
                    >
                      {room.note}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 · The Maker ────────────────────────────────── */}
      <section className="px-6 pb-24 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-12"
              style={{ fontFamily: "monospace", color: S.muted }}
            >
              About Dev
            </p>
          </Reveal>

          <Reveal>
            <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
              <div className="max-w-[620px]">
                <p className="text-[15px] leading-[1.75]" style={{ color: "rgba(46,40,33,0.55)" }}>
                  Foyer is one developer&apos;s capstone — built to prove that a
                  project archive can feel like a place, not a list. Built and
                  maintained by <span style={{ color: S.text }}>ZAYNINFINITY</span>.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                {makerLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-between gap-8 rounded-[3px] px-4 py-2.5 text-[13px] transition-colors duration-200"
                    style={{
                      border: `1px solid ${S.border}`,
                      color: "rgba(46,40,33,0.6)",
                    }}
                  >
                    {link.label}
                    <span
                      className="transition-transform duration-200 group-hover:translate-x-1"
                      style={{ color: S.accent }}
                    >
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 03.5 · Contact ───────────────────────────────── */}
      <section className="px-6 pb-24 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div
            style={{
              borderTop: `1px solid ${S.border}`,
              borderBottom: `1px solid ${S.border}`,
            }}
          >
            <div className="py-16">
              <Reveal>
                <p
                  className="text-[11px] uppercase tracking-[0.2em] mb-6"
                  style={{ fontFamily: "monospace", color: S.accent }}
                >
                  Get in touch
                </p>
                <h2
                  className="text-[28px] font-medium leading-[1.15] md:text-[38px]"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Working on something worth building?
                </h2>
                <p
                  className="mt-4 max-w-[560px] text-[15px] leading-[1.75]"
                  style={{ color: "rgba(46,40,33,0.55)" }}
                >
                  Whether it&apos;s an internship, a collaboration, or a quick
                  question about the museum — this form sends straight to my
                  inbox, no backend of mine in between.
                </p>
              </Reveal>

              <div className="mt-12">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 · Open source ──────────────────────────────── */}
      <section className="px-6 pb-24 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div style={{ borderTop: `1px solid ${S.border}` }}>
            <Reveal>
              <div className="pt-12">
                <p
                  className="text-[11px] uppercase tracking-[0.2em] mb-4"
                  style={{ fontFamily: "monospace", color: S.muted }}
                >
                  Open source
                </p>
                <p className="text-[15px] leading-[1.75] max-w-[640px]" style={{ color: "rgba(46,40,33,0.55)" }}>
                  Foyer is open-source because the best platforms for showing
                  creative work are built by the community that uses them. If you
                  want to contribute, fix something, or just see how it works —
                  the repo is open.
                </p>
                <div className="mt-8">
                  <a
                    href="https://github.com/ZAYNINFINITY/flyrank-ai-internship"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border bg-transparent px-6 py-2.5 text-[13px] transition-colors duration-200"
                    style={{
                      borderColor: "rgba(201,79,10,0.3)",
                      color: S.accent,
                    }}
                  >
                    View on GitHub →
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
