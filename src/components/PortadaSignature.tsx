import nameStrip from "@/assets/portada-name.webp";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

const SIGNATURE = "ARQ. DANIEL JAIMES";
/** +1.3% sobre 160ms / 38ms por carácter */
const SPEED_FACTOR = 1.013;
const START_MS = Math.round(160 / SPEED_FACTOR);
const charMs = (step: number) => (step % 2 === 1 ? 37 : 38);

/** Zona exacta del nombre en portada.jpg (768×1376, medida sobre original 9am) */
const SIGNATURE_BOX = {
  left: "86.59%",
  top: "9.45%",
  width: "9.11%",
  height: "82.85%",
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
      timeoutId = window.setTimeout(tick, charMs(count));
    };

    timeoutId = window.setTimeout(tick, START_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  const progress = visible / SIGNATURE.length;

  return (
    <div
      data-portada-signature
      className="absolute z-[5] pointer-events-none overflow-hidden bg-black"
      style={SIGNATURE_BOX}
      aria-hidden="true"
    >
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden"
        style={{ height: `${progress * 100}%` }}
      >
        <img
          src={nameStrip}
          alt=""
          className="absolute bottom-0 left-0 h-full w-full object-contain object-bottom"
          draggable={false}
        />
      </div>

      {!done && visible > 0 && (
        <Pencil
          className="absolute left-1/2 opacity-90 text-[#5e5e5e]"
          style={{
            bottom: `calc(${progress * 100}% + 2px)`,
            width: "0.55em",
            height: "0.55em",
            fontSize: "clamp(28px, 6cqi, 52px)",
            transform: "translateX(-50%) rotate(-18deg)",
          }}
          strokeWidth={2.2}
        />
      )}
    </div>
  );
}
