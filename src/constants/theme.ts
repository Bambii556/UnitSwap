export type Color = {
  primary: string;
  text: string;
  background: string;
  tint: string;
  icon: string;
  border: string;
  tabIconDefault: string;
  tabIconSelected: string;
  card: string;
  muted: string;
  cardSecond: string;
};

export type ThemeColors = {
  light: Color;
  dark: Color;
};

export const Theme: ThemeColors = {
  light: {
    primary: "#135bec",
    text: "#11181C",
    background: "#fff",
    tint: "#0a7ea4",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#0a7ea4",
    card: "#F0F2F4",
    border: "#E0E2E4", // Added border color for light theme
    muted: "#8a8a8e",
    cardSecond: "#E0E2E4",
  },
  dark: {
    primary: "#135bec",
    text: "#ECEDEE",
    background: "#111724",
    tint: "#0a7ea4",
    icon: "#ffffff",
    border: "#ffffff1a",
    tabIconDefault: "#ECEDEE80",
    tabIconSelected: "#0a7ea4",
    card: "#192545",
    muted: "#8a8a8e",
    cardSecond: "#0a1634",
  },
};
