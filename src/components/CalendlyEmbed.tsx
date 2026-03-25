"use client";

import { useEffect } from "react";

export default function CalendlyEmbed() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="calendly-inline-widget"
      data-url="https://calendly.com/stackleaps/30min?hide_gdpr_banner=1&background_color=141414&text_color=f0f0f0&primary_color=00ff88"
      style={{ minWidth: "320px", height: "700px" }}
    />
  );
}
