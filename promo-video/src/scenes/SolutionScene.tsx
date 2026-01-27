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

  const sceneExitStart = 120;
  const exitOpacity = interpolate(
    frame,
    [sceneExitStart, 150],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  const exitY = interpolate(
    frame,
    [sceneExitStart, 150],
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
            gap: 80,
            alignItems: "center",
          }}
        >
          {features.map((feature, index) => {
            const delay = 55 + index * 15;
            const featureOpacity = interpolate(
              frame,
              [delay, delay + 20],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            const featureY = spring({
              frame: frame - delay,
              fps,
              config: { damping: 15, stiffness: 100 },
              from: 20,
              to: 0,
            });

            const hoverEffect = interpolate(
              Math.sin(((frame - delay) / 40 + index) * Math.PI * 2),
              [-1, 1],
              [-2, 2]
            );

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  opacity: featureOpacity,
                  transform: `translateY(${featureY + (frame > delay + 20 ? hoverEffect : 0)}px)`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -30,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    backgroundColor: "#0a0a1a",
                    opacity: featureOpacity * 0.3,
                  }}
                />

                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 300,
                    color: "#2d3748",
                    letterSpacing: "0.05em",
                    position: "relative",
                  }}
                >
                  {feature}
                  <div
                    style={{
                      position: "absolute",
                      bottom: -8,
                      left: 0,
                      right: 0,
                      height: 1,
                      background: `linear-gradient(90deg, transparent, rgba(10, 10, 26, ${featureOpacity * 0.15}), transparent)`,
                    }}
                  />
                </span>

                <div
                  style={{
                    width: 60,
                    height: 1,
                    background: "linear-gradient(90deg, transparent, #0a0a1a, transparent)",
                    opacity: 0.2,
                    marginTop: 6,
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: -30,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 2,
                    height: 2,
                    borderRadius: "50%",
                    backgroundColor: "#0a0a1a",
                    opacity: featureOpacity * 0.2,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
