export default function Button({
  children,
  onClick= () => {},
  buttonClassName = "",
  disabled = false,
  type = "button",
  backgroundColor = "var(--color-3)",
}: {
  children: React.ReactNode;
  onClick: () => void;
  buttonClassName?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  backgroundColor?: string;
}) {
  // Utility to get a very light version of the backgroundColor
  function getLightColor(color: string) {
    if (color.startsWith("var(")) {
      return "rgba(255,255,255,0.7)";
    }
    if (color.startsWith("#")) {
      let c = color.substring(1);
      if (c.length === 3) c = c.split("").map((x) => x + x).join("");
      const num = parseInt(c, 16);
      const r = Math.min(255, ((num >> 16) & 0xff) + 180);
      const g = Math.min(255, ((num >> 8) & 0xff) + 180);
      const b = Math.min(255, (num & 0xff) + 180);
      return `rgb(${r},${g},${b})`;
    }
    if (color.startsWith("rgb")) {
      const nums = color.match(/\d+/g)?.map(Number) || [255,255,255];
      return `rgba(${nums[0]},${nums[1]},${nums[2]},0.2)`;
    }
    return "rgba(255,255,255,0.7)";
  }
  const lightBg = getLightColor(backgroundColor);

  return (
    <div className={`relative w-fit h-fit ${buttonClassName}`}>
      <div
        className={`absolute inset-0 translate-x-1 translate-y-1 w-full h-full rounded-[4px]`}
        style={{ background: "var(--color-4)", borderBottom: `4px solid ${backgroundColor}`, borderRight: `4px solid ${backgroundColor}` }}
        aria-hidden="true"
      />
      <button
        className={`relative z-10 pt-[0.5rem] pb-[0.5rem] pr-[0.8rem] pl-[0.8rem] rounded-[4px] bg-[var(--color-4)] text-black transition-all duration-200 w-full
              hover:translate-x-1 hover:translate-y-1
              ${disabled ? "opacity-50 cursor-not-allowed translate-x-1 translate-y-1" : ""}`}
        onClick={onClick}
        disabled={disabled}
        type={type}
        style={{ background: "var(--color-4)" }}
        onMouseEnter={e => {
          if (!disabled) (e.currentTarget as HTMLElement).style.background = lightBg;
        }}
        onMouseLeave={e => {
          if (!disabled) (e.currentTarget as HTMLElement).style.background = "var(--color-4)";
        }}
      >
        {children}
      </button>
    </div>
  );
}
