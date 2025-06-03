export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-fit h-fit">
      <div
        className="absolute inset-0 translate-x-1 translate-y-1 w-full h-full rounded-[4px] bg-[var(--color-4)] border-b-4 border-r-4 border-red-800 transition-all duration-200"
        aria-hidden="true"
      ></div>
      <button
        className={`relative z-10 pt-[0.5rem] pb-[0.5rem] pr-[0.8rem] pl-[0.8rem] rounded-[4px] bg-[var(--color-4)] text-black transition-all duration-200
              hover:translate-x-1 hover:translate-y-1 hover:bg-red-200
            `}
        style={{ minWidth: "120px" }}
      >
        {children}
      </button>
    </div>
  );
}
