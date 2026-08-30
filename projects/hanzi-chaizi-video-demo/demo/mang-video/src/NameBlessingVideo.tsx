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
import muData from "hanzi-writer-data/沐.json";
import yangData from "hanzi-writer-data/阳.json";
import productData from "../../../web/data/name-blessing.json";

export type BlessingOccasion = "birthday" | "wedding" | "newborn" | "brand";
export type BlessingStyle = "aurora" | "ink" | "fireworks";

export type NameBlessingProps = {
  name: string;
  occasion: BlessingOccasion;
  style: BlessingStyle;
  blessing: string;
  signature: string;
  date: string;
  accent: string;
};

type Point = readonly [number, number];
type HanziData = {strokes: string[]; medians: number[][][]};
type BlessingCatalog = {
  occasions: Array<{
    id: BlessingOccasion;
    label: string;
    kicker: string;
    defaultBlessing: string;
  }>;
  styles: Array<{
    id: BlessingStyle;
    label: string;
    background: string;
    surface: string;
    ink: string;
    muted: string;
    primary: string;
    secondary: string;
    accent: string;
  }>;
  sample: NameBlessingProps;
};

const CATALOG = productData as BlessingCatalog;
export const DEFAULT_NAME_BLESSING_PROPS = CATALOG.sample;

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const smooth = Easing.bezier(0.45, 0, 0.55, 1);
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const progress = (
  frame: number,
  start: number,
  end: number,
  easing = ease,
) => interpolate(frame, [start, end], [0, 1], {...clamp, easing});

const medianLength = (points: readonly Point[]) =>
  points.slice(1).reduce((sum, point, index) => {
    const previous = points[index];
    return sum + Math.hypot(point[0] - previous[0], point[1] - previous[1]);
  }, 0);

const buildStrokes = (data: HanziData) => {
  const lengths = data.medians.map((median) =>
    medianLength(median.map(([x, y]) => [x, y] as Point)),
  );
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let cursor = 0;
  return data.strokes.map((shape, index) => {
    const start = cursor / total;
    cursor += lengths[index];
    return {
      shape,
      length: lengths[index],
      median: data.medians[index]
        .map((point, pointIndex) =>
          `${pointIndex === 0 ? "M" : "L"} ${point[0]} ${point[1]}`,
        )
        .join(" "),
      span: [start, cursor / total] as const,
    };
  });
};

const MU_STROKES = buildStrokes(muData as HanziData);
const YANG_STROKES = buildStrokes(yangData as HanziData);

const PARTICLES = Array.from({length: 38}, (_, index) => ({
  x: (index * 83 + 17) % 100,
  y: (index * 47 + 11) % 100,
  size: 3 + ((index * 7) % 8),
  delay: (index * 11) % 70,
  drift: 18 + ((index * 13) % 42),
}));

