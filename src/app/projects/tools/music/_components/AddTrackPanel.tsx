"use client";

import { useCallback, useState } from "react";
import { INSTRUMENT_CATALOG, MAX_TRACKS } from "../_lib/constants";
import type { InstrumentId } from "../_lib/types";
import s from "../music.module.scss";

interface AddTrackPanelProps {
   trackCount: number;
   onAdd: (instrumentId: InstrumentId) => void;
   onAddAll: () => void;
}

export function AddTrackPanel({
   trackCount,
   onAdd,
   onAddAll,
}: AddTrackPanelProps) {
   const [open, setOpen] = useState(false);
   const disabled = trackCount >= MAX_TRACKS;

   const handleSelect = useCallback(
      (id: InstrumentId) => {
         onAdd(id);
         setOpen(false);
      },
      [onAdd],
   );

   return (
      <div className={s.addPanel}>
         <div className={s.addBtnRow}>
            <button
               type="button"
               className={s.addBtn}
               disabled={disabled}
               onClick={() => setOpen(!open)}
            >
               + ADD TRACK
            </button>
            <button
               type="button"
               className={s.addAllBtn}
               disabled={disabled}
               onClick={onAddAll}
               title="Add all remaining instruments"
            >
               ADD ALL
            </button>
         </div>
         {open && (
            <div className={s.addDropdown}>
               {INSTRUMENT_CATALOG.map((preset) => (
                  <button
                     type="button"
                     key={preset.id}
                     className={s.addDropdownItem}
                     onClick={() => handleSelect(preset.id)}
                  >
                     <span
                        className={s.trackDot}
                        style={{ background: preset.color }}
                     />
                     <span>{preset.label}</span>
                  </button>
               ))}
            </div>
         )}
      </div>
   );
}
