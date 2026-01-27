import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

type TechItem = {
  name: string;
  icon: "circle" | "square" | "triangle" | "diamond" | "hexagon";
};

export const TechStackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const techStack: TechItem[] = [
    { name: "React", icon: "circle" },
    { name: "TypeScript", icon: "square" },
    { name: "Tailwind", icon: "triangle" },
    { name: "Framer Motion", icon: "diamond" },
    { name: "Supabase", icon: "hexagon" },
  ];

  // 移除内部退场动画，由 TransitionSeries 的 fade transition 统一处理
  const exitOpacity = 1;
  const exitY = 0;

  // 场景开始即开始标题动画
  const titleStartFrame = 0;
  const titleOpacity = interpolate(frame, [titleStartFrame, titleStartFrame + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1), // 更平滑的 ease-in-out
  });

  const titleY = interpolate(frame, [titleStartFrame, titleStartFrame + 30], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const taglineOpacity = interpolate(frame, [110, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const connectingLineProgress = interpolate(frame, [95, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const badgeOpacity = interpolate(frame, [120, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeScale = interpolate(frame, [120, 145], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const GeometricIcon = ({ type, opacity }: { type: string; opacity: number }) => {
    const iconSize = 18;
    const baseStyle = {
      opacity: opacity * 0.3,
      border: "1px solid #0a0a1a",
    };

    switch (type) {
      case "circle":
        return (
          <div
            style={{
              width: iconSize,
              height: iconSize,
              borderRadius: "50%",
              ...baseStyle,
            }}
          />
        );
      case "square":
        return (
          <div
            style={{
              width: iconSize,
              height: iconSize,
              ...baseStyle,
            }}
          />
        );
      case "triangle":
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${iconSize / 2}px solid transparent`,
              borderRight: `${iconSize / 2}px solid transparent`,
              borderBottom: `${iconSize}px solid rgba(10, 10, 26, ${opacity * 0.3})`,
            }}
          />
        );
      case "diamond":
        return (
          <div
            style={{
              width: iconSize,
              height: iconSize,
              transform: "rotate(45deg)",
              ...baseStyle,
            }}
          />
        );
      case "hexagon":
        return (
          <div
            style={{
              width: iconSize,
              height: iconSize,
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              backgroundColor: `rgba(10, 10, 26, ${opacity * 0.3})`,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#fafafa",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 80,
          opacity: exitOpacity,
          transform: `translateY(${exitY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 300,
            color: "#4a5568",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.15em",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          BUILT WITH
        </div>

        <div
          style={{
            display: "flex",
            gap: 60,
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            maxWidth: 1400,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 1,
              backgroundImage: `repeating-linear-gradient(
                to right,
                rgba(10, 10, 26, ${connectingLineProgress * 0.15}),
                rgba(10, 10, 26, ${connectingLineProgress * 0.15}) 8px,
                transparent 8px,
                transparent 16px
              )`,
              transform: "translateY(-50%)",
            }}
          />

          {techStack.map((tech, index) => {
            const delay = 55 + index * 15;
            const tagOpacity = interpolate(
              frame,
              [delay, delay + 25],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }
            );

            const tagY = spring({
              frame: frame - delay,
              fps,
              config: { damping: 200, stiffness: 60 },
              from: 15,
              to: 0,
            });

            const underlineWidth = interpolate(
              frame,
              [delay + 12, delay + 35],
              [0, 100],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }
            );

            const iconOpacity = interpolate(
              frame,
              [delay, delay + 20],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            const glowIntensity = interpolate(
              frame,
              [delay + 10, delay + 25, delay + 35],
              [0, 0.4, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  opacity: tagOpacity,
                  transform: `translateY(${tagY}px)`,
                  position: "relative",
                  zIndex: 1,
                  backgroundColor: "#fafafa",
                  padding: "0 16px",
                }}
              >
                <GeometricIcon type={tech.icon} opacity={iconOpacity} />

                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: 300,
                      color: "#0a0a1a",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      letterSpacing: "0.08em",
                      paddingBottom: 8,
                      textShadow: `0 1px 2px rgba(0,0,0,0.02), 0 0 ${glowIntensity * 20}px rgba(10, 10, 26, ${glowIntensity * 0.3})`,
                    }}
                  >
                    {tech.name}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: `${underlineWidth}%`,
                      height: 1,
                      backgroundColor: "#0a0a1a",
                      opacity: 0.2,
                    }}
                  />
                </div>

                {index < techStack.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      right: -40,
                      top: "50%",
                      fontSize: 20,
                      color: "#0a0a1a",
                      opacity: interpolate(
                        frame,
                        [delay + 20, delay + 35],
                        [0, 0.15],
                        {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        }
                      ),
                    }}
                  >
                    •
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginTop: 20,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 300,
              color: "#4a5568",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.2em",
              opacity: taglineOpacity * 0.5,
            }}
          >
            BUILT WITH PRECISION
          </div>

          <div
            style={{
              padding: "8px 16px",
              border: "1px solid rgba(10, 10, 26, 0.15)",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 400,
              color: "#0a0a1a",
              fontFamily: "monospace",
              letterSpacing: "0.1em",
              opacity: badgeOpacity * 0.6,
              transform: `scale(${badgeScale})`,
            }}
          >
            PRODUCTION READY
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
