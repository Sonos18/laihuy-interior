import { animate as _animate, inView } from "motion";
import type { Ref } from "vue";

// Cast to the DOM animate signature to avoid framer-motion React overload conflicts
const animateDOM = _animate as (
  target: Element,
  keyframes: Record<string, unknown>,
  options?: { duration?: number; delay?: number; easing?: string },
) => { stop: () => void };

interface ScrollRevealOptions {
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  distance?: string;
}

const revealedRoutes = new Set<string>();

const transformMap = {
  up: (d: string) => `translateY(${d})`,
  down: (d: string) => `translateY(-${d})`,
  left: (d: string) => `translateX(${d})`,
  right: (d: string) => `translateX(-${d})`,
};

export function useScrollReveal(
  el: Ref<HTMLElement | null>,
  options: ScrollRevealOptions = {},
) {
  const {
    direction = "up",
    delay = 0,
    duration = 0.7,
    distance = "30px",
  } = options;

  const route = useRoute();
  let stopInView: (() => void) | null = null;

  onMounted(() => {
    if (!el.value) return;

    const routePath = route.path;
    const alreadyVisited = revealedRoutes.has(routePath);

    if (alreadyVisited) {
      el.value.style.opacity = "1";
      el.value.style.transform = "translate(0, 0)";
      return;
    }

    const initialTransform = transformMap[direction](distance);
    el.value.style.opacity = "0";
    el.value.style.transform = initialTransform;

    const target = el.value;

    stopInView = inView(
      target,
      () => {
        animateDOM(
          target,
          { opacity: [0, 1], transform: [initialTransform, "translate(0, 0)"] },
          { duration, delay: delay / 1000, easing: "ease-out" },
        );

        // One-shot: stop observing after first reveal
        stopInView?.();
        stopInView = null;
      },
      { margin: "0px 0px -40px 0px", amount: 0.1 },
    );
  });

  onBeforeUnmount(() => {
    revealedRoutes.add(route.path);
    stopInView?.();
    stopInView = null;
  });
}
