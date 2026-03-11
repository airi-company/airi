"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/agents", label: "Agents" },
  { href: "/tasks", label: "Tasks" },
  { href: "/logs", label: "Logs" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="sidebar">
      <div className="mb-4 text-lg font-semibold">Airi Company</div>
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
