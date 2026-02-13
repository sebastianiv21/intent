"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, BarChart3, User } from "lucide-react";

const leftItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/transactions", label: "Activity", icon: List },
];

const rightItems = [
  { href: "/insights", label: "Stats", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-20 bg-background border-t border-border flex items-center justify-around px-4 md:hidden">
      {/* Left Items */}
      {leftItems.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${active ? "text-[#c97a5a]" : "text-muted-foreground"}`}
            aria-label={item.label}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase">{item.label}</span>
          </Link>
        );
      })}

      {/* Spacer for FAB */}
      <div className="w-14" />

      {/* Right Items */}
      {rightItems.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${active ? "text-[#c97a5a]" : "text-muted-foreground"}`}
            aria-label={item.label}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
