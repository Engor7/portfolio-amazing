"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./AudioPlayer.module.scss";

const tracks = [
   {
      title: "Sweet Life",
      artist: "Alex Grohl",
      cover: "/audio-player/cover_1.png",
      src: "/audio-player/alexgrohl-sweet-life-luxury-chill.mp3",
      color: "#c4a8a0",
      colorAlt: "#a0b4c4",
      idleBars: [45, 72, 30, 85, 55, 40],
   },
   {
      title: "No Sleep",
      artist: "Kontraa",
      cover: "/audio-player/cover_2.png",
      src: "/audio-player/kontraa-no-sleep-hiphop-music.mp3",
      color: "#3ba4d9",
      colorAlt: "#d4a43b",
      idleBars: [60, 35, 80, 25, 65, 50],
   },
   {
      title: "Epic",
      artist: "Kornevmusic",
      cover: "/audio-player/cover_3.png",
      src: "/audio-player/kornevmusic-epic.mp3",
      color: "#c0392b",
      colorAlt: "#d4722a",
      idleBars: [75, 50, 90, 60, 40, 70],
   },
   {
      title: "Once in Paris",
      artist: "Pumpupthemind",
      cover: "/audio-player/cover_4.png",
      src: "/audio-player/pumpupthemind-once-in-paris.mp3",
      color: "#8b5e3c",
      colorAlt: "#3c6e8b",
      idleBars: [65, 40, 75, 55, 85, 45],
   },
   {
      title: "Movement",
      artist: "Soulprodmusic",
      cover: "/audio-player/cover_5.png",
      src: "/audio-player/soulprodmusic-movement.mp3",
      color: "#2c3e6b",
      colorAlt: "#6b4a2c",
      idleBars: [50, 80, 35, 55, 75, 45],
   },
];

const BAR_COUNT = 6;

const randomBars = () =>
   Array.from({ length: BAR_COUNT }, () => 15 + Math.random() * 85);

const restingBars = (trackIndex: number) => [...tracks[trackIndex].idleBars];

const formatTime = (sec: number, remaining = false) => {
   if (!Number.isFinite(sec) || sec < 0) return "0:00";
   const m = Math.floor(sec / 60);
   const s = Math.floor(sec % 60);
   return `${remaining ? "-" : ""}${m}:${s.toString().padStart(2, "0")}`;
};

