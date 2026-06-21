import { Pencil } from "lucide-react";
import { useTypewriterProgress } from "@/hooks/useTypewriterProgress";

type Props = {
  text: string;
  showPencil?: boolean;
};

export default function TypewriterText({ text, showPencil = true }: Props) {
  const { visible, done, progress } = useTypewriterProgress(text.length);

  return (
    <span className="relative inline-flex max-w-full items-center">
      <span className="relative inline-block max-w-full align-bottom">
        <span className="invisible whitespace-nowrap" aria-hidden="true">
          {text}
        </span>
        <span
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${progress * 100}%` }}
        >
          <span className="whitespace-nowrap">{text}</span>
        </span>
      </span>
      {showPencil && !done && visible > 0 && (
        <Pencil
          className="ml-1 shrink-0 text-portafolio opacity-90"
          style={{
            width: "0.85em",
            height: "0.85em",
            transform: "rotate(12deg)",
          }}
          strokeWidth={2.2}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
