import nameStrip from "@/assets/portada-name.webp";

/** Zona exacta del nombre en portada.jpg (768×1376, medida sobre original 9am) */
const SIGNATURE_BOX = {
  left: "86.59%",
  top: "9.45%",
  width: "9.11%",
  height: "82.85%",
} as const;

export default function PortadaSignature() {
  return (
    <div
      data-portada-signature
      className="absolute z-[5] pointer-events-none overflow-hidden bg-black"
      style={SIGNATURE_BOX}
      aria-hidden="true"
    >
      <img
        src={nameStrip}
        alt=""
        className="absolute bottom-0 left-0 h-full w-full object-contain object-bottom"
        draggable={false}
        decoding="async"
      />
    </div>
  );
}
