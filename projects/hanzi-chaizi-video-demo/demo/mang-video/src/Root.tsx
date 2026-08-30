import React from "react";
import {Composition, Still} from "remotion";
import voiceover from "./generated-mang-voiceover.json";
import effectsVoiceover from "./generated-effects-voiceover.json";
import {MangHeartDirectionVideo} from "./MangHeartDirectionVideo";
import {EffectsLabVideo} from "./EffectsLabVideo";
import {
  ConfigurableHanziVideo,
  DEFAULT_WORKBENCH_PROPS,
} from "./ConfigurableHanziVideo";
import {
  DEFAULT_NAME_BLESSING_PROPS,
  NameBlessingVideo,
} from "./NameBlessingVideo";
import {
  DEFAULT_WEDDING_STORY_PROPS,
  WeddingStoryVideo,
} from "./WeddingStoryVideo";
import {
  DEFAULT_WEDDING_SCREEN_PROPS,
  WeddingScreenVideo,
} from "./WeddingScreenVideo";
import {WeddingWelcomePoster} from "./WeddingWelcomePoster";

const FPS = 30;
const DURATION = Math.ceil(voiceover.videoDuration * FPS);
const EFFECTS_DURATION = Math.ceil(effectsVoiceover.videoDuration * FPS);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="MangHeartDirection"
      component={MangHeartDirectionVideo}
      durationInFrames={DURATION}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="HanziEffectsLab"
      component={EffectsLabVideo}
      durationInFrames={EFFECTS_DURATION}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="ConfigurableHanzi"
      component={ConfigurableHanziVideo}
      durationInFrames={255}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={DEFAULT_WORKBENCH_PROPS}
    />
    <Composition
      id="NameBlessing"
      component={NameBlessingVideo}
      durationInFrames={375}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={DEFAULT_NAME_BLESSING_PROPS}
    />
    <Composition
      id="WeddingStory"
      component={WeddingStoryVideo}
      durationInFrames={600}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={DEFAULT_WEDDING_STORY_PROPS}
    />
    <Composition
      id="WeddingScreen"
      component={WeddingScreenVideo}
      durationInFrames={750}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={DEFAULT_WEDDING_SCREEN_PROPS}
    />
    <Still
      id="WeddingWelcomePoster"
      component={WeddingWelcomePoster}
      width={1080}
      height={1350}
      defaultProps={DEFAULT_WEDDING_SCREEN_PROPS}
    />
  </>
);