const StrokeCharacter: React.FC<{
  idPrefix: string;
  label: string;
  strokes: ReturnType<typeof buildStrokes>;
  draw: number;
  componentCut: number;
  primary: string;
  secondary: string;
  ink: string;
  entrance: number;
}> = ({
  idPrefix,
  label,
  strokes,
  draw,
  componentCut,
  primary,
  secondary,
  ink,
  entrance,
}) => (
  <div
    style={{
      position: "relative",
      height: 670,
      overflow: "hidden",
      border: `2px solid ${primary}55`,
      borderRadius: 46,
      opacity: entrance,
      transform: `translateY(${(1 - entrance) * 56}px) scale(${0.94 + entrance * 0.06})`,
      background: `linear-gradient(155deg, ${primary}18, transparent 44%, ${secondary}10)`,
      boxShadow: `inset 0 0 70px ${primary}16, 0 24px 70px rgba(0,0,0,.22)`,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 24,
        top: 22,
        zIndex: 2,
        color: primary,
        fontSize: 16,
        fontWeight: 900,
        letterSpacing: 3,
      }}
    >
      {label}
    </div>
    <div
      style={{
        position: "absolute",
        inset: 70,
        border: `1px solid ${ink}1f`,
        borderRadius: "50%",
        boxShadow: `0 0 90px ${primary}20`,
      }}
    />
    <svg
      viewBox="0 0 1024 900"
      style={{position: "absolute", inset: "90px 26px 40px", width: "calc(100% - 52px)", height: "calc(100% - 130px)"}}
    >
      <defs>
        {strokes.map((stroke, index) => (
          <clipPath id={`${idPrefix}-stroke-${index}`} key={`${idPrefix}-clip-${index}`}>
            <path d={stroke.shape} />
          </clipPath>
        ))}
      </defs>
      <path d="M512 0V900M0 450H1024M0 0L1024 900M1024 0L0 900" stroke={`${ink}12`} strokeWidth="3" strokeDasharray="18 20" />
      <g transform="scale(1,-1) translate(0,-900)" style={{filter: `drop-shadow(0 0 18px ${primary}88)`}}>
        {strokes.map((stroke) => (
          <path key={`${idPrefix}-ghost-${stroke.shape}`} d={stroke.shape} fill={ink} opacity={0.055} />
        ))}
        {strokes.map((stroke, index) => {
          const local = interpolate(draw, stroke.span, [0, 1], clamp);
          const color = index < componentCut ? secondary : primary;
          const fillOpacity = interpolate(local, [0.82, 1], [0, 1], clamp);
          return (
            <React.Fragment key={`${idPrefix}-${stroke.shape}`}>
              <path d={stroke.shape} fill={color} opacity={fillOpacity} />
              <path
                d={stroke.median}
                fill="none"
                stroke={color}
                strokeWidth={118}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={`${stroke.length} ${stroke.length}`}
                strokeDashoffset={stroke.length * (1 - local)}
                clipPath={`url(#${idPrefix}-stroke-${index})`}
              />
            </React.Fragment>
          );
        })}
      </g>
    </svg>
  </div>
);

