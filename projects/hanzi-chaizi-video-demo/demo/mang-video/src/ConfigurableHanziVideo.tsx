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
import yongData from "hanzi-writer-data/永.json";
import mingData from "hanzi-writer-data/明.json";
import qingData from "hanzi-writer-data/清.json";
import anData from "hanzi-writer-data/安.json";
import catalogData from "../../../web/data/hanzi-workbench.json";

export type SupportedCharacter = "忙" | "永" | "明" | "清" | "安";
export type WorkbenchScene = "culture" | "lesson" | "exhibit" | "gift";
export type WorkbenchTemplate = "editorial" | "chalk" | "museum";

export type WorkbenchVideoProps = {
  character: SupportedCharacter;
  scene: WorkbenchScene;
  template: WorkbenchTemplate;
  title: string;
  caption: string;
  accent: string;
};

type Point = readonly [number, number];
type HanziData = {strokes: string[]; medians: number[][][]};
type Catalog = {
  catalog: Array<{
    character: SupportedCharacter;
    pinyin: string;
    decomposition: string;
    componentCut: number;
  }>;
  scenes: Array<{id: WorkbenchScene; label: string; kicker: string; output: string}>;
  templates: Array<{
    id: WorkbenchTemplate;
    label: string;
    background: string;
    surface: string;
    ink: string;
    muted: string;
    accent: string;
  }>;
  sample: WorkbenchVideoProps;
};

const CATALOG = catalogData as Catalog;
export const DEFAULT_WORKBENCH_PROPS = CATALOG.sample;

const HANZI_REGISTRY: Record<SupportedCharacter, HanziData> = {
  忙: mangData as HanziData,
  永: yongData as HanziData,
  明: mingData as HanziData,
  清: qingData as HanziData,
  安: anData as HanziData,
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);
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

const enter = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

