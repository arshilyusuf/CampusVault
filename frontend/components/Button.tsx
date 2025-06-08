export default function Button({
  children,
  onClick,
  buttonClassName = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  buttonClassName?: string;
}) {
  return (
    <div className={`relative w-fit h-fit ${buttonClassName}`}>
      <div
        className="absolute inset-0 translate-x-1 translate-y-1 w-full h-full rounded-[4px] bg-[var(--color-4)] border-b-4 border-r-4 border-[var(--color-2)] transition-all duration-200"
        aria-hidden="true"
      />
      <button
        className={`relative z-10 pt-[0.5rem] pb-[0.5rem] pr-[0.8rem] pl-[0.8rem] rounded-[4px] bg-[var(--color-4)] text-black transition-all duration-200 w-full
              hover:translate-x-1 hover:translate-y-1 hover:bg-green-100
            `}
        
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
}
