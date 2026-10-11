"use client";

interface ToolIconProps {
  toolKey: string;
  color?: string;
  className?: string;
}

export default function ToolIcon({ toolKey, color, className }: ToolIconProps) {
  const iconColor = color || "currentColor";

  const icons: Record<string, React.ReactNode> = {
    figma: (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M8 24a4 4 0 0 0 4-4v-4H8a4 4 0 0 0 0 8z" fill="#0ACF83" />
        <path d="M4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z" fill="#A259FF" />
        <path d="M4 4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z" fill="#F24E1E" />
        <path d="M12 0h4a4 4 0 0 1 0 8h-4V0z" fill="#FF7262" />
        <path d="M20 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" fill="#1ABCFE" />
      </svg>
    ),

    photoshop: (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#001E36" />
        <rect x="1" y="1" width="22" height="22" rx="3.5" fill="#31A8FF" />
        <text
          x="12"
          y="17"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize="11"
          fontWeight="bold"
          fill="#001E36"
        >
          Ps
        </text>
      </svg>
    ),

    illustrator: (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#330000" />
        <rect x="1" y="1" width="22" height="22" rx="3.5" fill="#FF9A00" />
        <text
          x="12"
          y="17"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize="11"
          fontWeight="bold"
          fill="#330000"
        >
          Ai
        </text>
      </svg>
    ),

    xd: (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#470137" />
        <rect x="1" y="1" width="22" height="22" rx="3.5" fill="#FF61F6" />
        <text
          x="12"
          y="17"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize="11"
          fontWeight="bold"
          fill="#470137"
        >
          Xd
        </text>
      </svg>
    ),

    framer: (
      <svg viewBox="0 0 24 24" className={className}>
        <path d="M4 0h16v8h-8z" fill="#0055FF" />
        <path d="M4 8h8l8 8H4z" fill="#0055FF" />
        <path d="M4 16h8v8z" fill="#0055FF" />
      </svg>
    ),

    sketch: (
      <svg viewBox="0 0 24 24" className={className}>
        <path d="M12 0 2 8l10 16L22 8z" fill="#FDB300" />
        <path d="M12 0 2 8h20z" fill="#EA6C00" />
        <path d="M7 8l5 16 5-16z" fill="#FDAD00" />
        <path d="M2 8l5 0 5-8z" fill="#FDD231" />
        <path d="M22 8l-5 0-5-8z" fill="#FDD231" />
        <path d="M7 8H2l5 16z" fill="#FDAD00" />
        <path d="M17 8h5l-5 16z" fill="#FDAD00" />
      </svg>
    ),

    blender: (
      <svg viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="11" fill="#E87D0D" />
        <circle cx="12" cy="12" r="6" fill="#FFFFFF" />
        <circle cx="12" cy="12" r="3" fill="#E87D0D" />
        <path d="M12 4v2M4 12h2M12 18v2M18 12h2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),

    notion: (
      <svg viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill={iconColor} />
        <path
          d="M6 18V6h2.5l5 8V6H16v12h-2.5l-5-8v8H6z"
          fill={iconColor === "#FFFFFF" || iconColor === "#ffffff" ? "#000000" : "#FFFFFF"}
        />
      </svg>
    ),
  };

  return <>{icons[toolKey] || <span className="text-xl">?</span>}</>;
}