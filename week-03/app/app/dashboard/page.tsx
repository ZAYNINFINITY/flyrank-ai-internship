"use client";

import { useState } from "react";
import Link from "next/link";
import type { Curation } from "@/app/api/curate/route";

type CurateResponse = {
  curation?: Curation;
  repoUrl?: string;
  error?: string;
};

export default function DashboardPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CurateResponse | null>(null);

  const curate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!repoUrl.trim()) {
      setError("Paste a GitHub repo URL first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/curate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });
      const data = (await res.json()) as CurateResponse;
      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong. Try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Couldn't reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[100dvh] items-start justify-center px-6 py-16 sm:px-8 md:px-12">
      <div className="w-full max-w-[640px]">
        <p className="font-body text-[11px] uppercase tracking-[0.05em] text-text/30">
          Curator&apos;s desk
        </p>
        <h1 className="mt-4 font-heading text-[28px] font-medium text-text md:text-[36px]">
          Exhibit a repository
        </h1>
        <p className="mt-4 font-body text-[15px] leading-relaxed text-text/50 md:text-[17px]">
          Paste a public GitHub repo URL and the museum&apos;s AI curator will
          draft the exhibit — tagline, description, curator notes, and tech
          stack — ready for review.
        </p>

        <form onSubmit={curate} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            aria-label="GitHub repository URL"
            className="min-h-[44px] flex-1 rounded-[3px] border border-text/15 bg-transparent px-4 font-body text-sm text-text placeholder:text-text/30 focus-visible:border-text/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border border-text/25 bg-transparent px-8 py-3 font-body text-sm font-medium text-text transition-colors duration-200 hover:border-text/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
          >
            {loading ? "Curating…" : "Curate it"}
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-4 font-body text-sm text-red-700">
            {error}
          </p>
        )}

        {result?.curation && (
          <article
            aria-live="polite"
            className="mt-8 rounded-[3px] border border-text/15 bg-text/[0.02] p-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-text/10 px-2.5 py-1 font-body text-[10px] uppercase tracking-wider text-text/60">
                {result.curation.collectionId}
              </span>
              {result.curation.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-text/15 px-2.5 py-1 font-body text-[10px] text-text/50"
                >
                  {tech}
                </span>
              ))}
            </div>
            <h2 className="mt-4 font-heading text-xl font-medium text-text">
              {result.curation.title}
            </h2>
            <p className="mt-1 font-body text-sm italic text-text/50">
              {result.curation.tagline}
            </p>
            <p className="mt-4 font-body text-[15px] leading-relaxed text-text/70">
              {result.curation.description}
            </p>
            <blockquote className="mt-4 border-l-2 border-accent/40 pl-4 font-body text-sm leading-relaxed text-text/60">
              {result.curation.curatorNotes}
            </blockquote>
            {result.repoUrl && (
              <a
                href={result.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-block font-body text-xs uppercase tracking-[0.15em] text-text/40 transition-colors hover:text-text/70"
              >
                View on GitHub &rarr;
              </a>
            )}
            <p className="mt-6 font-body text-[11px] text-text/30">
              Draft generated by the AI curator. Publishing to the live museum
              arrives with accounts — for now, treat this as your preview.
            </p>
          </article>
        )}

        <div className="mt-10">
          <Link
            href="/"
            className="font-body text-xs uppercase tracking-[0.15em] text-text/40 transition-colors hover:text-text/70"
          >
            &larr; Back to the museum
          </Link>
        </div>
      </div>
    </section>
  );
}
