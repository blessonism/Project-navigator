import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

type CTASceneProps = {
  primaryColor: string;
  secondaryColor: string;
};

export const CTAScene: React.FC<CTASceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const titleY = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 60 },
    from: 30,
    to: 0,
  });

  const taglineOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const linkOpacity = interpolate(frame, [70, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const linkY = interpolate(frame, [70, 95], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const lineWidth = interpolate(frame, [95, 120], [0, 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const arrowProgress = interpolate(frame, [100, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const arrowOpacity = interpolate(frame, [100, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const arrowPulse = interpolate(
    frame,
    [130, 145, 160],
    [1, 1.15, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "extend",
    }
  );

  const patternOpacity = interpolate(frame, [0, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const geometricRotation = interpolate(frame, [0, 140], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "extend",
  });

  const shimmerProgress = interpolate(frame, [50, 90], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cursorBlink = interpolate(
    frame,
    [110, 120, 130, 140, 150, 160],
    [0, 1, 0, 1, 0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "extend",
    }
  );

  const licenseOpacity = interpolate(frame, [130, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const licenseScale = interpolate(frame, [130, 155], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const renderLetters = (text: string, startFrame: number) => {
    return text.split("").map((letter, index) => {
      const letterDelay = startFrame + index * 3;
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

      const letterY = interpolate(
        frame,
        [letterDelay, letterDelay + 15],
        [10, 0],
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
            transform: `translateY(${letterY}px)`,
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
          top: 80,
          right: 80,
          width: 120,
          height: 120,
          opacity: patternOpacity * 0.06,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundImage: `
              linear-gradient(rgba(10, 10, 26, 1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(10, 10, 26, 1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 40,
            height: 40,
            border: "1px solid #0a0a1a",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) rotate(${geometricRotation}deg)`,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 50,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 300,
              color: "#4a5568",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.15em",
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
            }}
          >
            {renderLetters("OPEN SOURCE", 5)}
          </div>

          <div
            style={{
              fontSize: 96,
              fontWeight: 200,
              color: "#0a0a1a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.08em",
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              textShadow: "0 2px 4px rgba(0,0,0,0.03)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            完全免费
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${shimmerProgress}%`,
                width: "30%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                transform: "skewX(-20deg)",
              }}
            />
          </div>

          <div
            style={{
              fontSize: 18,
              fontWeight: 300,
              color: "#4a5568",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.25em",
              opacity: taglineOpacity * 0.5,
              marginTop: -20,
            }}
          >
            START BUILDING
          </div>
        </div>

        <div
          style={{
            width: lineWidth,
            height: 1,
            backgroundColor: "#0a0a1a",
            opacity: 0.2,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 25,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity: linkOpacity,
              transform: `translateY(${linkY}px)`,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 300,
                color: "#4a5568",
                fontFamily: "monospace",
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
              }}
            >
              github.com/blessonism/navigator
              <span
                style={{
                  marginLeft: 4,
                  opacity: cursorBlink * linkOpacity,
                  fontSize: 32,
                }}
              >
                |
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                opacity: arrowOpacity,
                transform: `scale(${arrowPulse})`,
              }}
            >
              <div
                style={{
                  width: arrowProgress * 50,
                  height: 1,
                  backgroundColor: "#4a5568",
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  borderLeft: `10px solid rgba(74, 85, 104, ${arrowProgress * 0.6})`,
                  transform: `translateX(${(1 - arrowProgress) * -10}px)`,
                }}
              />
            </div>
          </div>

          <div
            style={{
              padding: "6px 14px",
              border: "1px solid rgba(10, 10, 26, 0.2)",
              borderRadius: 3,
              fontSize: 11,
              fontWeight: 400,
              color: "#4a5568",
              fontFamily: "monospace",
              letterSpacing: "0.15em",
              opacity: licenseOpacity * 0.5,
              transform: `scale(${licenseScale})`,
            }}
          >
            MIT LICENSE
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
