import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

const SIGNATURE = "ARQ. DANIEL JAIMES";
/** ms por carácter: fluido, ~1.6 s en total */
const CHAR_MS = 78;

export default function PortadaSignature() {
  const [visible, setVisible] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let count = 0;
    let cancelled = false;
    let timeoutId = 0;

    const tick = () => {
      if (cancelled) return;
      count += 1;
      setVisible(count);
      if (count >= SIGNATURE.length) {
        setDone(true);
        return;
      }
      timeoutId = window.setTimeout(tick, CHAR_MS);
    };

    timeoutId = window.setTimeout(tick, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className="absolute z-[5] pointer-events-none overflow-hidden bg-black"
      style={{
        right: "4.2%",
        top: "27%",
        height: "46%",
        width: "9%",
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex items-center gap-1 text-portafolio font-semibold uppercase whitespace-nowrap"
          style={{
            transform: "rotate(-90deg)",
            fontSize: "clamp(10px, 2.4vw, 13px)",
            letterSpacing: "0.32em",
          }}
        >
          <span>{SIGNATURE.slice(0, visible)}</span>
          {!done && (
            <Pencil
              className="shrink-0 text-portafolio opacity-90"
              style={{
                width: "0.85em",
                height: "0.85em",
                transform: "rotate(12deg)",
              }}
              strokeWidth={2.2}
            />
          )}
        </div>
      </div>
    </div>
  );
}
