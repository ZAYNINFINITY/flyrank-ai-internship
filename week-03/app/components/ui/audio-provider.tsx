"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { MusicPlayerBar } from "./music-player-bar";

type AudioCtx = {
  playing: boolean;
  muted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  visible: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  seek: (pct: number) => void;
  show: () => void;
};

const Ctx = createContext<AudioCtx | null>(null);

export function useAudio() {
  return useContext(Ctx)!;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.15);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visible, setVisible] = useState(false);

  // Create audio element on mount (client only)
  useEffect(() => {
    const audio = new Audio("/audio/lobby.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.15;
    audioRef.current = audio;

    const onTime = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setDuration(audio.duration);
    };
    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  }, [playing]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  }, [muted]);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(1, v));
    audio.volume = clamped;
    setVolumeState(clamped);
    if (clamped > 0 && audio.muted) {
      audio.muted = false;
      setMuted(false);
    }
  }, []);

  const seek = useCallback((pct: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = (pct / 100) * audio.duration;
  }, []);

  const show = useCallback(() => setVisible(true), []);

  return (
    <Ctx.Provider
      value={{
        playing,
        muted,
        volume,
        currentTime,
        duration,
        visible,
        togglePlay,
        toggleMute,
        setVolume,
        seek,
        show,
      }}
    >
      {children}
      {visible && <MusicPlayerBar />}
    </Ctx.Provider>
  );
}
