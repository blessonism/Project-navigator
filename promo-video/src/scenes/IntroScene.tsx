import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

type IntroSceneProps = {
  title: string;
  tagline: string;
  primaryColor: string;
};

export const IntroScene: React.FC<IntroSceneProps> = ({
  title,
}) => {
  const frame = useCurrentFrame();

  const cornerOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const cornerSize = interpolate(frame, [0, 40], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const breathingScale = interpolate(
    frame,
    [0, 60, 120],
    [0.98, 1.02, 0.98],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "extend",
    }
  );

  const gridOpacity = interpolate(frame, [0, 60], [0, 0.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const horizontalLineWidth = interpolate(frame, [40, 70], [0, 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const estOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const vignetteOpacity = interpolate(frame, [0, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const particleOpacity = interpolate(frame, [30, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const secondaryLineWidth = interpolate(frame, [50, 80], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const noiseOpacity = interpolate(frame, [0, 40], [0, 0.015], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const renderLetters = (text: string, startFrame: number) => {
    return text.split("").map((letter, index) => {
      const letterDelay = startFrame + index * 2;
      const letterOpacity = interpolate(
        frame,
        [letterDelay, letterDelay + 20],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }
      );

      const letterY = interpolate(
        frame,
        [letterDelay, letterDelay + 20],
        [15, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }
      );

      const gradientOpacity = interpolate(
        frame,
        [letterDelay + 10, letterDelay + 30],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      );

      return (
        <span
          key={index}
          style={{
            opacity: letterOpacity,
            transform: `translateY(${letterY}px)`,
            display: "inline-block",
            color: "#0a0a1a",
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      );
    });
  };

  const CornerBracket = ({
    position,
    rotation,
  }: {
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    rotation: number;
  }) => {
    const positionStyles = {
      "top-left": { top: 100, left: 100 },
      "top-right": { top: 100, right: 100 },
      "bottom-left": { bottom: 100, left: 100 },
      "bottom-right": { bottom: 100, right: 100 },
    };

    return (
      <div
        style={{
          position: "absolute",
          ...positionStyles[position],
          opacity: cornerOpacity * 0.15,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <div
          style={{
            width: cornerSize,
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
            height: cornerSize,
            backgroundColor: "#0a0a1a",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </div>
    );
  };

  const FloatingParticle = ({ index }: { index: number }) => {
    const seed = index * 123.456;
    const startX = (Math.sin(seed) * 400) + 540;
    const startY = (Math.cos(seed) * 300) + 360;
    const driftX = Math.sin(seed * 2) * 80;
    const driftY = Math.cos(seed * 1.5) * 60;

    const particleX = interpolate(
      frame,
      [0, 140],
      [0, driftX],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "extend",
      }
    );

    const particleY = interpolate(
      frame,
      [0, 140],
      [0, driftY],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "extend",
      }
    );

    const particleFade = interpolate(
      frame,
      [30 + index * 5, 60 + index * 5],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    return (
      <div
        style={{
          position: "absolute",
          left: startX + particleX,
          top: startY + particleY,
          width: 3,
          height: 3,
          borderRadius: "50%",
          backgroundColor: "#0a0a1a",
          opacity: particleFade * particleOpacity * 0.15,
        }}
      />
    );
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#fafafa",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `
          linear-gradient(rgba(10, 10, 26, ${gridOpacity}) 1px, transparent 1px),
          linear-gradient(90deg, rgba(10, 10, 26, ${gridOpacity}) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(10, 10, 26, 0.08) 100%)",
          opacity: vignetteOpacity,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(10, 10, 26, ${noiseOpacity}), rgba(10, 10, 26, ${noiseOpacity}) 1px, transparent 1px, transparent 2px),
            repeating-linear-gradient(90deg, rgba(10, 10, 26, ${noiseOpacity}), rgba(10, 10, 26, ${noiseOpacity}) 1px, transparent 1px, transparent 2px)
          `,
          pointerEvents: "none",
        }}
      />

      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <FloatingParticle key={i} index={i} />
      ))}

      <CornerBracket position="top-left" rotation={0} />
      <CornerBracket position="top-right" rotation={90} />
      <CornerBracket position="bottom-left" rotation={-90} />
      <CornerBracket position="bottom-right" rotation={180} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 60,
          transform: `scale(${breathingScale})`,
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: -40,
              left: "50%",
              transform: "translateX(-50%)",
              width: secondaryLineWidth,
              height: 1,
              backgroundColor: "#0a0a1a",
              opacity: 0.08,
            }}
          />

          <div
            style={{
              fontSize: 140,
              fontWeight: 200,
              color: "#0a0a1a",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.1em",
              textShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            {renderLetters(title, 20)}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: -40,
              left: "50%",
              transform: "translateX(-50%)",
              width: secondaryLineWidth,
              height: 1,
              backgroundColor: "#0a0a1a",
              opacity: 0.08,
            }}
          />
        </div>

        <div
          style={{
            width: horizontalLineWidth,
            height: 1,
            backgroundColor: "#0a0a1a",
            opacity: 0.15,
          }}
        />

        <div
          style={{
            fontSize: 18,
            fontWeight: 300,
            color: "#4a5568",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.3em",
            opacity: estOpacity * 0.4,
          }}
        >
          EST. 2024
        </div>
      </div>
    </AbsoluteFill>
  );
};
