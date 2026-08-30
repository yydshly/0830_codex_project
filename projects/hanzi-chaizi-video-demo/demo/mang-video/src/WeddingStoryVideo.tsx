import React from "react";
import {Audio} from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import zhangData from "hanzi-writer-data/张.json";
import dongData from "hanzi-writer-data/董.json";
import weddingData from "../../../web/data/wedding-zhangshuai-dong.json";

export type WeddingStoryProps = {
  groomDisplayName: string;
  brideDisplayName: string;
  date: string;
  location: string;
  vow: string;
  closing: string;
};

type Point = readonly [number, number];
type HanziData = {strokes: string[]; medians: number[][][]};

const CATALOG = weddingData as typeof weddingData;
export const DEFAULT_WEDDING_STORY_PROPS: WeddingStoryProps = {
  groomDisplayName: CATALOG.couple.groomDisplayName,
  brideDisplayName: CATALOG.couple.brideDisplayName,
  date: CATALOG.date.display,
  location: CATALOG.location,
  vow: CATALOG.vow,
  closing: CATALOG.closing,
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const smooth = Easing.bezier(0.45, 0, 0.55, 1);

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

const ZHANG_STROKES = buildStrokes(zhangData as HanziData);
const DONG_STROKES = buildStrokes(dongData as HanziData);

const DUST = Array.from({length: 44}, (_, index) => ({
  x: (index * 71 + 13) % 100,
  y: (index * 43 + 7) % 100,
  size: 2 + ((index * 5) % 6),
  delay: (index * 17) % 100,
}));

const MountainSilhouette: React.FC<{opacity: number}> = ({opacity}) => (
  <svg
    viewBox="0 0 1080 460"
    preserveAspectRatio="none"
    style={{position: "absolute", left: 0, right: 0, bottom: 0, width: "100%", height: 500, opacity}}
  >
    <path d="M0 320L130 210L240 284L375 132L510 274L650 180L780 270L935 112L1080 245V460H0Z" fill="#7e382f" opacity=".24" />
    <path d="M0 370L155 278L300 348L438 226L580 346L735 250L880 336L1010 230L1080 290V460H0Z" fill="#b87550" opacity=".18" />
    <path d="M0 414C170 368 330 435 520 382C720 326 864 408 1080 356V460H0Z" fill="#170407" opacity=".82" />
  </svg>
);

const WeddingGlyph: React.FC<{
  idPrefix: string;
  character: string;
  displayName: string;
  role: string;
  strokes: ReturnType<typeof buildStrokes>;
  draw: number;
  entrance: number;
}> = ({idPrefix, character, displayName, role, strokes, draw, entrance}) => (
  <div
    style={{
      position: "relative",
      height: 620,
      overflow: "hidden",
      border: "1px solid rgba(242,207,130,.34)",
      borderRadius: 160,
      opacity: entrance,
      transform: `translateY(${(1 - entrance) * 54}px) scale(${0.92 + entrance * 0.08})`,
      background: "linear-gradient(160deg, rgba(242,207,130,.12), rgba(49,11,16,.76) 45%, rgba(214,64,69,.10))",
      boxShadow: "inset 0 0 90px rgba(242,207,130,.08), 0 34px 90px rgba(0,0,0,.28)",
    }}
  >
    <div style={{position: "absolute", top: 30, left: 0, right: 0, zIndex: 2, textAlign: "center"}}>
      <div style={{color: "#c98e63", fontSize: 15, fontWeight: 900, letterSpacing: 5}}>{role}</div>
      <div style={{marginTop: 6, color: "#fff4df", fontSize: 23, fontWeight: 900, letterSpacing: 4}}>{displayName}</div>
    </div>
    <div style={{position: "absolute", inset: 105, border: "1px solid rgba(242,207,130,.18)", borderRadius: "50%"}} />
    <svg viewBox="0 0 1024 900" style={{position: "absolute", inset: "130px 32px 48px", width: "calc(100% - 64px)", height: "calc(100% - 178px)"}}>
      <defs>
        {strokes.map((stroke, index) => (
          <clipPath id={`${idPrefix}-stroke-${index}`} key={`${idPrefix}-clip-${index}`}>
            <path d={stroke.shape} />
          </clipPath>
        ))}
      </defs>
      <path d="M512 0V900M0 450H1024" stroke="rgba(242,207,130,.09)" strokeWidth="3" strokeDasharray="18 22" />
      <g transform="scale(1,-1) translate(0,-900)" style={{filter: "drop-shadow(0 0 20px rgba(242,207,130,.72))"}}>
        {strokes.map((stroke) => (
          <path key={`${idPrefix}-ghost-${stroke.shape}`} d={stroke.shape} fill="#fff4df" opacity={0.045} />
        ))}
        {strokes.map((stroke, index) => {
          const local = interpolate(draw, stroke.span, [0, 1], clamp);
          const fillOpacity = interpolate(local, [0.82, 1], [0, 1], clamp);
          const color = index < Math.ceil(strokes.length * 0.38) ? "#d64045" : "#f2cf82";
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
    <div style={{position: "absolute", left: 0, right: 0, bottom: 26, color: "#d7bfa9", textAlign: "center", fontSize: 14, fontWeight: 800, letterSpacing: 3}}>
      REAL STROKE DATA · {character}
    </div>
  </div>
);

export const WeddingStoryVideo: React.FC<WeddingStoryProps> = (props) => {
  const frame = useCurrentFrame();
  const intro = progress(frame, 0, 44);
  const leftEnter = progress(frame, 40, 78);
  const rightEnter = progress(frame, 72, 112);
  const leftDraw = progress(frame, 62, 205, smooth);
  const rightDraw = progress(frame, 104, 252, smooth);
  const thread = progress(frame, 215, 350, smooth);
  const ceremony = progress(frame, 318, 408);
  const finale = progress(frame, 410, 500);
  const pulse = interpolate(frame % 80, [0, 40, 80], [0.86, 1.04, 0.86]);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        color: "#fff4df",
        background: "#1a0508",
        fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      <Audio src={staticFile("audio/background.mp3")} volume={0.62} />
      <AbsoluteFill style={{background: "radial-gradient(circle at 50% 30%, rgba(214,64,69,.23), transparent 34%), radial-gradient(circle at 15% 80%, rgba(201,142,99,.20), transparent 31%), linear-gradient(155deg, #1a0508, #29070c 55%, #100204)"}} />
      <MountainSilhouette opacity={intro} />

      {DUST.map((particle, index) => {
        const local = (frame + particle.delay) % 100;
        const opacity = interpolate(local, [0, 35, 70, 100], [0.04, 0.55, 0.16, 0.04]);
        return (
          <div
            key={`dust-${index}`}
            style={{
              position: "absolute",
              left: `${particle.x}%`,
              top: `${particle.y - local * 0.08}%`,
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              opacity,
              background: index % 4 === 0 ? "#d64045" : "#f2cf82",
              boxShadow: "0 0 18px rgba(242,207,130,.65)",
            }}
          />
        );
      })}

      <div style={{position: "absolute", left: 62, right: 62, top: 54, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: intro}}>
        <div>
          <div style={{color: "#f2cf82", fontSize: 20, fontWeight: 950, letterSpacing: 6}}>两姓成礼 · 一字一生</div>
          <div style={{marginTop: 8, color: "#d7bfa9", fontSize: 13, fontWeight: 800, letterSpacing: 3}}>WEDDING STORY / REAL REMOTION SAMPLE</div>
        </div>
        <div style={{padding: "10px 18px", border: "1px solid rgba(242,207,130,.52)", borderRadius: 999, color: "#f2cf82", fontSize: 15, fontWeight: 900}}>{props.location}</div>
      </div>

      <div style={{position: "absolute", left: 84, right: 84, top: 168, textAlign: "center", opacity: intro}}>
        <div style={{color: "#c98e63", fontSize: 17, fontWeight: 900, letterSpacing: 6}}>SEPTEMBER · YAN'AN</div>
        <div style={{marginTop: 14, fontFamily: '"STKaiti", "KaiTi", serif', fontSize: 47, fontWeight: 800, letterSpacing: 6}}>一场婚礼，从延安的九月开始</div>
      </div>

      <div style={{position: "absolute", left: 74, right: 74, top: 334, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 34}}>
        <WeddingGlyph idPrefix="wedding-zhang" character="张" displayName={props.groomDisplayName} role="GROOM / 张先生" strokes={ZHANG_STROKES} draw={leftDraw} entrance={leftEnter} />
        <WeddingGlyph idPrefix="wedding-dong" character="董" displayName={props.brideDisplayName} role="BRIDE / 董小姐" strokes={DONG_STROKES} draw={rightDraw} entrance={rightEnter} />
      </div>

      <svg viewBox="0 0 1080 260" style={{position: "absolute", left: 0, right: 0, top: 895, width: "100%", height: 260, opacity: thread}}>
        <path d="M120 96C330 12 365 226 540 126C715 26 762 210 960 88" fill="none" stroke="rgba(214,64,69,.18)" strokeWidth="18" strokeLinecap="round" />
        <path d="M120 96C330 12 365 226 540 126C715 26 762 210 960 88" fill="none" stroke="#d64045" strokeWidth="5" strokeLinecap="round" strokeDasharray="1180" strokeDashoffset={1180 * (1 - thread)} style={{filter: "drop-shadow(0 0 14px rgba(214,64,69,.9))"}} />
      </svg>

      <div style={{position: "absolute", left: "50%", top: 982, width: 132, height: 132, border: "2px solid rgba(242,207,130,.72)", borderRadius: "50%", opacity: thread, transform: `translate(-50%, -50%) scale(${pulse})`, boxShadow: "0 0 54px rgba(242,207,130,.28), inset 0 0 32px rgba(214,64,69,.18)"}}>
        <div style={{position: "absolute", inset: 14, border: "1px solid rgba(214,64,69,.74)", borderRadius: "50%"}} />
      </div>

      <div style={{position: "absolute", left: 64, right: 64, top: 1095, textAlign: "center", opacity: ceremony, transform: `translateY(${(1 - ceremony) * 36}px)`}}>
        <div style={{color: "#c98e63", fontSize: 15, fontWeight: 900, letterSpacing: 6}}>TWO NAMES · ONE PROMISE</div>
        <div style={{marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 30, fontFamily: '"STKaiti", "KaiTi", serif', fontSize: 70, fontWeight: 900, letterSpacing: 8, textShadow: "0 0 24px rgba(242,207,130,.46)"}}>
          <span>{props.groomDisplayName}</span><span style={{color: "#d64045", fontSize: 40}}>×</span><span>{props.brideDisplayName}</span>
        </div>
        <div style={{width: 76, height: 2, margin: "30px auto", background: "#f2cf82", boxShadow: "0 0 24px rgba(242,207,130,.7)"}} />
        <div style={{color: "#f2cf82", fontSize: 36, fontWeight: 950, letterSpacing: 9}}>{props.date}</div>
        <div style={{marginTop: 14, color: "#d7bfa9", fontSize: 22, fontWeight: 900, letterSpacing: 12}}>{props.location}</div>
      </div>

      <div style={{position: "absolute", left: 88, right: 88, top: 1440, padding: "42px 44px", border: "1px solid rgba(242,207,130,.3)", borderRadius: 28, textAlign: "center", opacity: finale, transform: `translateY(${(1 - finale) * 30}px)`, background: "rgba(49,11,16,.72)", boxShadow: "0 30px 80px rgba(0,0,0,.25)"}}>
        <div style={{fontFamily: '"STKaiti", "KaiTi", serif', fontSize: 47, fontWeight: 800, lineHeight: 1.5, letterSpacing: 6}}>{props.vow}</div>
        <div style={{marginTop: 24, color: "#c98e63", fontSize: 18, fontWeight: 900, letterSpacing: 5}}>{props.closing}</div>
      </div>

      <div style={{position: "absolute", left: 62, right: 62, bottom: 72, display: "flex", alignItems: "end", justifyContent: "space-between", opacity: finale}}>
        <div>
          <div style={{color: "#d7bfa9", fontSize: 12, fontWeight: 800, letterSpacing: 4}}>STROKE DATA</div>
          <div style={{marginTop: 7, fontSize: 16, fontWeight: 900}}>张／董真实路径 · 称谓排版</div>
        </div>
        <div style={{textAlign: "right", color: "#f2cf82", fontSize: 16, fontWeight: 950, letterSpacing: 3}}>09 · 12<br />YAN'AN</div>
      </div>
    </AbsoluteFill>
  );
};
