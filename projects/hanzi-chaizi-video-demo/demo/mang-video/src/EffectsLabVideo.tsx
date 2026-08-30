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
import yongData from "hanzi-writer-data/永.json";
import mingData from "hanzi-writer-data/明.json";
import qingWaterData from "hanzi-writer-data/清.json";
import qingHeartData from "hanzi-writer-data/情.json";
import qingSunData from "hanzi-writer-data/晴.json";
import qingSpeechData from "hanzi-writer-data/请.json";
import captionsData from "./generated-effects-captions.json";
import voiceover from "./generated-effects-voiceover.json";

const COLORS = {
  midnight: "#071a2b",
  panel: "#102a43",
  panelSoft: "#173d5e",
  paper: "#eef7ff",
  ink: "#102a43",
  cyan: "#57c7e8",
  coral: "#ff735f",
  lime: "#b8e986",
  yellow: "#ffd166",
  white: "#f8fbff",
  muted: "#9cb5ca",
};

type Point = readonly [number, number];
type HanziData = {
  strokes: string[];
  medians: number[][][];
};
type EffectsCaption = {
  index: number;
  text: string;
  startMs: number;
  endMs: number;
};

const CAPTIONS = captionsData as EffectsCaption[];
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
      medianPoints: data.medians[index].map(([x, y]) => [x, y] as Point),
      median: data.medians[index]
        .map((point, pointIndex) =>
          `${pointIndex === 0 ? "M" : "L"} ${point[0]} ${point[1]}`,
        )
        .join(" "),
      span: [start, cursor / total] as const,
    };
  });
};

const YONG_STROKES = buildStrokes(yongData as HanziData);

const pointOnPolyline = (points: readonly Point[], progress: number): Point => {
  if (points.length < 2) return points[0] ?? [0, 0];
  const lengths = points.slice(1).map((point, index) =>
    Math.hypot(point[0] - points[index][0], point[1] - points[index][1]),
  );
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let target = progress * total;
  for (let index = 0; index < lengths.length; index += 1) {
    if (target <= lengths[index]) {
      const ratio = lengths[index] === 0 ? 0 : target / lengths[index];
      return [
        points[index][0] + (points[index + 1][0] - points[index][0]) * ratio,
        points[index][1] + (points[index + 1][1] - points[index][1]) * ratio,
      ];
    }
    target -= lengths[index];
  }
  return points[points.length - 1];
};

