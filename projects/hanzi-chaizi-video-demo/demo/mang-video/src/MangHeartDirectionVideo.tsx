import React from "react";
import {Audio} from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import mangData from "hanzi-writer-data/忙.json";
import heartData from "hanzi-writer-data/心.json";
import deathData from "hanzi-writer-data/亡.json";
import captionsData from "./generated-mang-captions.json";
import voiceover from "./generated-mang-voiceover.json";
import {CaptionLine, type DemoCaption} from "./CaptionLine";

const COLORS = {
  paper: "#eaf3f8",
  paperDeep: "#d6e7f0",
  navy: "#112b4a",
  blue: "#267aa5",
  coral: "#ff735f",
  white: "#f8fbff",
  line: "rgba(17,43,74,0.18)",
};

type Point = readonly [number, number];

const medianLength = (points: readonly Point[]) =>
  points.slice(1).reduce((sum, point, index) => {
    const previous = points[index];
    return sum + Math.hypot(point[0] - previous[0], point[1] - previous[1]);
  }, 0);

const lengths = mangData.medians.map((median) =>
  medianLength(median.map(([x, y]) => [x, y] as Point)),
);
const totalLength = lengths.reduce((sum, length) => sum + length, 0);
let spanCursor = 0;
const MANG_STROKES = mangData.strokes.map((shape, index) => {
  const start = spanCursor / totalLength;
  spanCursor += lengths[index];
  const end = spanCursor / totalLength;
  const median = mangData.medians[index]
    .map((point, pointIndex) =>
      `${pointIndex === 0 ? "M" : "L"} ${point[0]} ${point[1]}`,
    )
    .join(" ");
  return {
    shape,
    median,
    length: lengths[index],
    span: [start, end] as const,
    component: index < 3 ? ("heart" as const) : ("death" as const),
  };
});

const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const timedProgress = (
  frame: number,
  fps: number,
  startSeconds: number,
  endSeconds: number,
  easing = easeInOut,
) =>
  interpolate(frame, [startSeconds * fps, endSeconds * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

const strokeProgress = (total: number, span: readonly [number, number]) =>
  interpolate(total, span, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const FilledPaths: React.FC<{paths: readonly string[]; color: string}> = ({
  paths,
  color,
}) => (
  <>
    {paths.map((path) => (
      <path key={path} d={path} fill={color} />
    ))}
  </>
);

const PaperTexture: React.FC = () => (
  <AbsoluteFill
    style={{
      opacity: 0.38,
      backgroundImage:
        "linear-gradient(rgba(17,43,74,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(17,43,74,.055) 1px, transparent 1px)",
      backgroundSize: "42px 42px",
    }}
  />
);

const SceneFrame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: COLORS.paper, color: COLORS.navy}}>
    <PaperTexture />
    <div
      style={{
        position: "absolute",
        inset: 30,
        border: `6px solid ${COLORS.navy}`,
        borderRadius: 36,
        boxShadow: "inset 0 0 0 10px rgba(255,255,255,.45)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 74,
        right: 74,
        top: 64,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div style={{fontSize: 22, fontWeight: 900, letterSpacing: 4}}>我们的补充演示</div>
        <div style={{marginTop: 5, color: COLORS.blue, fontSize: 16, fontWeight: 800}}>
          第二个汉字 · 新文案 · 新主题 · 新音色
        </div>
      </div>
      <div
        style={{
          padding: "11px 18px",
          borderRadius: 999,
          color: COLORS.white,
          background: COLORS.coral,
          fontSize: 16,
          fontWeight: 900,
        }}
      >
        忙而不乱
      </div>
    </div>
    {children}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 68,
        textAlign: "center",
        color: COLORS.blue,
        fontSize: 16,
        fontWeight: 800,
        letterSpacing: 2,
      }}
    >
      趣味联想 · 不等于历史字源
    </div>
  </AbsoluteFill>
);

