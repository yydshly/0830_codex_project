import React from "react";
import {interpolate, useCurrentFrame, useVideoConfig} from "remotion";

export type DemoCaption = {
  text: string;
  startMs: number;
  endMs: number;
};

const HIGHLIGHTS = ["忙", "心", "亡", "方向", "从容"];

const emphasize = (text: string) => {
  const pattern = new RegExp(`(${HIGHLIGHTS.join("|")})`, "g");
  return text.split(pattern).map((part, index) => (
    <span
      key={`${part}-${index}`}
      style={{color: HIGHLIGHTS.includes(part) ? "#ff735f" : "#f8fbff"}}
    >
      {part}
    </span>
  ));
};

export const CaptionLine: React.FC<{captions: DemoCaption[]}> = ({captions}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const currentMs = (frame / fps) * 1000;
  const active = captions.find(
    (caption) => currentMs >= caption.startMs && currentMs < caption.endMs,
  );

  if (!active) {
    return null;
  }

  const localMs = currentMs - active.startMs;
  const enter = interpolate(localMs, [0, 180], [0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 76,
        right: 76,
        bottom: 142,
        minHeight: 132,
        padding: "24px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 26,
        background: "#112b4a",
        border: "4px solid rgba(255,255,255,0.9)",
        boxShadow: "0 14px 28px rgba(17,43,74,0.18)",
        transform: `scale(${enter})`,
      }}
    >
      <div
        style={{
          fontSize: active.text.length > 17 ? 39 : 46,
          fontWeight: 900,
          lineHeight: 1.35,
          letterSpacing: 1,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {emphasize(active.text)}
      </div>
    </div>
  );
};
