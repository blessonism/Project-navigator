import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

import { IntroScene } from "./scenes/IntroScene";
import { PainPointScene } from "./scenes/PainPointScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { TechStackScene } from "./scenes/TechStackScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { CTAScene } from "./scenes/CTAScene";
import type { PromoProps } from "./schema";

export const NavigatorPromo: React.FC<PromoProps> = ({
  title,
  tagline,
  primaryColor,
  secondaryColor,
}) => {
  const transitionDuration = 30;

  return (
    <AbsoluteFill style={{ backgroundColor: "#fafafa" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <IntroScene
            title={title}
            tagline={tagline}
            primaryColor={primaryColor}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        <TransitionSeries.Sequence durationInFrames={120}>
          <PainPointScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        <TransitionSeries.Sequence durationInFrames={150}>
          <SolutionScene primaryColor={primaryColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        <TransitionSeries.Sequence durationInFrames={150}>
          <TechStackScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        <TransitionSeries.Sequence durationInFrames={240}>
          <FeaturesScene primaryColor={primaryColor} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        <TransitionSeries.Sequence durationInFrames={150}>
          <CTAScene
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
