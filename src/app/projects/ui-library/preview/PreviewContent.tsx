"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import AudioPlayer from "../_components/AudioPlayer/AudioPlayer";
import CardStack from "../_components/CardStack/CardStack";
import ClockRound from "../_components/ClockRound/ClockRound";
import ContextMenu from "../_components/ContextMenu/ContextMenu";
import DesignerDeck from "../_components/DesignerDeck/DesignerDeck";
import EyesButton from "../_components/EyesButton/EyesButton";
import FitnessTracker from "../_components/FitnessTracker/FitnessTracker";
import GalleryUsers from "../_components/GalleryUsers/GalleryUsers";
import LyricCard from "../_components/LyricCard/LyricCard";
import Schedule from "../_components/Schedule/Schedule";
import StockInfo from "../_components/StockInfo/StockInfo";
import TodoList from "../_components/TodoList/TodoList";
import ToggleSwitch from "../_components/ToggleSwitch/ToggleSwitch";
import WeatherForecast from "../_components/WeatherForecast/WeatherForecast";
import WordPopup from "../_components/WordPopup/WordPopup";

const PreviewContent = () => {
   const { resolvedTheme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);

   useEffect(() => setMounted(true), []);

   const currentTheme: "light" | "dark" =
      mounted && resolvedTheme === "dark" ? "dark" : "light";

   const labelStyle: React.CSSProperties = {
      display: "block",
      textAlign: "center",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      opacity: 0.45,
      marginBottom: 6,
      fontFamily: "system-ui, sans-serif",
   };

   return (
      <div
         style={{
            padding: 26,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 23,
            height: "100svh",
         }}
      >
         <section style={{ position: "absolute", top: 16, left: 16 }}>
            <ToggleSwitch
               checked={currentTheme === "dark"}
               onChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
         </section>

         <section style={{ display: "none" }}>
            <span style={labelStyle}>GalleryUsers</span>
            <GalleryUsers />
         </section>
         <section style={{ display: "none" }}>
            <span style={labelStyle}>ClockRound</span>
            <ClockRound />
         </section>
         <section style={{ display: "none" }}>
            <span style={labelStyle}>AudioPlayer</span>
            <AudioPlayer />
         </section>
         <section style={{ display: "none" }}>
            <span style={labelStyle}>WeatherForecast</span>
            <WeatherForecast />
         </section>

         <section style={{ display: "none" }}>
            <span style={labelStyle}>CardStack</span>
            <CardStack />
         </section>

         <section style={{ display: "none" }}>
            <span style={labelStyle}>FitnessTracker</span>
            <FitnessTracker />
         </section>

         <section style={{ display: "none" }}>
            <span style={labelStyle}>Schedule</span>
            <Schedule />
         </section>

         <section style={{ display: "none" }}>
            <span style={labelStyle}>LyricCard</span>
            <LyricCard />
         </section>

         <section style={{ display: "none" }}>
            <span style={labelStyle}>TodoList</span>
            <TodoList />
         </section>

         <section style={{ display: "none" }}>
            <span style={labelStyle}>StockInfo</span>
            <StockInfo />
         </section>

         <section style={{ display: "none" }}>
            <span style={labelStyle}>ContextMenu</span>
            <ContextMenu />
         </section>

         <section style={{ display: "none" }}>
            <span style={labelStyle}>EyesButton</span>
            <EyesButton />
         </section>

         <section style={{ display: "none" }}>
            <span style={labelStyle}>DesignerDeck</span>
            <DesignerDeck />
         </section>

         <section style={{ display: "none" }}>
            <span style={labelStyle}>WordPopup</span>
            <WordPopup />
         </section>
      </div>
   );
};

export default PreviewContent;
