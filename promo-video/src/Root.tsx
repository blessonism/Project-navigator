import { Composition } from "remotion";
import { NavigatorPromo } from "./NavigatorPromo";
import { promoSchema } from "./schema";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="NavigatorPromo"
      component={NavigatorPromo}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
      schema={promoSchema}
      defaultProps={{
        title: "Navigator",
        tagline: "现代化的个人项目展示平台",
        primaryColor: "#6366f1",
        secondaryColor: "#8b5cf6",
      }}
    />
  );
};
