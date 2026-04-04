"use client";

import { type ReactNode, useState } from "react";
import { useLang } from "@/providers/LangProvider";
import s from "./ReadMore.module.scss";

const ReadMore = ({ children }: { children: ReactNode }) => {
   const [open, setOpen] = useState(false);
   const { t } = useLang();

   return (
      <>
         {open && children}
         <button type="button" className={s.btn} onClick={() => setOpen(!open)}>
            {open ? t.readMore.collapse : t.readMore.expand}
         </button>
      </>
   );
};

export default ReadMore;
