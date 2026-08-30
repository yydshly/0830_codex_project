import React from "react";
import {Audio} from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import zhangData from "hanzi-writer-data/张.json";
import dongData from "hanzi-writer-data/董.json";
import weddingData from "../../../web/data/wedding-zhangshuai-dong.json";

export type WeddingScreenProps = {
  groomName: string;
  brideName: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  vow: string;
};

type Point = readonly [number, number];
type HanziData = {strokes: string[]; medians: number[][][]};

const PROJECT = weddingData as typeof weddingData;
export const DEFAULT_WEDDING_SCREEN_PROPS: WeddingScreenProps = {
  groomName: PROJECT.couple.groomDisplayName,
  brideName: PROJECT.simulation.brideFullName,
  date: PROJECT.date.display,
  time: PROJECT.simulation.ceremonyTime,
  location: PROJECT.location,
  venue: PROJECT.simulation.venue,
  vow: PROJECT.vow,
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const smooth = Easing.bezier(0.45, 0, 0.55, 1);

const progress = (frame: number, start: number, end: number, easing = ease) =>
  interpolate(frame, [start, end], [0, 1], {...clamp, easing});

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

const SPECKLES = Array.from({length: 54}, (_, index) => ({
  x: (index * 73 + 11) % 100,
  y: (index * 41 + 17) % 100,
  size: 2 + ((index * 7) % 6),
  delay: (index * 19) % 120,
}));

const PhotoPlaceholder: React.FC<{
  index: number;
  title: string;
  caption: string;
  asset: string;
  entrance: number;
}> = ({index, title, caption, asset, entrance}) => (
  <div
    style={{
      position: "relative",
      height: 430,
      overflow: "hidden",
      border: "1px solid rgba(242,207,130,.28)",
      borderRadius: 32,
      opacity: entrance,
      transform: `translateY(${(1 - entrance) * 46}px) rotate(${(index - 1) * 1.5}deg)`,
      background:
        index === 0
          ? "linear-gradient(155deg,#6f302b,#351015 58%,#190508)"
          : index === 1
            ? "linear-gradient(155deg,#8b4b35,#3a1116 55%,#160407)"
            : "linear-gradient(155deg,#5d2530,#2e0b12 60%,#150306)",
      boxShadow: "0 24px 80px rgba(0,0,0,.28)",
    }}
  >
    <Img src={staticFile(asset)} style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: index === 2 ? "50% 42%" : "50% 50%"}} />
    <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,1,3,.05),transparent 42%,rgba(10,1,3,.82)),radial-gradient(circle at 50% 24%,rgba(242,207,130,.10),transparent 30%)"}} />
    <div style={{position: "absolute", left: 22, top: 20, padding: "7px 10px", border: "1px solid rgba(242,207,130,.5)", borderRadius: 999, color: "#fff4df", background: "rgba(26,5,8,.72)", fontSize: 11, fontWeight: 950, letterSpacing: 2}}>AI SIMULATED PHOTO 0{index + 1}</div>
    <div style={{position: "absolute", left: 26, right: 26, bottom: 24}}>
      <div style={{fontFamily: '"STKaiti", "KaiTi", serif', fontSize: 34, fontWeight: 900, letterSpacing: 4}}>{title}</div>
      <div style={{marginTop: 7, color: "#d7bfa9", fontSize: 12, fontWeight: 800, letterSpacing: 1}}>{caption}</div>
    </div>
  </div>
);

