import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

const SIGNATURE = "ARQ. DANIEL JAIMES";
const CHAR_MS = 78;

/** Zona del nombre (medida sobre portada.jpg 768×1376) */
const SIGNATURE_BOX = {
  left: "87.6%",
  top: "22%",
  width: "6.8%",
  height: "54.5%",
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

  const progress = visible / SIGNATURE.length;
  const chars = SIGNATURE.split("");

  return (
    <div
      data-portada-signature
      className="absolute z-[5] pointer-events-none"
      style={{
        left: SIGNATURE_BOX.left,
        top: SIGNATURE_BOX.top,
        width: SIGNATURE_BOX.width,
        height: SIGNATURE_BOX.height,
      }}
      aria-hidden="true"
    >
      <div className="relative h-full w-full">
        <div
          className="absolute bottom-0 left-0 right-0 overflow-hidden"
          style={{ height: `${progress * 100}%` }}
        >
          <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col-reverse items-center gap-[0.34em] portada-signature-text">
            {chars.map((char, i) => (
              <span key={i} className="block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        </div>

        {!done && visible > 0 && (
          <Pencil
            className="absolute left-1/2 portada-signature-pencil -translate-x-1/2 text-portafolio opacity-90"
            style={{
              bottom: `calc(${progress * 100}% + 2px)`,
              transform: "translateX(-50%) rotate(-18deg)",
            }}
            strokeWidth={2.2}
          />
        )}
      </div>
    </div>
  );
}
