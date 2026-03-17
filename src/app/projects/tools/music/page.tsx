"use client";

import dynamic from "next/dynamic";

const MusicApp = dynamic(() => import("./_components/MusicApp"), {
   ssr: false,
});

export default function MusicPage() {
   return <MusicApp />;
}
