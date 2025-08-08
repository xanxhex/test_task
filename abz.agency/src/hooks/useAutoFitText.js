
import { useLayoutEffect } from "react";

export default function useAutoFitText(ref, {
  max = 16, min = 12, step = 1, maxLines = 2, deps = [],
} = {}) {
  const fit = () => {
    const el = ref?.current;
    if (!el) return;

    
    el.style.fontSize = `${max}px`;

    
    const cs = getComputedStyle(el);
    const lineHeight = parseFloat(cs.lineHeight) || max * 1.2;
    const maxHeight = lineHeight * maxLines;
    el.style.maxHeight = `${maxHeight}px`;
    el.style.overflow = "hidden";

    let size = max;
    
    while (el.scrollHeight > el.clientHeight && size > min) {
      size -= step;
      el.style.fontSize = `${size}px`;
    }
  };

  useLayoutEffect(() => {
    fit();
    const onResize = () => fit();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    
  }, [ref, max, min, step, maxLines, ...deps]);
}
