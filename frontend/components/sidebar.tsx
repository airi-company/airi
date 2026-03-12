"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/agents", label: "Agents" },
  { href: "/tasks", label: "Tasks" },
  { href: "/logs", label: "Logs" },
  { href: "/demo", label: "Demo" },
  { href: "/games", label: "Games" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="sidebar space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Airi Company</div>
        <ThemeToggle />
      </div>
      <nav className="space-y-1">
        {nav.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "active" : ""}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
