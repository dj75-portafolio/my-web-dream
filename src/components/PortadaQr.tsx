import { QRCodeSVG } from "qrcode.react";

type Props = {
  url: string;
};

export default function PortadaQr({ url }: Props) {
  return (
    <QRCodeSVG
      value={url}
      level="M"
      bgColor="#ffffff"
      fgColor="#000000"
      className="h-full w-full"
    />
  );
}
