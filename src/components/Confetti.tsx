import { useEffect, useRef } from "react";

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

const COLORS = ["#FF1A75", "#7B2FFF", "#FFD700", "#00E5FF", "#00E676", "#FF6D00", "#FF69B4", "#00BFFF"];
const SHAPES = ["square", "circle", "triangle"];

export default function Confetti({ active, duration = 3000 }: ConfettiProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const pieces: HTMLDivElement[] = [];

    for (let i = 0; i < 80; i++) {
      const piece = document.createElement("div");
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const size = Math.random() * 12 + 6;
      const left = Math.random() * 100;
      const delay = Math.random() * 1.5;
      const fallDuration = Math.random() * 2 + 2;

      piece.style.cssText = `
        position: fixed;
        left: ${left}%;
        top: -20px;
        width: ${size}px;
        height: ${shape === "triangle" ? 0 : size}px;
        background: ${shape !== "triangle" ? color : "transparent"};
        border-radius: ${shape === "circle" ? "50%" : shape === "square" ? "2px" : "0"};
        border-left: ${shape === "triangle" ? `${size / 2}px solid transparent` : "none"};
        border-right: ${shape === "triangle" ? `${size / 2}px solid transparent` : "none"};
        border-bottom: ${shape === "triangle" ? `${size}px solid ${color}` : "none"};
        animation: confetti-fall ${fallDuration}s ${delay}s linear forwards;
        pointer-events: none;
        z-index: 9999;
      `;

      container.appendChild(piece);
      pieces.push(piece);
    }

    const timer = setTimeout(() => {
      pieces.forEach(p => p.remove());
    }, duration + 2000);

    return () => {
      clearTimeout(timer);
      pieces.forEach(p => p.remove());
    };
  }, [active, duration]);

  return <div ref={containerRef} />;
}