const TopWriting: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const totalProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 76,
        right: 76,
        top: 154,
        height: 680,
        border: `4px solid ${COLORS.line}`,
        borderRadius: 30,
        background: "rgba(255,255,255,.62)",
        boxShadow: "0 18px 44px rgba(17,43,74,.10)",
        padding: "16px 100px 10px",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 26,
          top: 24,
          color: COLORS.blue,
          fontSize: 16,
          fontWeight: 900,
          letterSpacing: 3,
        }}
      >
        01 / 按真实笔顺书写
      </div>
      <svg viewBox="0 0 1024 920" style={{width: "100%", height: "100%"}}>
        <defs>
          {MANG_STROKES.map((stroke, index) => (
            <clipPath id={`mang-top-${index}`} key={stroke.shape}>
              <path d={stroke.shape} />
            </clipPath>
          ))}
        </defs>
        <g transform="scale(1,-1) translate(0,-900)">
          {MANG_STROKES.map((stroke) => (
            <path key={`ghost-${stroke.shape}`} d={stroke.shape} fill={COLORS.navy} opacity={0.08} />
          ))}
          {MANG_STROKES.map((stroke, index) => {
            const local = strokeProgress(totalProgress, stroke.span);
            const fillOpacity = interpolate(local, [0.86, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const drawOpacity = interpolate(local, [0, 0.04, 0.94, 1], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <React.Fragment key={`stroke-${stroke.shape}`}>
                <path d={stroke.shape} fill={COLORS.navy} opacity={fillOpacity} />
                <path
                  d={stroke.median}
                  fill="none"
                  stroke={COLORS.navy}
                  strokeWidth={118}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={`${stroke.length} ${stroke.length}`}
                  strokeDashoffset={stroke.length * (1 - local)}
                  opacity={drawOpacity}
                  clipPath={`url(#mang-top-${index})`}
                />
              </React.Fragment>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

const BottomSplit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = timedProgress(frame, fps, 0.25, 0.85, easeOut);
  const split = timedProgress(frame, fps, 0.95, 2.25);
  const morph = timedProgress(frame, fps, 2.35, 3.85);
  const sourceOpacity = 1 - morph;
  const finalOpacity = morph;
  const finalScale = interpolate(morph, [0, 1], [0.82, 1]);
  const heartOffset = interpolate(split, [0, 1], [0, -64]);
  const deathOffset = interpolate(split, [0, 1], [0, 86]);

  const heartRadical = MANG_STROKES.filter((stroke) => stroke.component === "heart").map(
    (stroke) => stroke.shape,
  );
  const deathComponent = MANG_STROKES.filter((stroke) => stroke.component === "death").map(
    (stroke) => stroke.shape,
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 76,
        right: 76,
        top: 866,
        height: 490,
        overflow: "hidden",
        border: `4px solid ${COLORS.line}`,
        borderRadius: 30,
        background: "rgba(255,255,255,.62)",
        boxShadow: "0 18px 44px rgba(17,43,74,.10)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 26,
          top: 24,
          zIndex: 2,
          color: COLORS.blue,
          fontSize: 16,
          fontWeight: 900,
          letterSpacing: 3,
        }}
      >
        02 / 部件分离与联想
      </div>
      <svg
        viewBox="0 0 1024 900"
        style={{position: "absolute", inset: 0, width: "100%", height: "100%", opacity: enter}}
      >
        <g opacity={sourceOpacity} transform="translate(102 52) scale(.80)">
          <g transform="scale(1,-1) translate(0,-900)">
            <g transform={`translate(${heartOffset} 0)`}>
              <FilledPaths paths={heartRadical} color={COLORS.coral} />
            </g>
            <g transform={`translate(${deathOffset} 0)`}>
              <FilledPaths paths={deathComponent} color={COLORS.blue} />
            </g>
          </g>
        </g>

        <g opacity={finalOpacity} transform={`translate(102 278) scale(${0.37 * finalScale})`}>
          <g transform="scale(1,-1) translate(0,-900)">
            <FilledPaths paths={heartData.strokes} color={COLORS.coral} />
          </g>
        </g>
        <g opacity={finalOpacity} transform={`translate(586 248) scale(${0.43 * finalScale})`}>
          <g transform="scale(1,-1) translate(0,-900)">
            <FilledPaths paths={deathData.strokes} color={COLORS.blue} />
          </g>
        </g>
        <g opacity={finalOpacity}>
          <path d="M478 460 L546 460" stroke={COLORS.navy} strokeWidth={7} strokeLinecap="round" />
          <path d="M528 438 L551 460 L528 482" fill="none" stroke={COLORS.navy} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
};

const CAPTIONS = captionsData as DemoCaption[];

export const MangHeartDirectionVideo: React.FC = () => {
  const {width, height} = useVideoConfig();
  if (width !== 1080 || height !== 1920) {
    throw new Error("MangHeartDirectionVideo expects 1080x1920.");
  }

  return (
    <SceneFrame>
      <Audio src={staticFile(voiceover.bgmFile)} volume={0.7} loop />
      <Audio src={staticFile(voiceover.audioFile)} volume={1} />
      <TopWriting />
      <BottomSplit />
      <CaptionLine captions={CAPTIONS} />
    </SceneFrame>
  );
};
