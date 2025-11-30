export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center py-6 mt-12 border-t border-[var(--color-3)] bg-transparent">
      <span className="text-base text-[var(--color-4)] font-semibold">
        © {new Date().getFullYear()} CampusVault &mdash;{" "}
        <span className="text-white font-bold"></span>
      </span>
    </footer>
  );
}
