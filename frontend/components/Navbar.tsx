import Link from "next/link";
import { BookTextIcon } from "./ui/book-text";
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-6 text-white">
      <Link href="/" className="text-[2rem] font-[900] flex gap-2 items-center">
        <BookTextIcon /> CampusVault
      </Link>
      <div className="flex space-x-10">
        <Link
          href="/login"
          className="hover:text-[var(--color-4)] transition-colors"
        >
          Login
        </Link>
        <Link
          href="/vault"
          className="hover:text-[var(--color-4)] transition-colors"
        >
          Vault
        </Link>
        <Link
          href="/feedback"
          className="hover:text-[var(--color-4)] transition-colors"
        >
          Feedback
        </Link>
        <Link
          href="/request"
          className="hover:text-[var(--color-4)] transition-colors"
        >
          Request
        </Link>
      </div>
    </nav>
  );
}
