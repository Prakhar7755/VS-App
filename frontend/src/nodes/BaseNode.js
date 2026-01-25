import { Handle } from "reactflow";

const VARIANT_STYLES = {
  input: {
    border: "border-l-[3px] border-emerald-400",
    glow: "shadow-[0_0_0_1px_rgba(52,211,153,0.15)]",
    accent: "text-emerald-300",
  },
  output: {
    border: "border-l-[3px] border-rose-400",
    glow: "shadow-[0_0_0_1px_rgba(251,113,133,0.15)]",
    accent: "text-rose-300",
  },
  text: {
    border: "border-l-[3px] border-sky-400",
    glow: "shadow-[0_0_0_1px_rgba(56,189,248,0.15)]",
    accent: "text-sky-300",
  },
  llm: {
    border: "border-l-[3px] border-violet-400",
    glow: "shadow-[0_0_0_1px_rgba(167,139,250,0.15)]",
    accent: "text-violet-300",
  },
};

export const BaseNode = ({ title, variant, children, handles = [] }) => {
  const styles = VARIANT_STYLES[variant] ?? VARIANT_STYLES.text;

  return (
    <div
      className={`
    w-60 rounded-xl
    bg-white/5 backdrop-blur-md
    border border-white/10
    ${styles.border} ${styles.glow}
    shadow-lg
    transition-all duration-200
    hover:translate-y-[-1px]
    hover:shadow-xl
    text-gray-100
  `}
    >
      {/* REACT FLOW KE HANDLES */}
      {handles.map((h) => (
        <Handle
          key={h.id}
          id={h.id}
          type={h.type}
          position={h.position}
          style={{
            width: 12,
            height: 12,
            background: "#6366f1",
            border: "2px solid white",
            ...h.style,
          }}
        />
      ))}

      {/* HEADER */}
      <div
        className={`
    px-3 py-2
    text-xs font-semibold
    tracking-wide
    border-b border-white/10
    ${styles.accent}
  `}
      >
        {title}
      </div>

      {/* BODY */}
      <div className="px-3 py-2.5 flex flex-col gap-2 text-xs text-gray-700">
        {children}
      </div>
    </div>
  );
};
