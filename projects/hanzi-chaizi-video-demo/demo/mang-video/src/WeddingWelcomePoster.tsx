import React from "react";
import {AbsoluteFill, Img, staticFile} from "remotion";
import weddingData from "../../../web/data/wedding-zhangshuai-dong.json";
import type {WeddingScreenProps} from "./WeddingScreenVideo";

const PROJECT = weddingData as typeof weddingData;

const Dust: React.FC = () => (
  <>
    {Array.from({length: 42}, (_, index) => (
      <i
        key={`poster-dust-${index}`}
        style={{
          position: "absolute",
          left: `${(index * 67 + 9) % 100}%`,
          top: `${(index * 43 + 11) % 100}%`,
          width: 3 + ((index * 5) % 7),
          height: 3 + ((index * 5) % 7),
          borderRadius: "50%",
          opacity: 0.1 + ((index * 7) % 5) * 0.06,
          background: index % 4 === 0 ? "#d64045" : "#f2cf82",
          boxShadow: "0 0 18px rgba(242,207,130,.4)",
        }}
      />
    ))}
  </>
);

export const WeddingWelcomePoster: React.FC<WeddingScreenProps> = (props) => (
  <AbsoluteFill
    style={{
      overflow: "hidden",
      color: "#fff4df",
      background: "#160306",
      fontFamily: 'Inter,"PingFang SC","Microsoft YaHei",sans-serif',
    }}
  >
    <AbsoluteFill style={{background: "radial-gradient(circle at 50% 23%,rgba(214,64,69,.25),transparent 35%),radial-gradient(circle at 10% 82%,rgba(201,142,99,.2),transparent 30%),linear-gradient(155deg,#190408,#310a10 58%,#100204)"}} />
    <Dust />

    <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 78, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff4df", background: "#d64045", fontSize: 19, fontWeight: 950, letterSpacing: 5}}>
      SIMULATION / DEMO ONLY · 演示资料
    </div>

    <div style={{position: "absolute", left: 68, right: 68, top: 126, display: "flex", justifyContent: "space-between", alignItems: "start"}}>
      <div>
        <div style={{color: "#f2cf82", fontSize: 22, fontWeight: 950, letterSpacing: 7}}>两姓成礼 · 一字一生</div>
        <div style={{marginTop: 9, color: "#c98e63", fontSize: 13, fontWeight: 900, letterSpacing: 4}}>WELCOME POSTER / 4:5 DELIVERY</div>
      </div>
      <div style={{padding: "11px 17px", border: "1px solid rgba(242,207,130,.44)", borderRadius: 999, color: "#f2cf82", fontSize: 15, fontWeight: 900}}>{props.location}</div>
    </div>

    <div style={{position: "absolute", left: 82, right: 82, top: 250, height: 480, overflow: "hidden", border: "1px solid rgba(242,207,130,.28)", borderRadius: 46, background: "linear-gradient(155deg,#7b342d,#371015 60%,#180407)", boxShadow: "0 38px 90px rgba(0,0,0,.3)"}}>
      <Img src={staticFile(PROJECT.simulation.photoScenes[2].renderAsset)} style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 38%"}} />
      <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,1,3,.04),transparent 44%,rgba(10,1,3,.76))"}} />
      <div style={{position: "absolute", left: 28, top: 26, padding: "8px 13px", border: "1px solid rgba(242,207,130,.52)", borderRadius: 999, color: "#fff4df", background: "rgba(26,5,8,.72)", fontSize: 12, fontWeight: 950, letterSpacing: 3}}>AI SIMULATED PHOTO · 非真人照片</div>
      <div style={{position: "absolute", left: 36, right: 36, bottom: 34, textAlign: "center", fontFamily: '"STKaiti","KaiTi",serif', fontSize: 35, fontWeight: 900, letterSpacing: 7}}>山河作证 · 良辰相见</div>
    </div>

    <div style={{position: "absolute", left: 68, right: 68, top: 770, textAlign: "center"}}>
      <div style={{color: "#c98e63", fontSize: 15, fontWeight: 950, letterSpacing: 7}}>WELCOME TO OUR WEDDING</div>
      <div style={{marginTop: 26, fontFamily: '"STKaiti","KaiTi",serif', fontSize: 73, fontWeight: 900, letterSpacing: 10, textShadow: "0 0 28px rgba(242,207,130,.4)"}}>
        {props.groomName}<span style={{margin: "0 26px", color: "#d64045", fontFamily: "sans-serif", fontSize: 38}}>×</span>{props.brideName}
      </div>
      <div style={{marginTop: 9, color: "#ffb9ad", fontSize: 14, fontWeight: 950, letterSpacing: 3}}>新娘完整姓名为模拟值 · 正式使用前请确认</div>
      <div style={{width: 78, height: 2, margin: "30px auto 25px", background: "#f2cf82", boxShadow: "0 0 24px rgba(242,207,130,.7)"}} />
      <div style={{color: "#f2cf82", fontSize: 36, fontWeight: 950, letterSpacing: 9}}>{props.date} · {props.time}</div>
      <div style={{marginTop: 15, color: "#d7bfa9", fontSize: 20, fontWeight: 900, letterSpacing: 3}}>{props.venue}</div>
      <div style={{marginTop: 29, fontFamily: '"STKaiti","KaiTi",serif', fontSize: 30, fontWeight: 800, letterSpacing: 5}}>{props.vow}</div>
    </div>

    <div style={{position: "absolute", left: 68, right: 68, bottom: 44, paddingTop: 18, display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(242,207,130,.22)", color: "#c98e63", fontSize: 13, fontWeight: 900, letterSpacing: 2}}>
      <span>{PROJECT.simulation.label}</span>
      <span>04:05 · DOWNLOADABLE STILL</span>
    </div>
  </AbsoluteFill>
);
