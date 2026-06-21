import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

const SIGNATURE = "ARQ. DANIEL JAIMES";
const CHAR_MS = 78;

/** Zona exacta del nombre en portada.jpg (768×1376, medida sobre original) */
const SIGNATURE_BOX = {
  left: "86%",
  top: "16%",
  width: "9%",
  height: "62%",
} as const;

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
      data-portada-signature
      className="absolute z-[5] pointer-events-none overflow-hidden bg-black"
      style={SIGNATURE_BOX}
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex items-center gap-1 font-semibold uppercase whitespace-nowrap"
          style={{
            transform: "rotate(-90deg)",
            color: "#5e5e5e",
            fontSize: "clamp(24px, 5.2cqi, 42px)",
            letterSpacing: "0.32em",
          }}
        >
          <span>{SIGNATURE.slice(0, visible)}</span>
          {!done && (
            <Pencil
              className="shrink-0 opacity-90"
              style={{
                width: "0.85em",
                height: "0.85em",
                color: "#5e5e5e",
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
