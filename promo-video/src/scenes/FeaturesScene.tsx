import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

type FeaturesSceneProps = {
  primaryColor: string;
};

type FeatureShowcase = {
  title: string;
  subtitle: string;
  number: string;
};

export const FeaturesScene: React.FC<FeaturesSceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features: FeatureShowcase[] = [
    {
      title: "双主题设计",
      subtitle: "Classic · Modern",
      number: "01",
    },
    {
      title: "管理后台",
      subtitle: "密码保护",
      number: "02",
    },
    {
      title: "响应式布局",
      subtitle: "全设备适配",
      number: "03",
    },
  ];

  const featureDuration = 80;
  const currentFeatureIndex = Math.min(
    Math.floor(frame / featureDuration),
    features.length - 1
  );
  const featureFrame = frame % featureDuration;

  const currentFeature = features[currentFeatureIndex];

  const enterOpacity = interpolate(featureFrame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const exitOpacity = interpolate(
    featureFrame,
    [featureDuration - 20, featureDuration],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  const featureOpacity =
    featureFrame < featureDuration - 20 ? enterOpacity : exitOpacity;

  const featureY = spring({
    frame: featureFrame,
    fps,
    config: { damping: 200, stiffness: 60 },
    from: 30,
    to: 0,
  });

  const numberOpacity = interpolate(featureFrame, [0, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const numberScale = interpolate(featureFrame, [0, 40], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const progressOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const progressWidth = interpolate(
    frame,
    [0, features.length * featureDuration],
    [0, 600],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.linear,
    }
  );

  const bracketOpacity = interpolate(featureFrame, [5, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bracketSize = interpolate(featureFrame, [5, 35], [0, 50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

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
          fontSize: 280,
          fontWeight: 100,
          color: "#0a0a1a",
          opacity: numberOpacity * 0.018,
          letterSpacing: "-0.05em",
          transform: `scale(${numberScale})`,
          pointerEvents: "none",
        }}
      >
        {currentFeature.number}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          opacity: featureOpacity,
          transform: `translateY(${featureY}px)`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            left: -40,
            opacity: bracketOpacity * 0.2,
          }}
        >
          <div
            style={{
              width: bracketSize,
              height: 1,
              backgroundColor: "#0a0a1a",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <div
            style={{
              width: 1,
              height: bracketSize,
              backgroundColor: "#0a0a1a",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: -30,
            right: -40,
            opacity: bracketOpacity * 0.2,
          }}
        >
          <div
            style={{
              width: bracketSize,
              height: 1,
              backgroundColor: "#0a0a1a",
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
          />
          <div
            style={{
              width: 1,
              height: bracketSize,
              backgroundColor: "#0a0a1a",
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
          />
        </div>

        <div
          style={{
            fontSize: 96,
            fontWeight: 200,
            color: "#0a0a1a",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.05em",
            textAlign: "center",
            textShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          {currentFeature.title}
        </div>

        <div
          style={{
            fontSize: 42,
            fontWeight: 300,
            color: "#4a5568",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.15em",
            textAlign: "center",
          }}
        >
          {currentFeature.subtitle}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 100,
          opacity: progressOpacity,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 600,
            height: 1,
            backgroundColor: "rgba(10, 10, 26, 0.08)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: progressWidth,
              height: 1,
              backgroundColor: "#0a0a1a",
              opacity: 0.3,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 12,
            width: 600,
          }}
        >
          {features.map((feature, index) => {
            const isActive = index === currentFeatureIndex;
            const isPast = index < currentFeatureIndex;

            return (
              <div
                key={index}
                style={{
                  fontSize: 14,
                  fontWeight: 300,
                  color: isActive || isPast ? "#0a0a1a" : "#4a5568",
                  opacity: isActive ? 0.6 : isPast ? 0.3 : 0.2,
                  fontFamily: "monospace",
                  letterSpacing: "0.1em",
                }}
              >
                {feature.number}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
