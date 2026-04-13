import React from "react";

interface Props {
  size?: number;
  fillColor?: string; // cor de preenchimento do pin
  holeColor?: string; // cor do círculo interno (o "buraco")
}

export const MapPinCustomIcon: React.FC<Props> = ({
  size = 24,
  fillColor = "#FAA75C",
  holeColor = "white",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
    >
      {/* Forma externa do pin (preenchido com a cor desejada) */}
      <path
        d="M12 21.75s7.5-6.5 7.5-11.25A7.5 7.5 0 0012 3a7.5 7.5 0 00-7.5 7.5C4.5 15.25 12 21.75 12 21.75z"
        fill={fillColor}
      />
      {/* Círculo interno "vazado" (branco ou outra cor) */}
      <circle cx="12" cy="10.5" r="2.25" fill={holeColor} />
    </svg>
  );
};
