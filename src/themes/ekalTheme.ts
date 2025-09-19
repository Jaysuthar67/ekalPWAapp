import { createLightTheme } from "@fluentui/react-components";
import type { BrandVariants, Theme } from "@fluentui/react-components";

const ekalBrand: BrandVariants = {
  10: "#02020A",
  20: "#111233",
  30: "#1A1D5C",
  40: "#202475",
  50: "#282C8E",
  60: "#2F35A9",
  70: "#3A43C3",
  80: "#4B55D1",
  90: "#5C67DE",
  100: "#6C78EA",
  110: "#7D89F5",
  120: "#8E99FF",
  130: "#A0AAFF",
  140: "#B3BCFF",
  150: "#C6CEFF",
  160: "#D9DFFF",
};

const ekalLightTheme: Theme = createLightTheme(ekalBrand);

export const ekalTheme: Theme = {
  ...ekalLightTheme,
  // Override specific tokens for the orange accent
  colorBrandBackground: '#F1592A',
  colorBrandBackgroundHover: '#f58a6a',
  colorBrandBackgroundPressed: '#bd5332',
  colorCompoundBrandStroke: '#F1592A',
  colorBrandStroke1: '#F1592A',
  colorBrandStroke2: '#f58a6a',
  colorBrandForeground1: ekalBrand[80], // A blue from the ramp for text on orange bg
};