const AudioPlayer = () => {
   const [mounted, setMounted] = useState(false);
   const audioRef = useRef<HTMLAudioElement>(null);
   const isPlayingRef = useRef(false);
   const toPauseRef = useRef<SVGAnimateElement>(null);
   const toPlayRef = useRef<SVGAnimateElement>(null);
   const [currentTrack, setCurrentTrack] = useState(0);
   const [isPlaying, setIsPlaying] = useState(false);
   const [currentTime, setCurrentTime] = useState(0);
   const [duration, setDuration] = useState(0);
   const [bars, setBars] = useState(() => restingBars(0));
   const [volume, setVolume] = useState(0.7);
   const volumeTrackRef = useRef<HTMLDivElement>(null);
   const volumeDraggingRef = useRef(false);

   const track = tracks[currentTrack];

   const nextTrack = useCallback(() => {
      setCurrentTrack((i) => (i + 1) % tracks.length);
   }, []);

   const prevTrack = useCallback(() => {
      setCurrentTrack((i) => (i - 1 + tracks.length) % tracks.length);
   }, []);

   const togglePlay = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (isPlaying) {
         audio.pause();
         setIsPlaying(false);
         isPlayingRef.current = false;
         toPlayRef.current?.beginElement();
      } else {
         audio.play().catch(() => {});
         setIsPlaying(true);
         isPlayingRef.current = true;
         toPauseRef.current?.beginElement();
      }
   }, [isPlaying]);

   const progressRef = useRef<HTMLDivElement>(null);
   const draggingRef = useRef(false);
   const dragRatioRef = useRef(0);
   const seekTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

   const getRatio = useCallback((clientX: number) => {
      const bar = progressRef.current;
      if (!bar) return 0;
      const rect = bar.getBoundingClientRect();
      return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
   }, []);

   const scheduleSeek = useCallback(() => {
      if (seekTimerRef.current) return;
      seekTimerRef.current = setTimeout(() => {
         seekTimerRef.current = null;
         const audio = audioRef.current;
         if (audio && Number.isFinite(duration) && draggingRef.current) {
            audio.currentTime = dragRatioRef.current * duration;
         }
      }, 150);
   }, [duration]);

   const onPointerDown = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>) => {
         draggingRef.current = true;
         e.currentTarget.setPointerCapture(e.pointerId);
         const ratio = getRatio(e.clientX);
         dragRatioRef.current = ratio;
         setCurrentTime(ratio * duration);
         scheduleSeek();
      },
      [getRatio, duration, scheduleSeek],
   );

   const onPointerMove = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>) => {
         if (!draggingRef.current) return;
         const ratio = getRatio(e.clientX);
         dragRatioRef.current = ratio;
         setCurrentTime(ratio * duration);
         scheduleSeek();
      },
      [getRatio, duration, scheduleSeek],
   );

   const onPointerUp = useCallback(() => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      if (seekTimerRef.current) {
         clearTimeout(seekTimerRef.current);
         seekTimerRef.current = null;
      }
      const audio = audioRef.current;
      if (audio && Number.isFinite(duration)) {
         audio.currentTime = dragRatioRef.current * duration;
      }
   }, [duration]);

   // biome-ignore lint/correctness/useExhaustiveDependencies: mounted needed to re-run after DOM appears
   useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const onTimeUpdate = () => setCurrentTime(audio.currentTime);
      const onLoadedMetadata = () => setDuration(audio.duration);
      const onEnded = () => {
         setCurrentTrack((i) => (i + 1) % tracks.length);
      };

      audio.addEventListener("timeupdate", onTimeUpdate);
      audio.addEventListener("loadedmetadata", onLoadedMetadata);
      audio.addEventListener("ended", onEnded);

      return () => {
         audio.removeEventListener("timeupdate", onTimeUpdate);
         audio.removeEventListener("loadedmetadata", onLoadedMetadata);
         audio.removeEventListener("ended", onEnded);
      };
   }, [mounted]);

   // biome-ignore lint/correctness/useExhaustiveDependencies: mounted needed to re-run after DOM appears
   useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.src = track.src;
      audio.load();
      setCurrentTime(0);
      setDuration(0);
      setBars(restingBars(currentTrack));
      if (isPlayingRef.current) {
         audio.play().catch(() => {});
      }
   }, [currentTrack, track.src, mounted]);

   useEffect(() => {
      if (isPlaying) {
         const id = setInterval(() => setBars(randomBars()), 200);
         return () => clearInterval(id);
      }

      setBars(restingBars(currentTrack));
   }, [isPlaying, currentTrack]);

   useEffect(() => setMounted(true), []);

   useEffect(() => {
      if (!("mediaSession" in navigator)) return;
      navigator.mediaSession.metadata = new MediaMetadata({
         title: track.title,
         artist: track.artist,
         artwork: [{ src: track.cover, type: "image/png" }],
      });
   }, [track]);

   useEffect(() => {
      if (!("mediaSession" in navigator)) return;
      const ms = navigator.mediaSession;
      ms.setActionHandler("play", () => {
         audioRef.current?.play().catch(() => {});
         setIsPlaying(true);
         isPlayingRef.current = true;
         toPauseRef.current?.beginElement();
      });
      ms.setActionHandler("pause", () => {
         audioRef.current?.pause();
         setIsPlaying(false);
         isPlayingRef.current = false;
         toPlayRef.current?.beginElement();
      });
      ms.setActionHandler("previoustrack", prevTrack);
      ms.setActionHandler("nexttrack", nextTrack);
      return () => {
         ms.setActionHandler("play", null);
         ms.setActionHandler("pause", null);
         ms.setActionHandler("previoustrack", null);
         ms.setActionHandler("nexttrack", null);
      };
   }, [nextTrack, prevTrack]);

   useEffect(() => {
      if (audioRef.current) audioRef.current.volume = volume;
   }, [volume]);

   const getVolumeRatio = useCallback((clientY: number) => {
      const track = volumeTrackRef.current;
      if (!track) return 0;
      const rect = track.getBoundingClientRect();
      return Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
   }, []);

   const onVolumePointerDown = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>) => {
         volumeDraggingRef.current = true;
         e.currentTarget.setPointerCapture(e.pointerId);
         setVolume(getVolumeRatio(e.clientY));
      },
      [getVolumeRatio],
   );

   const onVolumePointerMove = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>) => {
         if (!volumeDraggingRef.current) return;
         setVolume(getVolumeRatio(e.clientY));
      },
      [getVolumeRatio],
   );

   const onVolumePointerUp = useCallback(() => {
      volumeDraggingRef.current = false;
   }, []);

   const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

   if (!mounted) return null;

   return (
      <div className={styles.playerWrapper}>
         <div className={styles.volumeControl}>
            <div
               ref={volumeTrackRef}
               className={styles.volumeTrack}
               onPointerDown={onVolumePointerDown}
               onPointerMove={onVolumePointerMove}
               onPointerUp={onVolumePointerUp}
               onPointerCancel={onVolumePointerUp}
               role="slider"
               tabIndex={0}
               aria-label="Volume"
               aria-valuenow={Math.round(volume * 100)}
               aria-valuemin={0}
               aria-valuemax={100}
               aria-orientation="vertical"
            >
               <div
                  className={styles.volumeFill}
                  style={{ height: `max(14px, calc(${volume * 100}% - 4px))` }}
               />
            </div>
         </div>
         <div className={styles.player}>
            {/* biome-ignore lint/a11y/useMediaCaption: decorative audio player */}
            <audio ref={audioRef} preload="metadata" />

            <div className={styles.top}>
               {/* biome-ignore lint/performance/noImgElement: showcase component */}
               <img
                  className={styles.cover}
                  src={track.cover}
                  alt={track.title}
               />
               <div className={styles.info}>
                  <span className={styles.title}>{track.title}</span>
                  <span className={styles.artist}>{track.artist}</span>
               </div>
               <div className={styles.waveform}>
                  {bars.map((h, i) => {
                     const center = (BAR_COUNT - 1) / 2;
                     const t = Math.abs(i - center) / center;
                     return (
                        <div
                           // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length bars with no stable id
                           key={`bar-${i}`}
                           className={styles.bar}
                           style={{
                              height: `${h}%`,
                              background: `linear-gradient(to bottom, ${track.color}, ${track.colorAlt})`,
                              filter: `brightness(${1 + (1 - t) * 0.25})`,
                           }}
                        />
                     );
                  })}
               </div>
            </div>

            <div className={styles.progressRow}>
               <span className={styles.time}>{formatTime(currentTime)}</span>
               <div
                  ref={progressRef}
                  className={styles.progressWrapper}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  role="progressbar"
                  aria-valuenow={Math.round(currentTime)}
                  aria-valuemin={0}
                  aria-valuemax={Math.round(duration)}
               >
                  <div
                     className={styles.progress}
                     style={{ width: `${progress}%` }}
                  />
               </div>
               <span className={styles.time}>
                  {formatTime(duration - currentTime, true)}
               </span>
            </div>

            <div className={styles.bottom}>
               <div className={styles.controls}>
                  <button
                     type="button"
                     onClick={prevTrack}
                     aria-label="Previous track"
                  >
                     <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                     >
                        <path d="M2.75 20a1 1 0 1 0 2 0V4a1 1 0 1 0-2 0v16ZM20.75 19.053c0 1.424-1.612 2.252-2.77 1.422L7.51 12.968a1.75 1.75 0 0 1 .075-2.895l10.47-6.716c1.165-.748 2.695.089 2.695 1.473v14.223Z" />
                     </svg>
                  </button>
                  <button
                     type="button"
                     onClick={togglePlay}
                     className={styles.playBtn}
                     aria-label={isPlaying ? "Pause" : "Play"}
                  >
                     <svg
                        viewBox="6 5 13 14"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                     >
                        <path d="M13 15L8 18L8 6L13 9L13 9M13 9L18 12L18 12L13 15L13 15">
                           <animate
                              ref={toPauseRef}
                              fill="freeze"
                              attributeName="d"
                              dur="0.45s"
                              begin="indefinite"
                              keyTimes="0;0.66;1"
                              values="M13 15L8 18L8 6L13 9L13 9M13 9L18 12L18 12L13 15L13 15;M13 15L8 18L8 6L13 9L13 15M13 9L18 12L18 12L13 15L13 9;M9 18L7 18L7 6L9 6L9 18M15 6L17 6L17 18L15 18L15 6"
                           />
                           <animate
                              ref={toPlayRef}
                              fill="freeze"
                              attributeName="d"
                              dur="0.45s"
                              begin="indefinite"
                              keyTimes="0;0.66;1"
                              values="M9 18L7 18L7 6L9 6L9 18M15 6L17 6L17 18L15 18L15 6;M13 15L8 18L8 6L13 9L13 15M13 9L18 12L18 12L13 15L13 9;M13 15L8 18L8 6L13 9L13 9M13 9L18 12L18 12L13 15L13 15"
                           />
                        </path>
                     </svg>
                  </button>
                  <button
                     type="button"
                     onClick={nextTrack}
                     aria-label="Next track"
                  >
                     <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        style={{ transform: "scaleX(-1)" }}
                     >
                        <path d="M2.75 20a1 1 0 1 0 2 0V4a1 1 0 1 0-2 0v16ZM20.75 19.053c0 1.424-1.612 2.252-2.77 1.422L7.51 12.968a1.75 1.75 0 0 1 .075-2.895l10.47-6.716c1.165-.748 2.695.089 2.695 1.473v14.223Z" />
                     </svg>
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AudioPlayer;
