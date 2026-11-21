import type { Transition, Variants } from "motion/react";

const EASE_OUT: Transition["ease"] = [0.22, 1, 0.36, 1];

/** Kontainer daftar: anak-anaknya muncul berurutan. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/** Muncul sambil naik sedikit. Dimatikan otomatis oleh `MotionConfig reducedMotion="user"`. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

/** Batang yang tumbuh dari kiri (pakai `origin-left`). Mewarisi state dari induk. */
export const growX: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.8, ease: EASE_OUT, delay: 0.15 } },
};

/** Muncul saat elemen masuk layar saat scroll, sekali saja. */
export const revealOnScroll = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.2 },
} as const;
