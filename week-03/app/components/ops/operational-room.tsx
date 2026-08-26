import Link from "next/link";
import { Nav } from "@/components/primitives/nav";

const S = {
  bg: "#F5F0E7",
  surface: "#F8F3E9",
  text: "#2E2821",
  accent: "#C94F0A",
  border: "rgba(46,40,33,0.12)",
  muted: "rgba(46,40,33,0.45)",
} as const;

export function OperationalRoom() {
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
      <Nav />

      {/* ── 01 · Hero ───────────────────────────────────── */}
      <section className="px-6 pt-16 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: S.accent }}
            />
            <p
              className="text-[11px] uppercase tracking-[0.2em]"
              style={{ fontFamily: "monospace", color: S.muted }}
            >
              Foyer · Engine Room
            </p>
          </div>
          <h1
            className="text-[32px] font-medium md:text-[44px]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Zain Ul Abideen
          </h1>
          <p
            className="mt-2 text-[17px]"
            style={{ fontFamily: "Georgia, serif", color: S.muted }}
          >
            CS Student @ PAF-IAST · MERN Stack Developer
          </p>
          <p
            className="mt-6 max-w-[640px] text-[15px] leading-relaxed"
            style={{ color: "rgba(46,40,33,0.55)" }}
          >
            This is the operational view behind Foyer — the 3D museum where
            developers exhibit their work as gallery rooms, not card grids.
            AI curates the experience. Your portfolio at{" "}
            <a
              href="https://zainportfoli0.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors duration-200"
              style={{ color: "rgba(46,40,33,0.7)" }}
            >
              zainportfoli0.netlify.app
            </a>{" "}
            is the public face. This is the engine room.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://zainportfoli0.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border bg-transparent px-6 py-2.5 text-sm transition-colors duration-200"
              style={{ borderColor: "rgba(46,40,33,0.18)", color: S.text }}
            >
              Portfolio ↗
            </a>
            <Link
              href="/exhibit/zayn"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border bg-transparent px-6 py-2.5 text-sm transition-colors duration-200"
              style={{ borderColor: "rgba(46,40,33,0.18)", color: S.text }}
            >
              View in Museum →
            </Link>
            <Link
              href="/assistant"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border px-6 py-2.5 text-sm transition-colors duration-200"
              style={{
                borderColor: "rgba(201,79,10,0.3)",
                backgroundColor: "rgba(201,79,10,0.05)",
                color: S.accent,
              }}
            >
              Talk to AI Curator →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 02 · The Story ───────────────────────────────── */}
      <section className="px-6 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="pt-12" style={{ borderTop: `1px solid ${S.border}` }}>
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-10"
              style={{ fontFamily: "monospace", color: S.muted }}
            >
              The Story
            </p>

            {/* Beat 1 */}
            <div className="max-w-[720px]">
              <p
                className="text-[11px] uppercase tracking-[0.15em] mb-3"
                style={{ fontFamily: "monospace", color: S.accent }}
              >
                01 · The Problem
              </p>
              <h2
                className="text-[22px] font-medium md:text-[28px] leading-snug"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Every developer portfolio looks the same.
              </h2>
              <p
                className="mt-4 text-[15px] leading-relaxed"
                style={{ color: "rgba(46,40,33,0.55)" }}
              >
                Card grids. Thumbnail clusters. Identical layouts. Projects
                compressed into tiny boxes fighting for attention, with no room
                to tell the story behind what was built. I had four real
                projects — a real-time collab platform, a live e-commerce
                site, a browser extension, a POS system — and they all
                deserved better than a list.
              </p>
            </div>

            {/* Beat 2 */}
            <div className="max-w-[720px] mt-12">
              <p
                className="text-[11px] uppercase tracking-[0.15em] mb-3"
                style={{ fontFamily: "monospace", color: S.accent }}
              >
                02 · The Idea
              </p>
              <h2
                className="text-[22px] font-medium md:text-[28px] leading-snug"
                style={{ fontFamily: "Georgia, serif" }}
              >
                What if projects had rooms, not cards?
              </h2>
              <p
                className="mt-4 text-[15px] leading-relaxed"
                style={{ color: "rgba(46,40,33,0.55)" }}
              >
                A foyer is the entrance hall of a museum. It sets the tone for
                everything that follows. I wanted to build that — a place where
                each project gets a dedicated 3D space with architectural
                presence. A scrollable corridor, exhibit frames with a
                sketch-to-paint reveal shader, an AI curator that answers
                questions about what&apos;s on display. Not a portfolio. A museum.
              </p>
            </div>

            {/* Beat 3 */}
            <div className="max-w-[720px] mt-12">
              <p
                className="text-[11px] uppercase tracking-[0.15em] mb-3"
                style={{ fontFamily: "monospace", color: S.accent }}
              >
                03 · What Broke
              </p>
              <h2
                className="text-[22px] font-medium md:text-[28px] leading-snug"
                style={{ fontFamily: "Georgia, serif" }}
              >
                The 3D-to-2D seam nearly killed the project.
              </h2>
              <p
                className="mt-4 text-[15px] leading-relaxed"
                style={{ color: "rgba(46,40,33,0.55)" }}
              >
                Getting a Three.js scene and a flat React component to render
                the same content — same data, same interactions, same feel —
                without one becoming a degraded copy of the other. The first
                attempt was an orbit diorama that felt like a toy. The second
                attempt worked because the 2D path became a first-class
                citizen, not a fallback. Capability detection at mount time
                decides which renderer to use. Both consume the same data
                layer. Making that seam invisible was the hardest architectural
                decision in the project.
              </p>
            </div>

            {/* Beat 4 */}
            <div className="max-w-[720px] mt-12">
              <p
                className="text-[11px] uppercase tracking-[0.15em] mb-3"
                style={{ fontFamily: "monospace", color: S.accent }}
              >
                04 · What shipped
              </p>
              <h2
                className="text-[22px] font-medium md:text-[28px] leading-snug"
                style={{ fontFamily: "Georgia, serif" }}
              >
                A working museum, not a demo.
              </h2>
              <p
                className="mt-4 text-[15px] leading-relaxed"
                style={{ color: "rgba(46,40,33,0.55)" }}
              >
                74 tests passing. Lighthouse 99.25 average. AI curator powered
                by Gemini Flash. Custom GLSL reveal shader. Accessible 2D
                fallback for screen readers. Deployed on Vercel with CI/CD.
                Rate limiting, input validation, error states verified,
                rollback plan documented. This isn&apos;t a class artifact.
                It&apos;s a product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 · What AI Does ────────────────────────────── */}
      <section className="px-6 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="pt-12" style={{ borderTop: `1px solid ${S.border}` }}>
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-2"
              style={{ fontFamily: "monospace", color: S.muted }}
            >
              Where AI Does the Heavy Lifting
            </p>
            <p
              className="text-[14px] mb-10 max-w-[600px]"
              style={{ fontFamily: "system-ui, sans-serif", color: "rgba(46,40,33,0.35)" }}
            >
              One thing AI did that I couldn&apos;t have done alone: it manages
              the museum experience — from curating exhibits to detecting
              device capability to generating the reveal effect.
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <AiCard
                number="01"
                title="AI Curator"
                body="Gemini Flash via OpenRouter with a custom exhibitLookup tool. Visitors ask questions — AI pulls live data from the repository and responds. The engineering was in the tool schema, not the prompt. A good schema means the model feels smart."
                cta={{ label: "Try it", href: "/assistant" }}
              />
              <AiCard
                number="02"
                title="Capability Detection"
                body="Checks WebGL2, prefers-reduced-motion, memory, and pointer type at mount time. Powerful devices get the 3D museum. Everything else gets this 2D operational view — same data, full access. No degraded fallback."
                cta={{ label: "View source", href: "https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/renderer/capability.ts" }}
              />
              <AiCard
                number="03"
                title="Reveal Shader"
                body="Custom GLSL injected into Three.js via onBeforeCompile. Exhibits start as pencil sketches, dissolve into finished pieces as you approach. 77 lines of shader code. The signature visual effect."
                cta={{ label: "View source", href: "https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/three/reveal-material.ts" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 · Projects ────────────────────────────────── */}
      <section className="px-6 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="pt-12" style={{ borderTop: `1px solid ${S.border}` }}>
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-2"
              style={{ fontFamily: "monospace", color: S.muted }}
            >
              What I Built
            </p>
            <p
              className="text-[14px] mb-10 max-w-[600px]"
              style={{ color: "rgba(46,40,33,0.35)" }}
            >
              Each project exists in two places: your portfolio and the museum.
              Same work, different presentation.
            </p>

            <div
              className="rounded-[3px] overflow-hidden"
              style={{ border: `1px solid ${S.border}` }}
            >
              <ProjectRow
                title="Collaborative Workspace"
                stack="MERN · Socket.io · OAuth 2.0"
                description="Real-time collaboration platform with live chat, Kanban boards, and multi-user document editing."
                museumHref="/exhibit/zayn#collaborative-workspace"
              />
              <ProjectRow
                title="POS-it"
                stack="Electron · React · SQLite"
                description="Professional offline point-of-sale system with inventory, invoicing, and auto-updates."
                museumHref="/exhibit/zayn#pos-it"
              />
              <ProjectRow
                title="ZSE Store"
                stack="React · Node.js · MySQL"
                description="Live e-commerce site with product catalog, brand filtering, and WhatsApp order integration."
                museumHref="/exhibit/zayn#zse-store"
              />
              <ProjectRow
                title="ScrollStreak"
                stack="Chrome Extension · JavaScript"
                description="Instagram Reels tracker with friend duels, leaderboards, and weekly Wrapped stats."
                museumHref="/exhibit/zayn#scrollstreak"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 · Honest Numbers ──────────────────────────── */}
      <section className="px-6 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="pt-12" style={{ borderTop: `1px solid ${S.border}` }}>
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-10"
              style={{ fontFamily: "monospace", color: S.muted }}
            >
              Honest Numbers
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Exhibits" value="1" note="1 developer, 4 projects" />
              <StatCard label="Tests" value="74/74" note="all passing" />
              <StatCard label="Lighthouse" value="99.25" note="average across 4 routes" />
              <StatCard label="Shader" value="77 lines" note="custom GLSL" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 · Honest Limitations ──────────────────────── */}
      <section className="px-6 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="pt-12" style={{ borderTop: `1px solid ${S.border}` }}>
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-10"
              style={{ fontFamily: "monospace", color: S.muted }}
            >
              Honest Limitations
            </p>
            <div className="max-w-[720px] space-y-6">
              <Limitation
                text="3D canvas has no ARIA labels — screen readers can't navigate the museum. The 2D fallback provides full accessibility."
              />
              <Limitation
                text="No physical device testing — all testing done via DevTools mobile simulation. Real device testing is the next step."
              />
              <Limitation
                text="No external error tracking — Sentry not wired yet. Monitoring is manual via Vercel dashboard."
              />
              <Limitation
                text="Portfolio is on a Vercel subdomain, not a custom domain. Works, but a custom domain would feel more permanent."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 07 · What's Next ─────────────────────────────── */}
      <section className="px-6 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="pt-12" style={{ borderTop: `1px solid ${S.border}` }}>
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-10"
              style={{ fontFamily: "monospace", color: S.muted }}
            >
              What&apos;s Next
            </p>
            <div className="max-w-[720px]">
              <p
                className="text-[18px] font-medium"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Next case study: Collaborative Workspace
              </p>
              <p
                className="mt-3 text-[15px] leading-relaxed"
                style={{ color: "rgba(46,40,33,0.55)" }}
              >
                It&apos;s already built — real-time MERN app with Socket.io,
                Kanban, OAuth. Needs to be exhibited in Foyer. Steps
                documented in the roadmap. Reminder set: September 15, 2026.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/plan-to-keep-building.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border bg-transparent px-5 py-2 text-[13px] transition-colors duration-200"
                  style={{ borderColor: "rgba(46,40,33,0.12)", color: "rgba(46,40,33,0.6)" }}
                >
                  Read the Roadmap ↗
                </a>
                <a
                  href="https://github.com/ZAYNINFINITY/flyrank-ai-internship/issues/17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border bg-transparent px-5 py-2 text-[13px] transition-colors duration-200"
                  style={{ borderColor: "rgba(46,40,33,0.12)", color: "rgba(46,40,33,0.6)" }}
                >
                  Issue #17 ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 08 · Routes ──────────────────────────────────── */}
      <section className="px-6 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="pt-12" style={{ borderTop: `1px solid ${S.border}` }}>
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "monospace", color: S.muted }}
            >
              Museum Routes
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <RouteCard tag="CATALOG" label="Exhibit Catalog" href="/explore" />
              <RouteCard tag="LIVE" label="My Exhibit" href="/exhibit/zayn" />
              <RouteCard tag="AI" label="AI Curator" href="/assistant" />
              <RouteCard tag="INFO" label="About Foyer" href="/about" />
              <RouteCard tag="3D" label="Museum Entrance" href="/entrance" />
              <RouteCard tag="3D" label="Collection" href="/collection" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 09 · Stack ───────────────────────────────────── */}
      <section className="px-6 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="pt-12" style={{ borderTop: `1px solid ${S.border}` }}>
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "monospace", color: S.muted }}
            >
              Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "React", "TypeScript", "Tailwind CSS", "Vite",
                "Next.js", "Node.js", "Express.js", "Socket.io",
                "MongoDB", "MySQL", "SQLite",
                "Three.js", "GLSL", "React Three Fiber",
                "AI SDK", "OpenRouter", "Gemini Flash",
                "Git", "GitHub Actions", "Vercel",
                "OAuth 2.0", "JWT", "Zod",
              ].map((skill) => (
                <span
                  key={skill}
                  className="rounded-[3px] px-3 py-1.5 text-[12px]"
                  style={{
                    border: `1px solid ${S.border}`,
                    fontFamily: "monospace",
                    color: "rgba(46,40,33,0.5)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="px-6 pb-12 sm:px-8 md:px-12">
        <div
          className="mx-auto max-w-[1120px] pt-8"
          style={{ borderTop: `1px solid ${S.border}` }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[13px]" style={{ color: "rgba(46,40,33,0.3)" }}>
                Foyer · Open digital museum for developers
              </p>
              <p
                className="text-[11px] mt-1"
                style={{ fontFamily: "monospace", color: "rgba(46,40,33,0.2)" }}
              >
                Built by ZAYNINFINITY · AI Fluency + Frontend AI Engineering
              </p>
            </div>
            <div className="flex gap-6">
              <a
                href="https://github.com/ZAYNINFINITY/flyrank-ai-internship"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] transition-colors duration-200"
                style={{ color: "rgba(46,40,33,0.3)" }}
              >
                GitHub
              </a>
              <a
                href="https://zainportfoli0.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] transition-colors duration-200"
                style={{ color: "rgba(46,40,33,0.3)" }}
              >
                Portfolio
              </a>
              <Link
                href="/about"
                className="text-[13px] transition-colors duration-200"
                style={{ color: "rgba(46,40,33,0.3)" }}
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ── Sub-components ──────────────────────────────────────── */

function AiCard({
  number,
  title,
  body,
  cta,
}: {
  number: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
}) {
  return (
    <div
      className="rounded-[3px] p-6"
      style={{ border: `1px solid ${S.border}`, backgroundColor: S.surface }}
    >
      <p
        className="text-[11px] uppercase tracking-[0.15em]"
        style={{ fontFamily: "monospace", color: S.accent }}
      >
        {number}
      </p>
      <p
        className="mt-3 text-[16px] font-medium"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {title}
      </p>
      <p
        className="mt-3 text-[14px] leading-relaxed"
        style={{ color: "rgba(46,40,33,0.5)" }}
      >
        {body}
      </p>
      {cta.href.startsWith("http") ? (
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-[13px] transition-colors duration-200"
          style={{ color: "rgba(46,40,33,0.4)" }}
        >
          {cta.label} →
        </a>
      ) : (
        <Link
          href={cta.href}
          className="mt-4 inline-block text-[13px] transition-colors duration-200"
          style={{ color: "rgba(46,40,33,0.4)" }}
        >
          {cta.label} →
        </Link>
      )}
    </div>
  );
}

function ProjectRow({
  title,
  stack,
  description,
  museumHref,
}: {
  title: string;
  stack: string;
  description: string;
  museumHref: string;
}) {
  return (
    <div
      className="flex items-start gap-4 px-6 py-5"
      style={{ borderBottom: `1px solid ${S.border}` }}
    >
      <div className="flex-1 min-w-0">
        <p
          className="text-[15px] font-medium"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {title}
        </p>
        <p
          className="text-[12px] mt-0.5"
          style={{ fontFamily: "monospace", color: "rgba(46,40,33,0.3)" }}
        >
          {stack}
        </p>
        <p className="text-[14px] mt-2" style={{ color: "rgba(46,40,33,0.4)" }}>
          {description}
        </p>
      </div>
      <Link
        href={museumHref}
        className="flex-shrink-0 mt-1 text-[12px] transition-colors duration-200"
        style={{ color: "rgba(46,40,33,0.3)" }}
      >
        Museum →
      </Link>
    </div>
  );
}

function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div
      className="rounded-[3px] px-5 py-4"
      style={{ border: `1px solid ${S.border}`, backgroundColor: S.surface }}
    >
      <p
        className="text-[11px] uppercase tracking-[0.15em]"
        style={{ fontFamily: "monospace", color: "rgba(46,40,33,0.4)" }}
      >
        {label}
      </p>
      <p
        className="mt-2 text-[22px] font-medium"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {value}
      </p>
      <p className="mt-1 text-[12px]" style={{ color: "rgba(46,40,33,0.3)" }}>
        {note}
      </p>
    </div>
  );
}

function Limitation({ text }: { text: string }) {
  return (
    <div className="flex gap-3">
      <span
        className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
        style={{ backgroundColor: "rgba(46,40,33,0.15)" }}
      />
      <p className="text-[14px] leading-relaxed" style={{ color: "rgba(46,40,33,0.45)" }}>
        {text}
      </p>
    </div>
  );
}

function RouteCard({
  tag,
  label,
  href,
}: {
  tag: string;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-[3px] px-5 py-4 transition-colors duration-200"
      style={{ border: `1px solid ${S.border}` }}
    >
      <div>
        <span
          className="text-[10px] uppercase tracking-[0.15em]"
          style={{ fontFamily: "monospace", color: "rgba(46,40,33,0.3)" }}
        >
          {tag}
        </span>
        <p
          className="mt-1 text-[15px] font-medium"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {label}
        </p>
      </div>
      <span
        className="text-[13px] transition-colors duration-200"
        style={{ color: "rgba(46,40,33,0.2)" }}
      >
        →
      </span>
    </Link>
  );
}
