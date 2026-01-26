import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

type SolutionSceneProps = {
  primaryColor: string;
};

export const SolutionScene: React.FC<SolutionSceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const borderOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const borderProgress = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const titleOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const titleY = spring({
    frame: frame - 20,
    fps,
    config: { damping: 200, stiffness: 60 },
    from: 30,
    to: 0,
  });

  const accentOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const accentRotation = interpolate(frame, [30, 60], [0, 45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const features = ["即开即用", "专业优雅", "完整可控"];

  const renderLetters = (text: string, startFrame: number) => {
    return text.split("").map((letter, index) => {
      const letterDelay = startFrame + index * 1.5;
      const letterOpacity = interpolate(
        frame,
        [letterDelay, letterDelay + 15],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }
      );

      const letterSpacing = interpolate(
        frame,
        [letterDelay, letterDelay + 15],
        [0.15, 0.08],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }
      );

      return (
        <span
          key={index}
          style={{
            opacity: letterOpacity,
            letterSpacing: `${letterSpacing}em`,
            display: "inline-block",
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      );
    });
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#fafafa",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          right: 60,
          bottom: 60,
          border: `1px solid rgba(10, 10, 26, ${borderOpacity * 0.12})`,
          opacity: borderProgress,
          clipPath: `polygon(
            0 0,
            ${borderProgress * 100}% 0,
            ${borderProgress * 100}% ${borderProgress * 100}%,
            0 ${borderProgress * 100}%
          )`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 100,
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: -25,
              left: -35,
              width: 20,
              height: 20,
              border: "1px solid #0a0a1a",
              opacity: accentOpacity * 0.2,
              transform: `rotate(${accentRotation}deg)`,
            }}
          />

          <div
            style={{
              fontSize: 96,
              fontWeight: 200,
              color: "#0a0a1a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              textShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            {renderLetters("Navigator", 25)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 0,
            alignItems: "center",
          }}
        >
          {features.map((feature, index) => {
            const delay = 60 + index * 20;
            const featureOpacity = interpolate(
              frame,
              [delay, delay + 25],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }
            );

            const featureY = interpolate(
              frame,
              [delay, delay + 25],
              [20, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }
            );

            const underlineWidth = interpolate(
              frame,
              [delay + 10, delay + 35],
              [0, 100],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }
            );

            const dotOpacity = interpolate(
              frame,
              [delay + 15, delay + 30],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            const isLastFeature = index === features.length - 1;

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    opacity: featureOpacity,
                    transform: `translateY(${featureY}px)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 300,
                      color: "#4a5568",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      letterSpacing: "0.12em",
                      paddingBottom: 8,
                    }}
                  >
                    {feature}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: `${underlineWidth}%`,
                      height: 1,
                      backgroundColor: "#0a0a1a",
                      opacity: 0.25,
                    }}
                  />
                </div>

                {!isLastFeature && (
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 300,
                      color: "#4a5568",
                      margin: "0 50px",
                      opacity: dotOpacity * 0.3,
                    }}
                  >
                    ·
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
