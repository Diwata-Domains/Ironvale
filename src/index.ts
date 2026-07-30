export { Button } from './components/Button/Button.js';
export type { ButtonProps, ButtonSize, ButtonVariant } from './components/Button/Button.js';
export { Input } from './components/Input/Input.js';
export type { InputProps } from './components/Input/Input.js';
export { Select } from './components/Select/Select.js';
export type { SelectOption, SelectProps } from './components/Select/Select.js';
export { ThemeToggle } from './components/ThemeToggle/ThemeToggle.js';
export type { ThemeToggleProps } from './components/ThemeToggle/ThemeToggle.js';
export {
  getColorMode,
  setColorMode,
  initColorMode,
  toggleColorMode,
  applyColorMode,
} from './colorMode.js';
export type { ColorMode } from './colorMode.js';
export {
  getFontPreset,
  setFontPreset,
  initFontPreset,
  applyFontPreset,
} from './fontPreset.js';
export type { FontPreset } from './fontPreset.js';
export {
  getThemePreset,
  setThemePreset,
  initThemePreset,
  applyThemePreset,
  presetNativeMode,
  THEME_PRESETS,
} from './themePreset.js';
export type { ThemePreset, ThemePresetOption } from './themePreset.js';
export {
  getTextScale,
  setTextScale,
  initTextScale,
  applyTextScale,
  TEXT_SCALES,
} from './textScale.js';
export type { TextScale } from './textScale.js';
export {
  getAccent,
  setAccent,
  initAccent,
  applyAccentSwatch,
  applyAccent,
  clearAccent,
  ACCENTS,
} from './accent.js';
export type { Accent, AccentSwatch, ApplyAccentOptions } from './accent.js';
export {
  getContrast,
  setContrast,
  initContrast,
  applyContrast,
  toggleContrast,
} from './contrast.js';
export type { Contrast } from './contrast.js';
export {
  getDensity,
  setDensity,
  initDensity,
  applyDensity,
  toggleDensity,
} from './density.js';
export type { Density } from './density.js';
export {
  getMotion,
  setMotion,
  initMotion,
  applyMotion,
  toggleMotion,
} from './reducedMotion.js';
export type { Motion } from './reducedMotion.js';
export { AppearancePanel } from './components/AppearancePanel/AppearancePanel.js';
export type { AppearancePanelProps } from './components/AppearancePanel/AppearancePanel.js';
export { Stack } from './components/Stack/Stack.js';
export type { StackDirection, StackGap, StackProps } from './components/Stack/Stack.js';
export { Surface } from './components/Surface/Surface.js';
export type { SurfaceElement, SurfaceProps, SurfaceVariant } from './components/Surface/Surface.js';
export { Text } from './components/Text/Text.js';
export type { TextElement, TextProps, TextVariant } from './components/Text/Text.js';
export { Card } from './components/Card/Card.js';
export type { CardProps, CardVariant } from './components/Card/Card.js';
export { Dialog } from './components/Dialog/Dialog.js';
export type { DialogProps, DialogSize } from './components/Dialog/Dialog.js';
export { Badge } from './components/Badge/Badge.js';
export type { BadgeIntent, BadgeProps, BadgeTier, BadgeVariant } from './components/Badge/Badge.js';
export { NavItem } from './components/NavItem/NavItem.js';
export type { NavItemProps } from './components/NavItem/NavItem.js';
export { StatusDot } from './components/StatusDot/StatusDot.js';
export type {
  StatusDotColor,
  StatusDotProps,
  StatusDotSize,
  StatusDotState,
} from './components/StatusDot/StatusDot.js';
export {
  DEFAULT_LIVENESS_THRESHOLDS,
  freshness,
  livenessState,
} from './components/StatusDot/liveness.js';
export type { LivenessThresholds } from './components/StatusDot/liveness.js';
export { Table, Tbody, Td, Th, Thead, Tr } from './components/Table/Table.js';
export type { TableProps } from './components/Table/Table.js';
export { Spinner } from './components/Spinner/Spinner.js';
export type { SpinnerProps, SpinnerSize } from './components/Spinner/Spinner.js';
export { AppShell } from './components/AppShell/AppShell.js';
export type { AppShellProps } from './components/AppShell/AppShell.js';
export { AppNav } from './components/AppNav/AppNav.js';
export type { AppNavItem, AppNavProps } from './components/AppNav/AppNav.js';
export { ScrollArea } from './components/ScrollArea/ScrollArea.js';
export type { ScrollAreaProps } from './components/ScrollArea/ScrollArea.js';
export { ChatSurface } from './components/ChatSurface/ChatSurface.js';
export type { ChatMessage, ChatSurfaceProps } from './components/ChatSurface/ChatSurface.js';
export { ItemCard } from './components/ItemCard/ItemCard.js';
export type { ItemCardProps } from './components/ItemCard/ItemCard.js';
export { Tooltip } from './components/Tooltip/Tooltip.js';
export type { TooltipPlacement, TooltipProps } from './components/Tooltip/Tooltip.js';
export { Heatmap } from './components/Heatmap/Heatmap.js';
export type { HeatmapProps } from './components/Heatmap/Heatmap.js';
export {
  buildHeatmapGrid,
  levelFor,
  DEFAULT_THRESHOLDS as HEATMAP_DEFAULT_THRESHOLDS,
} from './components/Heatmap/heatmapGrid.js';
export type { HeatmapDatum, HeatmapCell, HeatmapGrid } from './components/Heatmap/heatmapGrid.js';
export { Constellation } from './components/Constellation/Constellation.js';
export type {
  ConstellationNode,
  ConstellationEdge,
  ConstellationTheme,
  ConstellationProps,
  ConstellationViewStats,
} from './components/Constellation/Constellation.js';
export {
  angleDelta,
  hopDistances,
  filterByTime,
  filterByReach,
  computeRingRadii,
  sectorsByGroup,
  fitCamera,
  zoomAround,
  screenToWorld,
  tiltFactor,
  DEFAULT_MAX_HOP,
  SKY_MARGIN,
} from './components/Constellation/graph.js';
export type { Camera, Vec2, Sector } from './components/Constellation/graph.js';

// --- ironvale form primitives (Checkbox + Heading; Select restyle in place) ---
export { Checkbox } from './components/Checkbox/Checkbox.js';
export type { CheckboxProps } from './components/Checkbox/Checkbox.js';
export { Heading } from './components/Heading/Heading.js';
export type { HeadingLevel, HeadingProps } from './components/Heading/Heading.js';
