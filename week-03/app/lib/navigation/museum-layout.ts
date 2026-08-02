export type Direction = "ahead" | "left" | "right" | "back" | "stairs-down" | "exit";

const directionLabels: Record<Direction, string> = {
  ahead: "Ahead",
  left: "Left",
  right: "Right",
  back: "Back",
  "stairs-down": "Down",
  exit: "Exit",
};

const directionSymbols: Record<Direction, string> = {
  ahead: "\u2191",
  left: "\u2190",
  right: "\u2192",
  back: "\u2193",
  "stairs-down": "\u2B07",
  exit: "\u2197",
};

export function getDirectionLabel(direction: Direction): string {
  return directionLabels[direction];
}

export function getDirectionSymbol(direction: Direction): string {
  return directionSymbols[direction];
}
