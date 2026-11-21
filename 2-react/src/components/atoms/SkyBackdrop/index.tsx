import { useEffect } from "react";
import {
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { WeatherAmbience } from "@/components/atoms/WeatherAmbience";
import type { ConditionKind } from "@/types/forecast.types";

interface SkyBackdropProps {
  /** Kondisi besok; menentukan efek cuaca di latar. Kosong = awan saja. */
  condition?: ConditionKind;
}

const SPRING = { stiffness: 45, damping: 18, mass: 0.6 };

/** Satu lapisan awan: bergeser ikut mouse (`depth` px) dan scroll (`scrollFactor`). */
function useLayerMotion(
  pointerX: MotionValue<number>,
  pointerY: MotionValue<number>,
  scrollY: MotionValue<number>,
  depth: number,
  scrollFactor: number,
) {
  const x = useTransform(pointerX, (value) => value * depth);
  const y = useTransform(
    [pointerY, scrollY],
    ([py, sy]: number[]) => py * depth * 0.6 - sy * scrollFactor,
  );
  return { x, y };
}

/**
 * Langit yang hidup tapi tenang:
 * - diam: awan bergeser sangat pelan (CSS `animate-drift`) + efek cuaca;
 * - mouse: awan dekat bergeser lebih jauh dari awan jauh (parallax);
 * - scroll: awan tertinggal sedikit dari konten, memberi kesan kedalaman.
 * Dengan `prefers-reduced-motion`, semuanya diam.
 */
export function SkyBackdrop({ condition }: SkyBackdropProps) {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, SPRING);
  const pointerY = useSpring(rawY, SPRING);
  const { scrollY } = useScroll();

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (event: PointerEvent) => {
      rawX.set(event.clientX / window.innerWidth - 0.5);
      rawY.set(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion, rawX, rawY]);

  const far = useLayerMotion(pointerX, pointerY, scrollY, -18, 0.08);
  const near = useLayerMotion(pointerX, pointerY, scrollY, -48, 0.2);
  const farStyle = reduceMotion ? undefined : far;
  const nearStyle = reduceMotion ? undefined : near;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <m.div style={farStyle} className="absolute inset-0">
        <div className="cloud-glow absolute top-10 -right-32 h-[380px] w-[640px] rounded-full opacity-80 motion-safe:animate-drift-reverse" />
        <div className="cloud-glow absolute top-[70%] -left-40 h-[320px] w-[560px] rounded-full opacity-50 motion-safe:animate-drift-reverse" />
      </m.div>
      <m.div style={nearStyle} className="absolute inset-0">
        <div className="cloud-glow absolute -top-32 -left-24 h-[360px] w-[560px] rounded-full motion-safe:animate-drift" />
        <div className="cloud-glow absolute top-64 left-1/3 h-[260px] w-[520px] rounded-full opacity-60 motion-safe:animate-drift" />
      </m.div>
      {condition && <WeatherAmbience kind={condition} />}
    </div>
  );
}
