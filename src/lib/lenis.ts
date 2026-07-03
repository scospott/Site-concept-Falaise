import type Lenis from "lenis";

// Instance Lenis partagée (posée par SmoothScroll, consommée par la Nav
// pour stopper le scroll quand l'overlay mobile est ouvert, etc.)
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}
