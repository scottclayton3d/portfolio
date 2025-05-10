import React, { useEffect, useRef } from "react";

interface UnicornStudioEmbedProps {
  projectId?: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

const DEFAULT_PROJECT_ID = "v1yhIpQy3029OZVSQU3v";
const DEFAULT_WIDTH = 1440;
const DEFAULT_HEIGHT = 900;

export const UnicornStudioEmbed: React.FC<UnicornStudioEmbedProps> = ({
  projectId = DEFAULT_PROJECT_ID,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  style = {},
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.UnicornStudio?.isInitialized) return;
    const scriptId = "unicornstudio-embed-script";
    if (document.getElementById(scriptId)) return;
    const script: HTMLScriptElement = document.createElement("script");
    script.id = scriptId;
    script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.20/dist/unicornStudio.umd.js";
    script.async = true;
    script.onload = () => {
      if (!window.UnicornStudio.isInitialized) {
        window.UnicornStudio.init();
        window.UnicornStudio.isInitialized = true;
      }
    };
    (document.head || document.body).appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      data-us-project={projectId}
      style={{ width, height, ...style }}
      className={className}
    />
  );
};

declare global {
  interface Window {
    UnicornStudio: {
      isInitialized: boolean;
      init: () => void;
    };
  }
}