import type { SpeciesId } from "@/lib/colors";

type Props = {
  id: SpeciesId;
  className?: string;
};

export function SpeciesIcon({ id, className }: Props) {
  const wrap = {
    viewBox: "0 0 40 40",
    className,
    "aria-hidden": true as const,
  };

  switch (id) {
    case "kiefer":
      return (
        <svg {...wrap}>
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7">
            <path d="M20 36 L14 8" />
            <path d="M18 12 L8 6 M18 12 L11 4 M17 16 L6 12 M17 16 L9 10 M17 20 L7 18 M16 24 L8 23" />
            <path d="M16 11 L26 5 M16 11 L24 8 M16 16 L28 11 M16 16 L27 15 M16 21 L26 18 M16 25 L24 24" />
          </g>
        </svg>
      );
    case "fichte":
      return (
        <svg {...wrap}>
          <g fill="currentColor">
            <path d="M20 6 L10 16 H30 Z" opacity="0.95" />
            <path d="M20 12 L8 24 H32 Z" opacity="0.9" />
            <path d="M20 20 L11 32 H29 Z" />
          </g>
          <path d="M20 34 V22" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "buche":
      return (
        <svg {...wrap}>
          <path
            fill="currentColor"
            d="M20 5 C12 8 8 16 11 24 C13 29 17 33 20 35 C23 33 27 29 29 24 C32 16 28 8 20 5 Z"
          />
          <path d="M20 8 V34" stroke="#5C3A12" strokeWidth="1.1" opacity="0.35" />
        </svg>
      );
    case "eiche":
      return (
        <svg {...wrap}>
          <path
            fill="currentColor"
            d="M20 7 C16 7 14 10 15 13 C11 13 10 17 13 18 C11 21 13 24 16 23 C16 27 19 29 20 33 C21 29 24 27 24 23 C27 24 29 21 27 18 C30 17 29 13 25 13 C26 10 24 7 20 7 Z"
          />
        </svg>
      );
    case "birke":
      return (
        <svg {...wrap}>
          <path d="M18 36 V8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path
            fill="currentColor"
            d="M20 10 C24 12 28 18 26 24 C24 22 22 18 20 16 Z M21 16 C26 19 29 26 26 32 C23 28 22 22 21 20 Z"
            opacity="0.9"
          />
        </svg>
      );
    case "tanne":
      return (
        <svg {...wrap}>
          <g fill="currentColor">
            <path d="M20 5 L11 15 H29 Z" />
            <path d="M20 11 L9 22 H31 Z" opacity="0.9" />
            <path d="M20 18 L11 30 H29 Z" opacity="0.85" />
          </g>
        </svg>
      );
    case "douglasie":
      return (
        <svg {...wrap}>
          <g fill="currentColor">
            <path d="M22 6 L8 22 H20 L12 32 H28 L22 22 H32 Z" />
            <ellipse cx="16" cy="30" rx="2.2" ry="3.4" opacity="0.85" />
            <ellipse cx="20" cy="33" rx="2.2" ry="3.6" opacity="0.85" />
          </g>
        </svg>
      );
  }
}
