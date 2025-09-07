"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Particles } from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground({ darkMode = false }) {
  const [engineReady, setEngineReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setEngineReady(true));
  }, []);

  const options = useMemo(() => {
    const linkColor = darkMode ? "#FFFFFF" : "#111827"; // slate-900
    const linkOpacity = darkMode ? 0.12 : 0.22;
    const brandColors = ["#FF6F3C", "#FFA26B", "#FFCDB2", "#1E90FF", "#A0C4FF"]; // orange + cool accents
  const opacityRange = darkMode ? { min: 0.15, max: 0.4 } : { min: 0.25, max: 0.55 };
  const sizeRange = darkMode ? { min: 1, max: 3 } : { min: 1.5, max: 3.5 };
  const baseSpeed = reducedMotion ? 0.04 : (darkMode ? 0.10 : 0.12);
    return {
      fullScreen: { enable: false },
      detectRetina: true,
      pauseOnOutsideViewport: true,
      background: { color: "transparent" },
      fpsLimit: 90,
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: { enable: true, mode: ["repulse", "bubble"] },
          onClick: { enable: true, mode: ["push"] },
          resize: true,
        },
        modes: {
          repulse: { distance: 100, duration: 0.35, factor: 40 },
          bubble: { distance: 110, duration: 1.4, opacity: 0.55, size: 3.5, color: { value: darkMode ? "#ffffff" : "#111827" } },
          push: { quantity: 1 },
        },
      },
      particles: {
        number: {
          value: 110,
          density: { enable: true, area: 800 },
        },
        color: { value: brandColors },
        shape: { type: "circle" },
        opacity: { value: opacityRange, animation: { enable: true, speed: 0.3, minimumValue: 0.12, sync: false } },
        size: { value: sizeRange, animation: { enable: true, speed: 1.2, minimumValue: 0.7, sync: false } },
        links: { enable: true, color: linkColor, distance: 130, opacity: linkOpacity, width: 1, triangles: { enable: false } },
        move: {
          enable: true,
          speed: baseSpeed,
          direction: "none",
          random: false,
          straight: false,
          outModes: { default: "out" },
          attract: { enable: false },
          center: { x: 50, y: 50, mode: "percent" },
        },
      },
      responsive: [
        { maxWidth: 1024, options: { particles: { number: { value: 85 } } } },
        { maxWidth: 768, options: { particles: { number: { value: 60 } } } },
        { maxWidth: 480, options: { particles: { number: { value: 42 } } } },
      ],
    };
  }, [darkMode, reducedMotion]);

  if (!engineReady) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Particles id="unishare-particles" options={options} />
    </div>
  );
}
