'use client';
import Link from "next/link";
import { BookTextIcon } from "./ui/book-text";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between p-6 text-white">
      <Link href="/" className="text-[2rem] font-[900] flex gap-2 items-center">
        <BookTextIcon /> CampusVault
      </Link>
      <div className="flex space-x-10">
        {!isAuthenticated ? (
          <Link
            href="/login"
            className="hover:text-[var(--color-4)] transition-colors"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={logout}
            className="hover:text-[var(--color-4)] transition-colors"
          >
            Logout
          </button>
        )}
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
