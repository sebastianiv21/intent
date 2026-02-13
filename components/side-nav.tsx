"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ArrowUpRight, PieChart, Sparkles, Leaf, Flame } from "lucide-react";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/transactions", label: "Transactions", icon: ArrowUpRight },
  { href: "/budgets", label: "Budgets", icon: PieChart },
  { href: "/insights", label: "Insights", icon: Sparkles },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-24 lg:w-64 flex-col items-center lg:items-start border-r border-border bg-card/40 py-8 px-4 gap-12 md:flex">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c97a5a] to-[#a36248] flex items-center justify-center text-white shadow-lg">
          <Leaf className="w-5 h-5" />
        </div>
        <span className="hidden lg:block font-bold text-xl tracking-tight text-foreground">Intent</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 w-full">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                active
                  ? "bg-border text-[#c97a5a]"
                  : "text-muted-foreground hover:bg-border/60 hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden lg:block font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto w-full px-2">
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c97a5a] to-[#a36248] flex items-center justify-center text-white text-sm font-bold">
            FA
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-foreground">Felix Arvid</p>
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground">Zen Level 12</p>
              <Flame className="w-3 h-3 text-[#c97a5a]" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
