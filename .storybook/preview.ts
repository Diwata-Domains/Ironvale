import type { Preview } from "@storybook/react-vite";

import "@diwata/aether/tokens.css";
import "../src/ironvale.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    viewport: {
      // Preset viewports for all Diwata surfaces
      viewports: {
        web: { name: "Web (1280px)", styles: { width: "1280px", height: "800px" } },
        tablet: { name: "Tablet (768px)", styles: { width: "768px", height: "1024px" } },
        mobile: { name: "Mobile (390px)", styles: { width: "390px", height: "844px" } },
        desktop: { name: "Desktop (1440px)", styles: { width: "1440px", height: "900px" } },
      },
      defaultViewport: "web",
    },
  },
  tags: ["autodocs"],
};

export default preview;
