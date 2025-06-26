"use client";
import Link from "next/link";
import { BookTextIcon } from "./ui/book-text";
import { useAuth } from "@/context/AuthContext";
import { FilePenLineIcon } from "./ui/file-pen-line";
import { LayoutPanelTopIcon } from "./ui/layout-panel-top";
import { ArchiveIcon } from "./ui/archive";
import { IdCardIcon } from "./ui/id-card";
import { UserIcon } from "./ui/user";
import { Menu, X } from "lucide-react"; // NEW
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();

  // Tooltip states remain unchanged...
  const [showVaultTooltip, setShowVaultTooltip] = useState(false);
  const [showContributeTooltip, setShowContributeTooltip] = useState(false);
  const [showAdminTooltip, setShowAdminTooltip] = useState(false);
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);
  const [showLoginTooltip, setShowLoginTooltip] = useState(false);

  // 💡 New: Toggle mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Vault", href: "/vault", icon: <ArchiveIcon size={24} /> },
    {
      label: "Contribute",
      href: "/contribute",
      icon: <FilePenLineIcon size={24} />,
    },
    ...(user?.role === "admin"
      ? [
          {
            label: "Admin Panel",
            href: "/admin",
            icon: <LayoutPanelTopIcon size={24} />,
          },
        ]
      : []),
    !isAuthenticated
      ? { label: "Login", href: "/login", icon: <UserIcon size={24} /> }
      : { label: "Profile", href: "/profile", icon: <IdCardIcon size={24} /> },
  ];

  return (
    <>
      {/* 🧱 Sticky container */}
      <div className="sticky sm:relative top-0 z-50 sm:bg-transparent sm:backdrop-blur-none bg-black/60 backdrop-blur-lg">
        <nav className="flex items-center justify-between px-6 py-7 text-white">
          {/* Logo */}
          <Link
            href="/"
            className="sm:text-[2rem] font-[900] flex gap-2 items-center"
          >
            <BookTextIcon size={35} />
            <div className="flex flex-col sm:text-m sm:leading-7">
              <p>Campus</p>
              <p>Vault</p>
            </div>
          </Link>

          {/* 💻 Desktop-only icons */}
          <div className="hidden sm:flex space-x-10 px-6 py-3 bg-[var(--color-3)]/5 backdrop-blur-3xl rounded-full">
            {/* Vault Icon */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowVaultTooltip(true)}
              onMouseLeave={() => setShowVaultTooltip(false)}
            >
              <Link
                href="/vault"
                className="hover:text-[var(--color-3)] transition-colors"
              >
                <ArchiveIcon size={30} />
              </Link>
              <AnimatePresence>
                {showVaultTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-50 border-[var(--color-3)] border"
                  >
                    Vault
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contribute Icon */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowContributeTooltip(true)}
              onMouseLeave={() => setShowContributeTooltip(false)}
            >
              <Link
                href="/contribute"
                className="hover:text-[var(--color-3)] transition-colors"
              >
                <FilePenLineIcon size={30} />
              </Link>
              <AnimatePresence>
                {showContributeTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-50 border-[var(--color-3)] border"
                  >
                    Contribute
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Icon */}
            {user?.role === "admin" && (
              <div
                className="relative flex items-center"
                onMouseEnter={() => setShowAdminTooltip(true)}
                onMouseLeave={() => setShowAdminTooltip(false)}
              >
                <Link
                  href="/admin"
                  className="hover:text-[var(--color-3)] transition-colors"
                >
                  <LayoutPanelTopIcon size={30} />
                </Link>
                <AnimatePresence>
                  {showAdminTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-50 border-[var(--color-3)] border whitespace-nowrap"
                    >
                      Admin Panel
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Profile/Login Icon */}
            {!isAuthenticated ? (
              <div
                className="relative flex items-center"
                onMouseEnter={() => setShowLoginTooltip(true)}
                onMouseLeave={() => setShowLoginTooltip(false)}
              >
                <Link
                  href="/login"
                  className="hover:text-[var(--color-3)] transition-colors"
                >
                  <UserIcon size={30} />
                </Link>
                <AnimatePresence>
                  {showLoginTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-50 border-[var(--color-3)] border"
                    >
                      Login
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div
                className="relative flex items-center"
                onMouseEnter={() => setShowProfileTooltip(true)}
                onMouseLeave={() => setShowProfileTooltip(false)}
              >
                <Link
                  href="/profile"
                  className="hover:text-[var(--color-3)] transition-colors"
                >
                  <IdCardIcon size={30} />
                </Link>
                <AnimatePresence>
                  {showProfileTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-50 border-[var(--color-3)] border"
                    >
                      Profile
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* 📱 Mobile Hamburger */}
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </nav>
      </div>

      {/* 🧭 Mobile Slide-out menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed top-0 right-0 w-64 h-screen bg-black text-white p-6 z-[999] shadow-xl flex flex-col sm:hidden"
          >
            {/* 🧭 Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-[var(--color-3)] border-b-2 border-b-[var(--color-3)]">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* 🔗 Navigation Items */}
            <div className="flex flex-col gap-5 mt-9">
              {navItems.map(({ label, href, icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 text-xl hover:text-[var(--color-3)] transition"
                >
                  {icon}
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
