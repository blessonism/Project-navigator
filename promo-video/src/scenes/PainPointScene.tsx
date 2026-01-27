import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

export const PainPointScene: React.FC = () => {
  const frame = useCurrentFrame();

  const words = ["作品集展示", "不应该", "如此复杂"];

  const quoteOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const quoteScale = interpolate(frame, [0, 25], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const lineOpacity = interpolate(frame, [80, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineWidth = interpolate(frame, [80, 110], [0, 500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const backgroundNoiseOpacity = interpolate(frame, [0, 40], [0, 0.008], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ellipsisOpacity = interpolate(frame, [90, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ellipsisPulse = interpolate(
    frame,
    [90, 110, 130, 150],
    [0.7, 1, 0.7, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "extend",
    }
  );

  const dividerPulse = interpolate(
    frame,
    [110, 125, 140],
    [0.2, 0.3, 0.2],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "extend",
    }
  );

  const bgGradientShift = interpolate(frame, [0, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const vignetteOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const renderWords = () => {
    return words.map((word, wordIndex) => {
      const wordDelay = 30 + wordIndex * 15;
      const wordOpacity = interpolate(
        frame,
        [wordDelay, wordDelay + 20],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }
      );

      const wordY = interpolate(
        frame,
        [wordDelay, wordDelay + 20],
        [25, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }
      );

      const isLastWord = wordIndex === words.length - 1;

      return (
        <span
          key={wordIndex}
          style={{
            opacity: wordOpacity,
            transform: `translateY(${wordY}px)`,
            display: "inline-block",
            marginRight: isLastWord ? 0 : 24,
          }}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg,
          rgba(250, 250, 250, 1) ${100 - bgGradientShift * 2}%,
          rgba(248, 248, 252, 1) 100%)`,
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            rgba(10, 10, 26, ${backgroundNoiseOpacity}),
            rgba(10, 10, 26, ${backgroundNoiseOpacity}) 1px,
            transparent 1px,
            transparent 2px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(10, 10, 26, ${backgroundNoiseOpacity}),
            rgba(10, 10, 26, ${backgroundNoiseOpacity}) 1px,
            transparent 1px,
            transparent 2px
          )
        `,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(10, 10, 26, 0.05) 100%)",
          opacity: vignetteOpacity,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 280,
          fontWeight: 100,
          color: "#0a0a1a",
          opacity: 0.012,
          letterSpacing: "-0.05em",
          pointerEvents: "none",
        }}
      >
        "
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 80,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            left: -80,
            fontSize: 120,
            fontWeight: 300,
            color: "#0a0a1a",
            opacity: quoteOpacity * 0.25,
            transform: `scale(${quoteScale})`,
            fontFamily: "Georgia, serif",
          }}
        >
          "
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 300,
            color: "#0a0a1a",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.05em",
            textAlign: "center",
            maxWidth: 1200,
            lineHeight: 1.5,
            textShadow: "0 2px 4px rgba(0,0,0,0.02)",
            display: "flex",
            alignItems: "center",
          }}
        >
          {renderWords()}
          <span
            style={{
              opacity: ellipsisOpacity * ellipsisPulse,
              marginLeft: 12,
              fontSize: 80,
              transform: "translateY(-4px)",
            }}
          >
            ...
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: -80,
            fontSize: 120,
            fontWeight: 300,
            color: "#0a0a1a",
            opacity: quoteOpacity * 0.25,
            transform: `scale(${quoteScale})`,
            fontFamily: "Georgia, serif",
          }}
        >
          "
        </div>

        <div
          style={{
            width: lineWidth,
            height: 1,
            backgroundColor: "#0a0a1a",
            opacity: lineOpacity * dividerPulse,
            boxShadow: `0 0 8px rgba(10, 10, 26, ${lineOpacity * dividerPulse * 0.3})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
