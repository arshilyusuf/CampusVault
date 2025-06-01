import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-6 text-white">
      <div className="text-[2.5rem] font-[900]">CampusVault</div>
      <div className="flex space-x-10">
        <Link href="/login" className="hover:text-[var(--color-4)] transition-colors">
          Login
        </Link>
        <Link href="/vault" className="hover:text-[var(--color-4)] transition-colors">
          Vault
        </Link>
        <Link href="/feedback" className="hover:text-[var(--color-4)] transition-colors">
          Feedback
        </Link>
        <Link href="/request" className="hover:text-[var(--color-4)] transition-colors">
          Request
        </Link>
      </div>
    </nav>
  );
}
