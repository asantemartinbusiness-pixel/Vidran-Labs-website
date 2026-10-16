import { ImageResponse } from "next/og";

export const alt = "Vidran Labs — Technology for Systems That Matter.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** PROVISIONAL social preview (original OG imagery not recovered — asset A-05). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#0b0f14",
          color: "#ecebe6",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, letterSpacing: "-0.01em" }}>
          <span style={{ fontWeight: 700 }}>Vidran</span>
          <span style={{ marginLeft: 10, color: "#a7adb5" }}>Labs</span>
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 980 }}>
          Technology for Systems That Matter.
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#86d3bc", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Software · AI · Automation · Data · Infrastructure
        </div>
      </div>
    ),
    size,
  );
}
