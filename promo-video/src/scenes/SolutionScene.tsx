import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import React from "react";

type SolutionSceneProps = {
  primaryColor: string;
};

export const SolutionScene: React.FC<SolutionSceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 内部退场从 150 帧开始，持续到场景结束 180 帧
  const sceneExitStart = 150;
  const exitOpacity = interpolate(
    frame,
    [sceneExitStart, 180],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  const exitY = interpolate(
    frame,
    [sceneExitStart, 180],
    [0, -30],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  const borderOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const borderProgress = interpolate(frame, [0, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const titleOpacity = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const titleY = spring({
    frame: frame - 15,
    fps,
    config: { damping: 200, stiffness: 80 },
    from: 40,
    to: 0,
  });

  const breathe = interpolate(
    Math.sin((frame / 60) * Math.PI * 2),
    [-1, 1],
    [0.95, 1]
  );

  const glowPulse = interpolate(
    Math.sin((frame / 90) * Math.PI * 2),
    [-1, 1],
    [0.3, 0.6]
  );

  const dotGridOpacity = interpolate(frame, [20, 60], [0, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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

      return (
        <span
          key={index}
          style={{
            opacity: letterOpacity,
            display: "inline-block",
            transform: `translateY(${interpolate(
              frame,
              [letterDelay, letterDelay + 20],
              [10, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.ease),
              }
            )}px)`,
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
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: dotGridOpacity,
        }}
      >
        <defs>
          <pattern
            id="dot-grid"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.8" fill="rgba(10, 10, 26, 0.15)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 800,
          height: 800,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, rgba(10, 10, 26, ${glowPulse * 0.03}) 0%, transparent 70%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          right: 60,
          bottom: 60,
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            overflow: "visible",
          }}
        >
          <defs>
            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(10, 10, 26, 0.2)" />
              <stop offset="50%" stopColor="rgba(10, 10, 26, 0.08)" />
              <stop offset="100%" stopColor="rgba(10, 10, 26, 0.2)" />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="none"
            stroke="url(#borderGradient)"
            strokeWidth="1"
            strokeDasharray="4000"
            strokeDashoffset={4000 * (1 - borderProgress)}
            style={{
              opacity: borderOpacity,
            }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            top: -4,
            left: -4,
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#0a0a1a",
            opacity: borderOpacity * 0.4,
            boxShadow: `0 0 20px rgba(10, 10, 26, ${glowPulse * 0.4})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#0a0a1a",
            opacity: borderOpacity * 0.4,
            boxShadow: `0 0 20px rgba(10, 10, 26, ${glowPulse * 0.4})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -4,
            left: -4,
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#0a0a1a",
            opacity: borderOpacity * 0.4,
            boxShadow: `0 0 20px rgba(10, 10, 26, ${glowPulse * 0.4})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -4,
            right: -4,
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#0a0a1a",
            opacity: borderOpacity * 0.4,
            boxShadow: `0 0 20px rgba(10, 10, 26, ${glowPulse * 0.4})`,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 90,
          position: "relative",
          zIndex: 10,
          opacity: exitOpacity,
          transform: `translateY(${exitY}px)`,
        }}
      >
        <div style={{ position: "relative", padding: "0 80px" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 500,
              height: 200,
              transform: `translate(-50%, -50%) scale(${breathe})`,
              background: "radial-gradient(ellipse, rgba(10, 10, 26, 0.02) 0%, transparent 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          <h1
            style={{
              fontSize: 100,
              fontWeight: 200,
              color: "#0a0a1a",
              margin: 0,
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              letterSpacing: "-0.02em",
              textShadow: "0 4px 20px rgba(0,0,0,0.05)",
              position: "relative",
            }}
          >
            {renderLetters("Navigator", 25)}
          </h1>

          <div
            style={{
              position: "absolute",
              bottom: -20,
              left: "50%",
              transform: "translateX(-50%)",
              width: interpolate(frame, [40, 70], [0, 120], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(10, 10, 26, 0.2), transparent)",
            }}
          />

          <div
            style={{
              textAlign: "center",
              marginTop: 30,
              fontSize: 16,
              fontWeight: 400,
              color: "#718096",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: interpolate(frame, [40, 60], [0, 0.8]),
            }}
          >
            Project Dashboard
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
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: `${underlineWidth * 0.4}%`,
                      height: 4,
                      backgroundColor: "#d1d5db",
                      borderRadius: 2,
                      opacity: 0.6,
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
