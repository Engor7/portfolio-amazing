"use client";

import { type ReactNode, useState } from "react";
import s from "./ReadMore.module.scss";

const ReadMore = ({ children }: { children: ReactNode }) => {
   const [open, setOpen] = useState(false);

   return (
      <>
         {open && children}
         <button type="button" className={s.btn} onClick={() => setOpen(!open)}>
            {open ? "Свернуть" : "Читать полностью"}
         </button>
      </>
   );
};

export default ReadMore;