export const ConfigurableHanziVideo: React.FC<WorkbenchVideoProps> = (props) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const characterInfo = CATALOG.catalog.find((item) => item.character === props.character) ?? CATALOG.catalog[0];
  const scene = CATALOG.scenes.find((item) => item.id === props.scene) ?? CATALOG.scenes[0];
  const template = CATALOG.templates.find((item) => item.id === props.template) ?? CATALOG.templates[0];
  const strokes = buildStrokes(HANZI_REGISTRY[props.character]);
  const drawProgress = enter(frame, Math.round(fps * 0.7), Math.round(fps * 4.9));
  const titleEnter = enter(frame, 0, Math.round(fps * 0.8));
  const cardEnter = enter(frame, Math.round(fps * 0.35), Math.round(fps * 1.1));
  const detailEnter = enter(frame, Math.round(fps * 4.4), Math.round(fps * 5.5));
  const captionEnter = enter(frame, Math.round(fps * 5.2), Math.round(fps * 6.4));

  return (
    <AbsoluteFill
      style={{
        color: template.ink,
        background: template.background,
        fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      <Audio src={staticFile("audio/background.mp3")} volume={0.68} />
      <AbsoluteFill
        style={{
          opacity: 0.18,
          backgroundImage: `linear-gradient(${template.ink}22 2px, transparent 2px), linear-gradient(90deg, ${template.ink}22 2px, transparent 2px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div style={{position: "absolute", left: 72, right: 72, top: 64, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div>
          <div style={{fontSize: 22, fontWeight: 950, letterSpacing: 4}}>汉字内容工作台</div>
          <div style={{marginTop: 5, color: template.muted, fontSize: 16, fontWeight: 800}}>CONFIG-DRIVEN REMOTION / R6</div>
        </div>
        <div style={{padding: "10px 16px", borderRadius: 999, color: template.background, background: props.accent, fontSize: 16, fontWeight: 950}}>
          配置驱动成片
        </div>
      </div>

      <div style={{position: "absolute", left: 72, right: 72, top: 170, opacity: titleEnter, transform: `translateY(${(1 - titleEnter) * 28}px)`}}>
        <div style={{color: props.accent, fontSize: 19, fontWeight: 950, letterSpacing: 4}}>{scene.kicker} / {scene.label}</div>
        <div style={{marginTop: 12, maxWidth: 900, fontSize: 56, fontWeight: 950, lineHeight: 1.18, letterSpacing: -2}}>{props.title}</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 360,
          height: 920,
          overflow: "hidden",
          border: `3px solid ${props.accent}66`,
          borderRadius: 42,
          background: template.surface,
          boxShadow: "0 36px 90px rgba(0,0,0,.22)",
          opacity: cardEnter,
          transform: `translateY(${(1 - cardEnter) * 42}px) scale(${0.97 + cardEnter * 0.03})`,
        }}
      >
        <div style={{position: "absolute", left: 30, top: 26, color: template.muted, fontSize: 17, fontWeight: 900, letterSpacing: 3}}>
          {characterInfo.pinyin} / {characterInfo.decomposition}
        </div>
        <svg viewBox="0 0 1024 900" style={{position: "absolute", inset: "95px 88px 80px", width: "calc(100% - 176px)", height: "calc(100% - 175px)"}}>
          <defs>
            {strokes.map((stroke, index) => (
              <clipPath id={`workbench-stroke-${index}`} key={`clip-${stroke.shape}`}>
                <path d={stroke.shape} />
              </clipPath>
            ))}
          </defs>
          <path d="M512 0V900M0 450H1024M0 0L1024 900M1024 0L0 900" stroke={`${template.ink}18`} strokeWidth="4" strokeDasharray="16 14" />
          <g transform="scale(1,-1) translate(0,-900)">
            {strokes.map((stroke) => (
              <path key={`ghost-${stroke.shape}`} d={stroke.shape} fill={template.ink} opacity={0.07} />
            ))}
            {strokes.map((stroke, index) => {
              const local = interpolate(drawProgress, stroke.span, [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const color = characterInfo.componentCut > 0 && index < characterInfo.componentCut ? props.accent : template.ink;
              return (
                <React.Fragment key={`stroke-${stroke.shape}`}>
                  <path d={stroke.shape} fill={color} opacity={local >= 0.98 ? 1 : 0} />
                  <path
                    d={stroke.median}
                    fill="none"
                    stroke={color}
                    strokeWidth={118}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={`${stroke.length} ${stroke.length}`}
                    strokeDashoffset={stroke.length * (1 - local)}
                    clipPath={`url(#workbench-stroke-${index})`}
                  />
                </React.Fragment>
              );
            })}
          </g>
        </svg>
        <div style={{position: "absolute", left: 0, right: 0, bottom: 30, display: "flex", justifyContent: "center", opacity: detailEnter, transform: `translateY(${(1 - detailEnter) * 18}px)`}}>
          <span style={{padding: "8px 15px", borderRadius: 999, color: template.background, background: props.accent, fontSize: 17, fontWeight: 950}}>
            {characterInfo.decomposition} · {scene.output}
          </span>
        </div>
      </div>

      <div style={{position: "absolute", left: 92, right: 92, top: 1355, opacity: captionEnter, transform: `translateY(${(1 - captionEnter) * 24}px)`}}>
        <div style={{fontSize: 37, fontWeight: 950, lineHeight: 1.45, textAlign: "center"}}>{props.caption}</div>
        <div style={{marginTop: 34, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14}}>
          {[
            ["汉字", props.character],
            ["模板", template.label],
            ["音轨", "程序化 BGM"],
          ].map(([label, value]) => (
            <div key={label} style={{padding: "17px 20px", border: `2px solid ${template.ink}22`, borderRadius: 18, background: `${template.surface}cc`}}>
              <div style={{color: template.muted, fontSize: 14, fontWeight: 800}}>{label}</div>
              <div style={{marginTop: 5, fontSize: 18, fontWeight: 950}}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{position: "absolute", left: 0, right: 0, bottom: 64, color: template.muted, fontSize: 15, fontWeight: 800, textAlign: "center", letterSpacing: 2}}>
        同一 Composition · JSON 换字与文案 · 无在线渲染服务
      </div>
    </AbsoluteFill>
  );
};
