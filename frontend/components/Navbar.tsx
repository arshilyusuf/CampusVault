"use client";
import Link from "next/link";
import { BookTextIcon } from "./ui/book-text";
import { useAuth } from "@/context/AuthContext";
import { FilePenLineIcon } from "./ui/file-pen-line";
import { LayoutPanelTopIcon } from "./ui/layout-panel-top";
import { ArchiveIcon } from "./ui/archive";
import { IdCardIcon } from "./ui/id-card";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();

  // Tooltip state for each icon
  const [showVaultTooltip, setShowVaultTooltip] = useState(false);
  const [showContributeTooltip, setShowContributeTooltip] = useState(false);
  const [showAdminTooltip, setShowAdminTooltip] = useState(false);
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-7 text-white">
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
      <div className="flex space-x-10 px-6 py-3 bg-[var(--color-3)]/5 backdrop-blur-3xl rounded-full">
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
                transition={{ duration: 0.10, ease: "easeOut" }}
                className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-50 border-[var(--color-3)] border-[1px]"
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
                transition={{ duration: 0.10, ease: "easeOut" }}
                className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-50 border-[var(--color-3)] border-[1px]"
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
                  transition={{ duration: 0.10, ease: "easeOut" }}
                  className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-50 border-[var(--color-3)] border-[1px] whitespace-nowrap"
                >
                  Admin Panel
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        {/* Login/Profile Icon */}
        {!isAuthenticated ? (
          <Link
            href="/login"
            className="hover:text-[var(--color-3)] transition-colors"
          >
            Login
          </Link>
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
                  transition={{ duration: 0.10, ease: "easeOut" }}
                  className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded z-50 border-[var(--color-3)] border-[1px]"
                >
                  Profile
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
}

