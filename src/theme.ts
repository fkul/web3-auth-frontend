import { extendTheme, theme as baseTheme, ThemeConfig } from "@chakra-ui/react";
import { mode, StyleFunctionProps } from "@chakra-ui/theme-tools";

type Theme = typeof baseTheme;

const config: ThemeConfig = {
  initialColorMode: "dark",
};

export const theme = extendTheme({
  config,
  styles: {
    global: (props: StyleFunctionProps) => ({
      "::-webkit-scrollbar": {
        width: "7px",
        height: "7px",
      },
      "::-webkit-scrollbar-track": {
        bg: "transparent",
      },
      "::-webkit-scrollbar-thumb": {
        bg: mode("blackAlpha.500", "whiteAlpha.100")(props),
        borderRadius: "7px",
      },
    }),
  },
}) as Theme;
