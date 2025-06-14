"use client";
import Link from "next/link";
import { BookTextIcon } from "./ui/book-text";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
      toast.success("Logout successful!");
    } catch (error) {
      console.error("Logout error:", error);
    }}
    return (
      <nav className="flex items-center justify-between p-6 text-white">
        <Link
          href="/"
          className="text-[2rem] font-[900] flex gap-2 items-center"
        >
          <BookTextIcon size={35} />
          <div className="flex flex-col text-m leading-7">
            <p>Campus</p>
            <p>Vault</p>
          </div>
        </Link>
        <div className="flex space-x-10">
          {!isAuthenticated ? (
            <Link
              href="/login"
              className="hover:text-[var(--color-3)] transition-colors"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="hover:text-[var(--color-3)] transition-colors"
            >
              Logout
            </button>
          )}
          <Link
            href="/vault"
            className="hover:text-[var(--color-3)] transition-colors"
          >
            Vault
          </Link>
          <Link
            href="/feedback"
            className="hover:text-[var(--color-3)] transition-colors"
          >
            Feedback
          </Link>
          <Link
            href="/contribute"
            className="hover:text-[var(--color-3)] transition-colors"
          >
            Contribute
          </Link>
          {user?.role==="admin" && (
            <Link
              href="/admin"
              className="hover:text-[var(--color-3)] transition-colors"
            >
              Panel
            </Link>
          )}
        </div>
      </nav>
    );
  };

