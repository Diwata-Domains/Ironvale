import type { StorybookConfig } from "@storybook/react-vite";

/**
 * Ironvale — master component library for all Diwata surfaces:
 * web (React), desktop (Tauri webview), mobile (future), CLI (terminal UI sub-package).
 *
 * This Storybook is the interactive explorer and living docs for all components.
 * Deploy target: components.diwata.domains
 */
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-essentials",    // controls, actions, docs, viewport, backgrounds
    "@storybook/addon-a11y",          // accessibility audit on every story
    "@storybook/addon-interactions",  // play() function testing
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",    // any component tagged @tag autodocs gets a generated doc page
    defaultName: "Docs",
  },
};

export default config;
