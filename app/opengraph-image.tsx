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
          background: "#f0efe9",
          color: "#322d2a",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, letterSpacing: "-0.01em" }}>
          <span>Vidran</span>
          <span style={{ marginLeft: 10, color: "#6a635e" }}>Labs</span>
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 300, lineHeight: 1, letterSpacing: "0.01em", maxWidth: 980 }}>
          Technology for Systems That Matter.
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 22, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          <div style={{ width: 8, height: 8, background: "#322d2a", marginRight: 16 }} />
          Software · AI · Automation · Data · Infrastructure
        </div>
      </div>
    ),
    size,
  );
}
