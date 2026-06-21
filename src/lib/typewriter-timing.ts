/** Misma velocidad que la portada (+2.6% acumulado sobre 160ms / 38ms). */
export const TYPEWRITER_SPEED_FACTOR = 1.013 * 1.013;
export const TYPEWRITER_START_MS = Math.round(160 / TYPEWRITER_SPEED_FACTOR);

export function typewriterCharMs(step: number) {
  return step % 2 === 1 ? 36 : 37;
}