export const NameBlessingVideo: React.FC<NameBlessingProps> = (props) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const occasion = CATALOG.occasions.find((item) => item.id === props.occasion) ?? CATALOG.occasions[0];
  const style = CATALOG.styles.find((item) => item.id === props.style) ?? CATALOG.styles[0];
  const firstEnter = progress(frame, 18, 48);
  const secondEnter = progress(frame, 42, 72);
  const firstDraw = progress(frame, 38, 150, smooth);
  const secondDraw = progress(frame, 76, 188, smooth);
  const complete = progress(frame, 188, 230);
  const blessingEnter = progress(frame, 215, 270);
  const signatureEnter = progress(frame, 260, 310);
  const shimmer = interpolate(frame % 96, [0, 48, 96], [-120, 120, -120]);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        color: style.ink,
        background: style.background,
        fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      <Audio src={staticFile("audio/background.mp3")} volume={0.8} />
      <AbsoluteFill
        style={{
          opacity: 0.46,
          backgroundImage: `radial-gradient(circle at 15% 18%, ${style.secondary}33, transparent 28%), radial-gradient(circle at 88% 74%, ${props.accent}2c, transparent 30%), linear-gradient(155deg, transparent 20%, ${style.primary}12 52%, transparent 76%)`,
        }}
      />

      {PARTICLES.map((particle, index) => {
        const local = (frame + particle.delay) % 100;
        const opacity = interpolate(local, [0, 35, 70, 100], [0.08, 0.75, 0.22, 0.08]);
        const y = particle.y - (local / 100) * particle.drift;
        return (
          <div
            key={`particle-${index}`}
            style={{
              position: "absolute",
              left: `${particle.x}%`,
              top: `${y}%`,
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              opacity,
              background: index % 3 === 0 ? style.secondary : props.accent,
              boxShadow: `0 0 ${particle.size * 3}px ${index % 2 === 0 ? style.primary : style.secondary}`,
            }}
          />
        );
      })}

      <div style={{position: "absolute", left: 64, right: 64, top: 60, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div>
          <div style={{fontSize: 23, fontWeight: 950, letterSpacing: 5}}>名字高光时刻</div>
          <div style={{marginTop: 6, color: style.muted, fontSize: 15, fontWeight: 800, letterSpacing: 2}}>NAME BLESSING / REAL REMOTION SAMPLE</div>
        </div>
        <div style={{padding: "10px 18px", border: `1px solid ${props.accent}88`, borderRadius: 999, color: props.accent, fontSize: 16, fontWeight: 950}}>
          {occasion.label}
        </div>
      </div>

      <div style={{position: "absolute", left: 70, right: 70, top: 170, textAlign: "center"}}>
        <div style={{color: style.muted, fontSize: 18, fontWeight: 900, letterSpacing: 3}}>{occasion.kicker}</div>
        <div style={{position: "relative", display: "inline-block", marginTop: 10, overflow: "hidden", fontSize: 46, fontWeight: 950, letterSpacing: 8}}>
          为「{props.name}」写一束专属的光
          <span style={{position: "absolute", top: 0, bottom: 0, left: `${shimmer}%`, width: 90, transform: "skewX(-18deg)", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.34), transparent)"}} />
        </div>
      </div>

      <div style={{position: "absolute", left: 62, right: 62, top: 315, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22}}>
        <StrokeCharacter
          idPrefix="blessing-mu"
          label="01 / 水木清华"
          strokes={MU_STROKES}
          draw={firstDraw}
          componentCut={3}
          primary={style.primary}
          secondary={style.secondary}
          ink={style.ink}
          entrance={firstEnter}
        />
        <StrokeCharacter
          idPrefix="blessing-yang"
          label="02 / 向阳而生"
          strokes={YANG_STROKES}
          draw={secondDraw}
          componentCut={2}
          primary={props.accent}
          secondary={style.primary}
          ink={style.ink}
          entrance={secondEnter}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 95,
          right: 95,
          top: 1060,
          height: 170,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: complete,
          transform: `scale(${0.86 + complete * 0.14})`,
        }}
      >
        <div style={{position: "absolute", width: 530, height: 120, borderRadius: "50%", border: `2px solid ${style.primary}77`, boxShadow: `0 0 80px ${style.primary}3d, inset 0 0 50px ${props.accent}20`}} />
        <div style={{fontSize: 92, lineHeight: 1, fontWeight: 950, letterSpacing: 38, textIndent: 38, color: style.ink, textShadow: `0 0 18px ${style.primary}, 0 0 52px ${props.accent}88`}}>
          {props.name}
        </div>
      </div>

      <div style={{position: "absolute", left: 86, right: 86, top: 1275, textAlign: "center", opacity: blessingEnter, transform: `translateY(${(1 - blessingEnter) * 34}px)`}}>
        <div style={{width: 70, height: 3, margin: "0 auto 26px", borderRadius: 99, background: props.accent, boxShadow: `0 0 28px ${props.accent}`}} />
        <div style={{fontFamily: '"STKaiti", "KaiTi", serif', fontSize: 52, fontWeight: 800, lineHeight: 1.5, letterSpacing: 5}}>
          {props.blessing}
        </div>
      </div>

      <div style={{position: "absolute", left: 84, right: 84, bottom: 104, opacity: signatureEnter}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "end", paddingTop: 26, borderTop: `1px solid ${style.ink}24`}}>
          <div>
            <div style={{color: style.muted, fontSize: 14, fontWeight: 800, letterSpacing: 3}}>FROM</div>
            <div style={{marginTop: 8, fontSize: 20, fontWeight: 900}}>{props.signature}</div>
          </div>
          <div style={{textAlign: "right"}}>
            <div style={{color: props.accent, fontSize: 19, fontWeight: 950, letterSpacing: 2}}>{props.date}</div>
            <div style={{marginTop: 7, color: style.muted, fontSize: 13, fontWeight: 800}}>双字真实路径 · 程序化星光 · BGM</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
