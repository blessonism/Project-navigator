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

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const titleY = interpolate(frame, [0, 30], [20, 0], {
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
            const delay = 35 + index * 18;
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
                      textShadow: "0 1px 2px rgba(0,0,0,0.02)",
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
              </div>
            );
          })}
        </div>

        <div
          style={{
            fontSize: 20,
            fontWeight: 300,
            color: "#4a5568",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.2em",
            opacity: taglineOpacity * 0.5,
            marginTop: 20,
          }}
        >
          BUILT WITH PRECISION
        </div>
      </div>
    </AbsoluteFill>
  );
};
