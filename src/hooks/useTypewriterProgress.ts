import { useEffect, useState } from "react";
import { TYPEWRITER_START_MS, typewriterCharMs } from "@/lib/typewriter-timing";

export function useTypewriterProgress(length: number) {
  const [visible, setVisible] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (length <= 0) return;

    let count = 0;
    let cancelled = false;
    let timeoutId = 0;

    const tick = () => {
      if (cancelled) return;
      count += 1;
      setVisible(count);
      if (count >= length) {
        setDone(true);
        return;
      }
      timeoutId = window.setTimeout(tick, typewriterCharMs(count));
    };

    timeoutId = window.setTimeout(tick, TYPEWRITER_START_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [length]);

  return {
    visible,
    done,
    progress: length > 0 ? visible / length : 1,
  };
}
