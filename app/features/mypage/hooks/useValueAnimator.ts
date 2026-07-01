import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export type AnimatorOptions = {
  from: number;
  to: number;
  duration: number;
  ease: (t: number) => number;
  onUpdate?: (v: number) => void;
  onComplete?: () => void;
};

type AnimatorState = AnimatorOptions & {
  active: boolean;
  start: number;
};

export function useValueAnimator() {
  const animRef = useRef<AnimatorState | null>(null);

  useFrame(() => {
    const a = animRef.current;
    if (!a?.active) return;

    const t = (performance.now() - a.start) / a.duration;
    const clamped = Math.min(1, Math.max(0, t));
    const v = THREE.MathUtils.lerp(a.from, a.to, a.ease(clamped));

    a.onUpdate?.(v);
    if (clamped >= 1) {
      a.active = false;
      a.onComplete?.();
    }
  });

  const start = (opt: AnimatorOptions) => {
    animRef.current = { active: true, start: performance.now(), ...opt };
  };

  return { start };
}
