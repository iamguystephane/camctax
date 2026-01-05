"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useState as useStates } from "@/hooks/useState";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import camctaxlogo from '../public/images/camctax logo.png';
import logo from '../public/images/logo.png';

const BASE_NAV_LINKS = [
  {
    label: "Home",
    href: "/"
  },
  {
    label: "Learning hub",
    href: "/learning",
  },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user.email;
  
  const isActive = (href: string) => {
    if (href === "/learning") {
      return pathname?.startsWith("/learning") || false;
    }
    if (href === "/consultant/dashboard" || href === "/admin/dashboard") {
      return pathname?.startsWith("/consultant") || pathname?.startsWith("/admin") || false;
    }
    return pathname === href;
  };

  // Build nav links based on auth state
  const getDashboardLink = () => {
    if (!isLoggedIn) return null;
    if (user.role === "consultant") {
      return { label: "Dashboard", href: "/consultant/dashboard" };
    }
    if (user.role === "admin" || user.role === "superadmin") {
      return { label: "Dashboard", href: "/admin/dashboard" };
    }
    return null;
  };

  const navLinks = [
    ...BASE_NAV_LINKS,
    ...(getDashboardLink() ? [getDashboardLink()!] : []),
    ...(!isLoggedIn ? [{ label: "Login", href: "/auth" }] : []),
  ];

   const { setOnboardingData } = useStates();
   const handleLeadSource = () => {
     setOnboardingData((prev) => ({
       ...prev,
       leadSource: {
         sourceDetail: `navigation_bar`,
       },
     }));
   };

   const handleLogout = async () => {
     setOpen(false);
     await logout();
   };

  return (
    <>
      {/* NAV BAR */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              <Image src={logo} alt="Tax Assistant" className="h-6 w-6" />
            </div>
            <div className="hidden md:block">
            <Image src={camctaxlogo} alt="Tax Assistant" className="h-22 w-22 md:h-7" />
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-4 items-center">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium py-2 transition-colors relative ${
                    active
                      ? "text-green-500 font-semibold"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-full w-7 mx-auto" />
                  )}
                </Link>
              );
            })}

            {isLoggedIn ? (
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            ) : (
              <Link href="/start" onClick={handleLeadSource}>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* MOBILE MODAL (always mounted for animation) */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Slide-in Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl p-6 flex flex-col
            transform transition-transform duration-300 ease-out
            ${open ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-bold text-lg">Menu</span>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`text-base font-medium transition ${
                    active
                      ? "text-primary font-semibold"
                      : "text-slate-700 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isLoggedIn ? (
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            ) : (
              <Link href="/start" onClick={() => setOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleLeadSource}>
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
