import React from "react";
import Link from "next/link";

const navItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Tools", href: "/admin/dashboard/tools" },
    { label: "Articles", href: "/admin/dashboard/articles" },
    { label: "Categories", href: "/admin/dashboard/categories" },
    { label: "Authors", href: "/admin/dashboard/authors" },
    { label: "Comparisons", href: "/admin/dashboard/comparisons" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }}
            className="flex"
        >
            {/* Sidebar */}
            <aside
                style={{
                    backgroundColor: "#111827",
                    borderRight: "1px solid #1f2937",
                    width: "240px",
                    flexShrink: 0,
                }}
                className="flex flex-col min-h-screen"
            >
                {/* Logo */}
                <div
                    style={{ borderBottom: "1px solid #1f2937" }}
                    className="px-6 py-5"
                >
                    <Link href="/admin/dashboard" className="text-white font-black text-lg">
                        ToolsAQ
                    </Link>
                    <p style={{ color: "#6b7280" }} className="text-xs mt-0.5">
                        Admin Panel
                    </p>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{ color: "#9ca3af" }}
                            className="block px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Bottom */}
                <div
                    style={{ borderTop: "1px solid #1f2937" }}
                    className="px-3 py-4 space-y-1"
                >
                    <Link
                        href="/"
                        target="_blank"
                        style={{ color: "#6b7280" }}
                        className="block px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        View Site
                    </Link>
                    <form action="/api/admin/logout" method="POST">
                        <button
                            type="submit"
                            style={{ color: "#6b7280" }}
                            className="w-full px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 hover:text-red-400 transition-colors"
                        >
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}