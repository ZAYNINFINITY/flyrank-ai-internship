"use client";

import { useAudio } from "./audio-provider";

export function MusicPlayerBar() {
  const { muted, toggleMute } = useAudio();

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? "Unmute" : "Mute"}
      className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#0a0a12]/40 text-[#efe9da]/50 backdrop-blur-md transition-all hover:bg-[#0a0a12]/60 hover:text-[#efe9da]/80"
    >
      {muted ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 6.5h3L9 3v12L5 11.5H2a.5.5 0 01-.5-.5V7a.5.5 0 01.5-.5z" />
          <path d="M11 6.5l5 5.5M16 6.5l-5 5.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 6.5h3L9 3v12L5 11.5H2a.5.5 0 01-.5-.5V7a.5.5 0 01.5-.5z" />
          <path d="M11 6.5a3.5 3.5 0 010 5" strokeLinecap="round" />
          <path d="M13 4a6 6 0 010 10" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
