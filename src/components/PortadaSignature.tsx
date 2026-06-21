import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

const SIGNATURE = "ARQ. DANIEL JAIMES";
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

  const chars = SIGNATURE.slice(0, visible).split("");

  return (
    <div
      data-portada-signature
      className="absolute z-[5] pointer-events-none bg-black"
      style={{
        right: "1.2%",
        top: "25.5%",
        height: "49%",
        width: "12%",
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col-reverse items-center gap-[0.22em] text-portafolio font-semibold uppercase leading-none portada-signature-text">
          {chars.map((char, i) => (
            <span key={`${i}-${char}`} className="block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
          {!done && visible > 0 && (
            <Pencil
              className="shrink-0 text-portafolio opacity-90 portada-signature-pencil"
              strokeWidth={2.2}
            />
          )}
        </div>
      </div>
    </div>
  );
}