const StrokeSeal: React.FC<{
  idPrefix: string;
  character: string;
  name: string;
  strokes: ReturnType<typeof buildStrokes>;
  draw: number;
  entrance: number;
}> = ({idPrefix, character, name, strokes, draw, entrance}) => (
  <div style={{position: "relative", width: 430, height: 500, opacity: entrance, transform: `scale(${0.9 + entrance * 0.1})`}}>
    <div style={{position: "absolute", inset: 14, border: "1px solid rgba(242,207,130,.32)", borderRadius: "50%", boxShadow: "inset 0 0 70px rgba(242,207,130,.08),0 0 70px rgba(214,64,69,.12)"}} />
    <svg viewBox="0 0 1024 900" style={{position: "absolute", inset: 48, width: "calc(100% - 96px)", height: "calc(100% - 96px)"}}>
      <defs>
        {strokes.map((stroke, index) => (
          <clipPath id={`${idPrefix}-screen-${index}`} key={`${idPrefix}-clip-${index}`}>
            <path d={stroke.shape} />
          </clipPath>
        ))}
      </defs>
      <g transform="scale(1,-1) translate(0,-900)" style={{filter: "drop-shadow(0 0 18px rgba(242,207,130,.72))"}}>
        {strokes.map((stroke) => <path key={`${idPrefix}-ghost-${stroke.shape}`} d={stroke.shape} fill="#fff4df" opacity={0.05} />)}
        {strokes.map((stroke, index) => {
          const local = interpolate(draw, stroke.span, [0, 1], clamp);
          const color = index < Math.ceil(strokes.length * 0.4) ? "#d64045" : "#f2cf82";
          return (
            <React.Fragment key={`${idPrefix}-${stroke.shape}`}>
              <path d={stroke.shape} fill={color} opacity={interpolate(local, [0.82, 1], [0, 1], clamp)} />
              <path d={stroke.median} fill="none" stroke={color} strokeWidth={118} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${stroke.length} ${stroke.length}`} strokeDashoffset={stroke.length * (1 - local)} clipPath={`url(#${idPrefix}-screen-${index})`} />
            </React.Fragment>
          );
        })}
      </g>
    </svg>
    <div style={{position: "absolute", left: 0, right: 0, bottom: 8, textAlign: "center"}}>
      <div style={{color: "#fff4df", fontSize: 22, fontWeight: 950, letterSpacing: 4}}>{name}</div>
      <div style={{marginTop: 5, color: "#c98e63", fontSize: 11, fontWeight: 900, letterSpacing: 3}}>REAL STROKE · {character}</div>
    </div>
  </div>
);

export const WeddingScreenVideo: React.FC<WeddingScreenProps> = (props) => {
  const frame = useCurrentFrame();
  const intro = progress(frame, 0, 50);
  const photoOne = progress(frame, 54, 96);
  const photoTwo = progress(frame, 78, 120);
  const photoThree = progress(frame, 102, 144);
  const photoFade = interpolate(frame, [250, 320], [1, 0.16], clamp);
  const sealsEnter = progress(frame, 220, 280);
  const zhangDraw = progress(frame, 250, 390, smooth);
  const dongDraw = progress(frame, 300, 440, smooth);
  const thread = progress(frame, 410, 520, smooth);
  const details = progress(frame, 500, 590);
  const finale = progress(frame, 600, 690);
  const shimmer = interpolate(frame % 110, [0, 55, 110], [-160, 160, -160]);

  return (
    <AbsoluteFill style={{overflow: "hidden", color: "#fff4df", background: "#160306", fontFamily: 'Inter,"PingFang SC","Microsoft YaHei",sans-serif'}}>
      <Audio src={staticFile("audio/background.mp3")} volume={0.62} />
      <AbsoluteFill style={{background: "radial-gradient(circle at 50% 16%,rgba(214,64,69,.23),transparent 30%),radial-gradient(circle at 8% 80%,rgba(201,142,99,.16),transparent 28%),linear-gradient(155deg,#190408,#310a10 55%,#100204)"}} />

      {SPECKLES.map((particle, index) => {
        const local = (frame + particle.delay) % 120;
        return <div key={`screen-speck-${index}`} style={{position: "absolute", left: `${particle.x}%`, top: `${particle.y - local * 0.035}%`, width: particle.size, height: particle.size, borderRadius: "50%", opacity: interpolate(local, [0, 45, 90, 120], [.05,.5,.18,.05]), background: index % 4 === 0 ? "#d64045" : "#f2cf82", boxShadow: "0 0 16px rgba(242,207,130,.58)"}} />;
      })}

      <div style={{position: "absolute", left: 64, right: 64, top: 42, zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: intro}}>
        <div>
          <div style={{color: "#f2cf82", fontSize: 22, fontWeight: 950, letterSpacing: 6}}>两姓成礼 · 一字一生</div>
          <div style={{marginTop: 8, color: "#d7bfa9", fontSize: 12, fontWeight: 800, letterSpacing: 3}}>WEDDING SCREEN / 16:9 DELIVERY DEMO</div>
        </div>
        <div style={{padding: "11px 17px", border: "1px solid #d64045", borderRadius: 999, color: "#ffd0c4", background: "rgba(214,64,69,.16)", fontSize: 13, fontWeight: 950, letterSpacing: 2}}>DEMO CONTENT · 模拟资料</div>
      </div>

      <div style={{position: "absolute", left: 116, right: 116, top: 145, zIndex: 3, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28, opacity: photoFade}}>
        {PROJECT.simulation.photoScenes.map((scene, index) => (
          <PhotoPlaceholder key={scene.id} index={index} title={scene.title} caption={scene.caption} asset={scene.renderAsset} entrance={[photoOne, photoTwo, photoThree][index]} />
        ))}
      </div>

      <div style={{position: "absolute", left: 330, right: 330, top: 175, zIndex: 5, display: "flex", justifyContent: "space-between", opacity: sealsEnter}}>
        <StrokeSeal idPrefix="screen-zhang" character="张" name={props.groomName} strokes={ZHANG_STROKES} draw={zhangDraw} entrance={sealsEnter} />
        <StrokeSeal idPrefix="screen-dong" character="董" name={`${props.brideName}（模拟）`} strokes={DONG_STROKES} draw={dongDraw} entrance={sealsEnter} />
      </div>

      <svg viewBox="0 0 1920 220" style={{position: "absolute", zIndex: 6, left: 0, right: 0, top: 470, width: "100%", height: 220, opacity: thread}}>
        <path d="M440 112C690 20 760 196 960 105C1160 14 1230 196 1480 95" fill="none" stroke="rgba(214,64,69,.2)" strokeWidth="22" strokeLinecap="round" />
        <path d="M440 112C690 20 760 196 960 105C1160 14 1230 196 1480 95" fill="none" stroke="#d64045" strokeWidth="5" strokeLinecap="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - thread)} style={{filter: "drop-shadow(0 0 14px rgba(214,64,69,.95))"}} />
      </svg>
      <div style={{position: "absolute", zIndex: 7, left: "50%", top: 575, width: 118, height: 118, border: "2px solid rgba(242,207,130,.78)", borderRadius: "50%", opacity: thread, transform: `translate(-50%,-50%) scale(${.78 + thread * .22})`, boxShadow: "0 0 54px rgba(242,207,130,.28)"}}><div style={{position: "absolute", inset: 15, border: "1px solid rgba(214,64,69,.9)", borderRadius: "50%"}} /></div>

      <div style={{position: "absolute", zIndex: 8, left: 160, right: 160, top: 690, textAlign: "center", opacity: details, transform: `translateY(${(1 - details) * 35}px)`}}>
        <div style={{position: "relative", display: "inline-block", overflow: "hidden", fontFamily: '"STKaiti","KaiTi",serif', fontSize: 62, fontWeight: 900, letterSpacing: 12}}>
          {props.groomName}<span style={{margin: "0 30px", color: "#d64045", fontFamily: "sans-serif", fontSize: 34}}>×</span>{props.brideName}
          <i style={{position: "absolute", top: 0, bottom: 0, left: `${shimmer}%`, width: 120, transform: "skewX(-18deg)", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.32),transparent)"}} />
        </div>
        <div style={{width: 72, height: 2, margin: "26px auto 20px", background: "#f2cf82", boxShadow: "0 0 24px rgba(242,207,130,.72)"}} />
        <div style={{color: "#f2cf82", fontSize: 29, fontWeight: 950, letterSpacing: 8}}>{props.date} · {props.time}</div>
        <div style={{marginTop: 13, color: "#d7bfa9", fontSize: 17, fontWeight: 900, letterSpacing: 3}}>{props.venue}</div>
      </div>

      <div style={{position: "absolute", zIndex: 9, left: 245, right: 245, bottom: 45, padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(242,207,130,.22)", opacity: finale}}>
        <div style={{fontFamily: '"STKaiti","KaiTi",serif', fontSize: 25, fontWeight: 800, letterSpacing: 5}}>{props.vow}</div>
        <div style={{color: "#ffb9ad", fontSize: 12, fontWeight: 950, letterSpacing: 2}}>模拟新娘姓名／场地／时间 · 正式播放前请确认替换</div>
      </div>
    </AbsoluteFill>
  );
};
