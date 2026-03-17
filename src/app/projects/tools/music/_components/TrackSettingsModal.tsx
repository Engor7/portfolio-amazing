"use client";

import { memo, useCallback } from "react";
import type { TrackConfig } from "../_lib/types";
import s from "../music.module.scss";
import { Slider } from "./Slider";

interface TrackSettingsModalProps {
   track: TrackConfig;
   isOpen: boolean;
   onClose: () => void;
   onSetVolume: (trackId: string, volume: number) => void;
   onToggleMute: (trackId: string) => void;
   onRemove: (trackId: string) => void;
   color: string;
}

export const TrackSettingsModal = memo(function TrackSettingsModal({
   track,
   isOpen,
   onClose,
   onSetVolume,
   onToggleMute,
   onRemove,
   color,
}: TrackSettingsModalProps) {
   const handleVolumeChange = useCallback(
      (v: number) => {
         onSetVolume(track.id, v);
      },
      [track.id, onSetVolume],
   );

   const handleRemove = useCallback(() => {
      onRemove(track.id);
      onClose();
   }, [track.id, onRemove, onClose]);

   if (!isOpen) return null;

   return (
      <>
         <div
            className={s.modalOverlay}
            onClick={onClose}
            role="presentation"
         />
         <div className={s.modal}>
            <div className={s.modalHeader}>
               <h3 className={s.modalTitle}>{track.label}</h3>
               <button
                  type="button"
                  className={s.modalClose}
                  onClick={onClose}
                  title="Close"
               >
                  ✕
               </button>
            </div>

            <div className={s.modalContent}>
               <div className={s.settingGroup}>
                  <label className={s.settingLabel}>Volume</label>
                  <Slider
                     min={-24}
                     max={6}
                     value={track.volume}
                     onChange={handleVolumeChange}
                     color={color}
                  />
                  <span className={s.volumeValue}>{track.volume.toFixed(1)} dB</span>
               </div>

               <div className={s.settingGroup}>
                  <button
                     type="button"
                     className={`${s.settingBtn} ${track.muted ? s.settingBtnActive : ""}`}
                     onClick={() => onToggleMute(track.id)}
                  >
                     {track.muted ? "🔇 Unmute" : "🔊 Mute"}
                  </button>
               </div>

               <div className={s.settingGroup}>
                  <button
                     type="button"
                     className={`${s.settingBtn} ${s.removeBtnStyle}`}
                     onClick={handleRemove}
                  >
                     🗑 Remove Track
                  </button>
               </div>
            </div>
         </div>
      </>
   );
});
