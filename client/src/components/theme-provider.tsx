"use client";

import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#09090b", paper: "#09090b" },
    text: { primary: "#fafafa", secondary: "#a1a1aa" },
    divider: "#27272a",
  },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
