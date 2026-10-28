export interface ConsentInsetStyle {
  paddingBottom: number;
  backgroundColor: string;
}

/** Screen content style that reserves the banner height on the screen's own background. */
export function consentInsetStyle(inset: number, backgroundColor: string): ConsentInsetStyle {
  return { paddingBottom: inset, backgroundColor };
}