const clampProgress = (value: number, start: number, end: number) =>
  interpolate(value, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

const SceneTitle: React.FC<{index: string; title: string; note: string}> = ({
  index,
  title,
  note,
}) => (
  <div style={{position: "absolute", left: 72, right: 72, top: 198}}>
    <div style={{color: COLORS.cyan, fontSize: 20, fontWeight: 900, letterSpacing: 4}}>
      {index}
    </div>
    <div style={{marginTop: 9, fontSize: 55, fontWeight: 950, letterSpacing: -2}}>
      {title}
    </div>
    <div style={{marginTop: 10, color: COLORS.muted, fontSize: 22, fontWeight: 700}}>
      {note}
    </div>
  </div>
);

const TeachingScene: React.FC<{progress: number}> = ({progress}) => {
  const drawProgress = clampProgress(progress, 0.05, 0.92);
  const activeIndex = Math.min(
    YONG_STROKES.length - 1,
    YONG_STROKES.findIndex((stroke) => drawProgress <= stroke.span[1]) === -1
      ? YONG_STROKES.length - 1
      : YONG_STROKES.findIndex((stroke) => drawProgress <= stroke.span[1]),
  );
  const activeStroke = YONG_STROKES[activeIndex];
  const activeLocal = interpolate(drawProgress, activeStroke.span, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursor = pointOnPolyline(activeStroke.medianPoints, activeLocal);

  return (
    <AbsoluteFill>
      <SceneTitle index="01 / STROKE GUIDE" title="笔顺，不只是一条动画" note="加入编号、方向、当前笔高亮和田字格" />
      <div
        style={{
          position: "absolute",
          left: 92,
          right: 92,
          top: 390,
          height: 930,
          borderRadius: 42,
          overflow: "hidden",
          background: COLORS.paper,
          boxShadow: "0 34px 80px rgba(0,0,0,.26)",
        }}
      >
        <svg viewBox="0 0 1024 920" style={{width: "100%", height: "100%"}}>
          <defs>
            {YONG_STROKES.map((stroke, index) => (
              <clipPath id={`lab-yong-${index}`} key={stroke.shape}>
                <path d={stroke.shape} />
              </clipPath>
            ))}
          </defs>
          <path d="M512 0V920M0 460H1024M0 0L1024 920M1024 0L0 920" stroke="rgba(16,42,67,.12)" strokeWidth="4" strokeDasharray="18 14" />
          <g transform="scale(1,-1) translate(0,-900)">
            {YONG_STROKES.map((stroke) => (
              <path key={`ghost-${stroke.shape}`} d={stroke.shape} fill={COLORS.ink} opacity={0.07} />
            ))}
            {YONG_STROKES.map((stroke, index) => {
              const local = interpolate(drawProgress, stroke.span, [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <React.Fragment key={`guide-${stroke.shape}`}>
                  <path d={stroke.shape} fill={index === activeIndex ? COLORS.coral : COLORS.ink} opacity={local >= 1 ? 1 : 0} />
                  <path
                    d={stroke.median}
                    fill="none"
                    stroke={index === activeIndex ? COLORS.coral : COLORS.ink}
                    strokeWidth={116}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={`${stroke.length} ${stroke.length}`}
                    strokeDashoffset={stroke.length * (1 - local)}
                    clipPath={`url(#lab-yong-${index})`}
                  />
                </React.Fragment>
              );
            })}
          </g>
          {YONG_STROKES.map((stroke, index) => {
            const point = stroke.medianPoints[0];
            return (
              <g key={`number-${stroke.shape}`} opacity={drawProgress >= stroke.span[0] ? 1 : 0.32}>
                <circle cx={point[0]} cy={900 - point[1]} r="23" fill={index === activeIndex ? COLORS.coral : COLORS.cyan} />
                <text x={point[0]} y={907 - point[1]} textAnchor="middle" fill={COLORS.white} fontSize="22" fontWeight="900">{index + 1}</text>
              </g>
            );
          })}
          <circle cx={cursor[0]} cy={900 - cursor[1]} r="18" fill={COLORS.yellow} stroke={COLORS.coral} strokeWidth="7" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const TextureCharacter: React.FC<{
  label: string;
  background: string;
  color: string;
  accent: string;
  mode: "ink" | "chalk" | "neon";
  progress: number;
}> = ({label, background, color, accent, mode, progress}) => {
  const enter = clampProgress(progress, 0.04, 0.58);
  return (
    <div style={{position: "relative", flex: 1, height: 700, overflow: "hidden", borderRadius: 32, background, border: `3px solid ${accent}55`, transform: `translateY(${(1 - enter) * 50}px)`, opacity: enter}}>
      <div style={{position: "absolute", left: 22, top: 20, zIndex: 2, padding: "7px 13px", borderRadius: 999, color: mode === "chalk" ? COLORS.ink : COLORS.white, background: accent, fontSize: 17, fontWeight: 900}}>{label}</div>
      <svg viewBox="0 0 1024 920" style={{position: "absolute", inset: 35, width: "calc(100% - 70px)", height: "calc(100% - 70px)"}}>
        <defs>
          <filter id={`texture-${mode}`} x="-30%" y="-30%" width="160%" height="160%">
            {mode === "ink" && <><feTurbulence baseFrequency="0.012" numOctaves="2" seed="8" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="8" /></>}
            {mode === "neon" && <feDropShadow dx="0" dy="0" stdDeviation="16" floodColor={accent} floodOpacity="1" />}
            {mode === "chalk" && <><feTurbulence baseFrequency="0.22" numOctaves="1" seed="4" result="noise" /><feBlend in="SourceGraphic" in2="noise" mode="screen" /></>}
          </filter>
        </defs>
        <g transform="scale(1,-1) translate(0,-900)" filter={`url(#texture-${mode})`}>
          {yongData.strokes.map((path, index) => (
            <path key={path} d={path} fill={index % 3 === 0 ? accent : color} opacity={0.62 + (index % 3) * 0.17} />
          ))}
        </g>
      </svg>
    </div>
  );
};

const TextureScene: React.FC<{progress: number}> = ({progress}) => (
  <AbsoluteFill>
    <SceneTitle index="02 / STYLE LAYERS" title="一份路径，三种书写质感" note="表现层可以独立于笔画与时间轴替换" />
    <div style={{position: "absolute", left: 54, right: 54, top: 452, display: "flex", gap: 18}}>
      <TextureCharacter label="墨迹" background="#f1eadb" color="#151a1d" accent="#2d6a4f" mode="ink" progress={progress} />
      <TextureCharacter label="粉笔" background="#143c36" color="#fff7df" accent="#ffd166" mode="chalk" progress={progress} />
      <TextureCharacter label="霓虹" background="#07111f" color="#6fffe9" accent="#ff4fd8" mode="neon" progress={progress} />
    </div>
    <div style={{position: "absolute", left: 98, right: 98, top: 1210, padding: "25px 30px", borderRadius: 24, color: COLORS.muted, background: COLORS.panel, fontSize: 21, fontWeight: 700, textAlign: "center"}}>
      路径数据不变，只替换材质、颜色、阴影和背景
    </div>
  </AbsoluteFill>
);

const ComponentScene: React.FC<{progress: number}> = ({progress}) => {
  const merge = clampProgress(progress, 0.12, 0.78);
  const dayOffset = interpolate(merge, [0, 1], [-180, 0]);
  const moonOffset = interpolate(merge, [0, 1], [190, 0]);
  const badge = clampProgress(progress, 0.72, 0.92);
  const day = mingData.strokes.slice(0, 4);
  const moon = mingData.strokes.slice(4);
  return (
    <AbsoluteFill>
      <SceneTitle index="03 / COMPONENT MOTION" title="部件拆开，再磁吸组合" note="颜色、位移和缓动让结构关系更清楚" />
      <div style={{position: "absolute", left: 92, right: 92, top: 430, height: 880, borderRadius: 42, overflow: "hidden", background: "linear-gradient(145deg,#102a43,#071a2b)", border: "3px solid rgba(87,199,232,.32)"}}>
        <div style={{position: "absolute", left: 50, top: 40, color: COLORS.coral, fontSize: 24, fontWeight: 900}}>日 · 光</div>
        <div style={{position: "absolute", right: 50, top: 40, color: COLORS.cyan, fontSize: 24, fontWeight: 900}}>月 · 明</div>
        <svg viewBox="0 0 1024 900" style={{width: "100%", height: "100%"}}>
          <circle cx="512" cy="462" r={170 + (1 - merge) * 100} fill="none" stroke={COLORS.yellow} strokeWidth="5" opacity={0.12 + merge * 0.28} strokeDasharray="18 18" />
          <g transform={`translate(${dayOffset} 0) scale(1,-1) translate(0,-900)`}>
            {day.map((path) => <path key={path} d={path} fill={COLORS.coral} />)}
          </g>
          <g transform={`translate(${moonOffset} 0) scale(1,-1) translate(0,-900)`}>
            {moon.map((path) => <path key={path} d={path} fill={COLORS.cyan} />)}
          </g>
        </svg>
        <div style={{position: "absolute", left: "50%", bottom: 42, transform: `translateX(-50%) scale(${0.85 + badge * 0.15})`, opacity: badge, padding: "12px 19px", borderRadius: 999, color: COLORS.midnight, background: COLORS.yellow, fontSize: 18, fontWeight: 950}}>磁吸组合完成 · 明</div>
      </div>
    </AbsoluteFill>
  );
};

const FAMILY = [
  {character: "清", data: qingWaterData, radical: "氵", radicalCount: 3},
  {character: "情", data: qingHeartData, radical: "忄", radicalCount: 3},
  {character: "晴", data: qingSunData, radical: "日", radicalCount: 4},
  {character: "请", data: qingSpeechData, radical: "讠", radicalCount: 2},
];

const FamilyScene: React.FC<{progress: number}> = ({progress}) => (
  <AbsoluteFill>
    <SceneTitle index="04 / CHARACTER FAMILY" title="同一个“青”，看见字族关系" note="相同声旁保持同色，不同形旁负责区分语义" />
    <div style={{position: "absolute", left: 72, right: 72, top: 426, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20}}>
      {FAMILY.map((item, index) => {
        const enter = clampProgress(progress, index * 0.12, index * 0.12 + 0.35);
        return (
          <div key={item.character} style={{position: "relative", height: 410, borderRadius: 30, overflow: "hidden", background: COLORS.panel, border: "2px solid rgba(255,255,255,.10)", opacity: enter, transform: `scale(${0.92 + enter * 0.08})`}}>
            <div style={{position: "absolute", left: 23, top: 22, zIndex: 2, color: COLORS.white, fontSize: 26, fontWeight: 950}}>{item.radical}<span style={{color: COLORS.muted, padding: "0 9px"}}>＋</span><span style={{color: COLORS.cyan}}>青</span></div>
            <svg viewBox="0 0 1024 900" style={{position: "absolute", left: 68, right: 68, top: 70, width: "calc(100% - 136px)", height: 315}}>
              <g transform="scale(1,-1) translate(0,-900)">
                {item.data.strokes.map((path, strokeIndex) => (
                  <path key={path} d={path} fill={strokeIndex < item.radicalCount ? COLORS.coral : COLORS.cyan} />
                ))}
              </g>
            </svg>
            <div style={{position: "absolute", right: 23, bottom: 18, color: COLORS.yellow, fontSize: 23, fontWeight: 950}}>{item.character}</div>
          </div>
        );
      })}
    </div>
  </AbsoluteFill>
);

const PracticeScene: React.FC<{progress: number}> = ({progress}) => {
  const strokeIndex = 4;
  const active = YONG_STROKES[strokeIndex];
  const draw = clampProgress(progress, 0.08, 0.72);
  const cursor = pointOnPolyline(active.medianPoints, draw);
  const success = clampProgress(progress, 0.7, 0.9);
  return (
    <AbsoluteFill>
      <SceneTitle index="05 / PRACTICE CONCEPT" title="路径还能成为跟写界面" note="这里展示交互反馈形态，不声称已经具备笔迹识别" />
      <div style={{position: "absolute", left: 72, right: 72, top: 430, height: 875, display: "grid", gridTemplateColumns: "1fr 290px", gap: 22}}>
        <div style={{position: "relative", overflow: "hidden", borderRadius: 38, background: COLORS.paper}}>
          <svg viewBox="0 0 1024 920" style={{width: "100%", height: "100%"}}>
            <path d="M512 0V920M0 460H1024M0 0L1024 920M1024 0L0 920" stroke="rgba(16,42,67,.12)" strokeWidth="5" strokeDasharray="18 15" />
            <g transform="scale(1,-1) translate(0,-900)">
              {yongData.strokes.map((path) => <path key={path} d={path} fill={COLORS.ink} opacity=".075" />)}
              <path d={active.median} fill="none" stroke={COLORS.cyan} strokeWidth="42" strokeLinecap="round" strokeDasharray={`${active.length} ${active.length}`} strokeDashoffset={active.length * (1 - draw)} opacity=".62" />
            </g>
            <circle cx={cursor[0]} cy={900 - cursor[1]} r="30" fill="rgba(255,115,95,.22)" stroke={COLORS.coral} strokeWidth="7" />
            <circle cx={cursor[0]} cy={900 - cursor[1]} r="10" fill={COLORS.coral} />
          </svg>
        </div>
        <div style={{display: "grid", gap: 16, gridTemplateRows: "auto auto 1fr auto"}}>
          <div style={{padding: "24px", borderRadius: 28, background: COLORS.panel}}><div style={{color: COLORS.muted, fontSize: 16, fontWeight: 800}}>当前进度</div><div style={{marginTop: 8, color: COLORS.white, fontSize: 34, fontWeight: 950}}>第 5 / 8 笔</div></div>
          <div style={{padding: "24px", borderRadius: 28, color: COLORS.midnight, background: COLORS.cyan}}><div style={{fontSize: 16, fontWeight: 800}}>路径反馈</div><div style={{marginTop: 8, fontSize: 29, fontWeight: 950}}>方向提示</div></div>
          <div style={{padding: "24px", borderRadius: 28, background: COLORS.panelSoft, color: COLORS.muted, fontSize: 18, fontWeight: 750, lineHeight: 1.65}}>可继续扩展：<br />起笔位置<br />笔顺纠错<br />偏离提示<br />复习记录</div>
          <div style={{padding: "15px", borderRadius: 20, color: COLORS.white, background: COLORS.coral, textAlign: "center", fontSize: 16, fontWeight: 950, opacity: success}}>界面概念验证</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MiniMing: React.FC<{color: string; accent: string}> = ({color, accent}) => (
  <svg viewBox="0 0 1024 900" style={{width: "100%", height: "100%"}}>
    <g transform="scale(1,-1) translate(0,-900)">
      {mingData.strokes.map((path, index) => <path key={path} d={path} fill={index < 4 ? accent : color} />)}
    </g>
  </svg>
);

const OutputScene: React.FC<{progress: number}> = ({progress}) => (
  <AbsoluteFill>
    <SceneTitle index="06 / OUTPUT SURFACES" title="同一份数据，进入不同载体" note="演示视觉适配方向；批量导出和任务队列仍需产品化" />
    <div style={{position: "absolute", left: 70, right: 70, top: 470, display: "flex", alignItems: "end", justifyContent: "center", gap: 24}}>
      {[
        {label: "9:16", note: "短视频", width: 250, height: 600, background: "#143c36", color: COLORS.yellow, accent: COLORS.white},
        {label: "16:9", note: "课堂课件", width: 410, height: 310, background: "#eef7ff", color: COLORS.cyan, accent: COLORS.coral},
        {label: "ALPHA", note: "透明素材", width: 250, height: 450, background: "repeating-conic-gradient(#263b4e 0 25%,#1b2e40 0 50%) 0/34px 34px", color: COLORS.cyan, accent: COLORS.coral},
      ].map((item, index) => {
        const enter = clampProgress(progress, index * 0.15, index * 0.15 + 0.42);
        return (
          <div key={item.label} style={{width: item.width, opacity: enter, transform: `translateY(${(1 - enter) * 70}px)`}}>
            <div style={{height: item.height, padding: 25, borderRadius: 30, background: item.background, border: "3px solid rgba(255,255,255,.18)", boxShadow: "0 28px 64px rgba(0,0,0,.28)"}}><MiniMing color={item.color} accent={item.accent} /></div>
            <div style={{marginTop: 16, textAlign: "center", color: COLORS.white, fontSize: 20, fontWeight: 950}}>{item.label}</div>
            <div style={{marginTop: 3, textAlign: "center", color: COLORS.muted, fontSize: 17, fontWeight: 800}}>{item.note}</div>
          </div>
        );
      })}
    </div>
    <div style={{position: "absolute", left: 110, right: 110, bottom: 335, padding: "20px 26px", borderRadius: 22, color: COLORS.midnight, background: COLORS.yellow, textAlign: "center", fontSize: 21, fontWeight: 950, opacity: clampProgress(progress, 0.68, 0.9)}}>路径与内容可复用，导出基础设施仍需建设</div>
  </AbsoluteFill>
);

const EffectsCaptionLine: React.FC<{caption: EffectsCaption}> = ({caption}) => {
  const isConcept = caption.index === 4 || caption.index === 5;
  return (
    <div style={{position: "absolute", left: 72, right: 72, bottom: 114, minHeight: 154, padding: "25px 30px", display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, alignItems: "center", borderRadius: 28, color: COLORS.white, background: "rgba(7,26,43,.96)", border: "3px solid rgba(255,255,255,.12)", boxShadow: "0 22px 50px rgba(0,0,0,.3)"}}>
      <span style={{padding: "8px 11px", borderRadius: 999, color: isConcept ? COLORS.white : COLORS.midnight, background: isConcept ? COLORS.coral : COLORS.lime, fontSize: 15, fontWeight: 950, whiteSpace: "nowrap"}}>{isConcept ? "概念验证" : "真实渲染"}</span>
      <div style={{fontSize: caption.text.length > 20 ? 33 : 38, fontWeight: 950, lineHeight: 1.35}}>{caption.text}</div>
    </div>
  );
};

export const EffectsLabVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  if (width !== 1080 || height !== 1920) throw new Error("EffectsLabVideo expects 1080x1920.");
  const currentMs = (frame / fps) * 1000;
  const caption = CAPTIONS.find((item) => currentMs >= item.startMs && currentMs < item.endMs) ?? CAPTIONS[CAPTIONS.length - 1];
  const progress = interpolate(currentMs, [caption.startMs, caption.endMs], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const scenes = [TeachingScene, TextureScene, ComponentScene, FamilyScene, PracticeScene, OutputScene];
  const Scene = scenes[caption.index] ?? OutputScene;
  const totalProgress = interpolate(currentMs, [0, voiceover.videoDuration * 1000], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  return (
    <AbsoluteFill style={{overflow: "hidden", color: COLORS.white, background: `radial-gradient(circle at 78% 12%, rgba(87,199,232,.18), transparent 34%), ${COLORS.midnight}`, fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", sans-serif'}}>
      <Audio src={staticFile(voiceover.bgmFile)} volume={0.75} loop />
      <Audio src={staticFile(voiceover.audioFile)} volume={1} />
      <div style={{position: "absolute", inset: 0, opacity: .12, backgroundImage: "linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)", backgroundSize: "48px 48px"}} />
      <div style={{position: "absolute", left: 70, right: 70, top: 62, zIndex: 4, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <div><div style={{fontSize: 24, fontWeight: 950, letterSpacing: 4}}>扩展效果实验室</div><div style={{marginTop: 5, color: COLORS.cyan, fontSize: 16, fontWeight: 800}}>真实路径 · 六种表现 · 明确能力边界</div></div>
        <div style={{padding: "10px 16px", borderRadius: 999, color: COLORS.midnight, background: COLORS.yellow, fontSize: 17, fontWeight: 950}}>{String(caption.index + 1).padStart(2, "0")} / 06</div>
      </div>
      <div style={{position: "absolute", left: 70, right: 70, top: 148, zIndex: 4, height: 8, borderRadius: 999, overflow: "hidden", background: "rgba(255,255,255,.11)"}}><div style={{width: `${totalProgress * 100}%`, height: "100%", borderRadius: 999, background: `linear-gradient(90deg,${COLORS.coral},${COLORS.cyan},${COLORS.yellow})`}} /></div>
      <Scene progress={progress} />
      <EffectsCaptionLine caption={caption} />
    </AbsoluteFill>
  );
};
