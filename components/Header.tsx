import Link from "next/link";

export default function Header() {
    return (
        <header style={{ backgroundColor: "#0a0a0a" }}>
            {/* Main nav */}
            <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    style={{ color: "#ffffff" }}
                    className="text-xl font-bold tracking-tight"
                >
                    ToolsAQ
                </Link>

                {/* Nav links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="/tools"
                        style={{ color: "#d1d5db" }}
                        className="text-sm hover:text-white transition-colors"
                    >
                        Tools
                    </Link>
                    <Link
                        href="/compare/all"
                        style={{ color: "#d1d5db" }}
                        className="text-sm hover:text-white transition-colors"
                    >
                        Comparisons
                    </Link>
                    <Link
                        href="/category"
                        style={{ color: "#d1d5db" }}
                        className="text-sm hover:text-white transition-colors"
                    >
                        Categories
                    </Link>
                    <Link
                        href="/blog"
                        style={{ color: "#d1d5db" }}
                        className="text-sm hover:text-white transition-colors"
                    >
                        Blog
                    </Link>
                </div>

                {/* Get Listed CTA */}
                <Link
                    href="/contact"
                    style={{
                        backgroundColor: "#ffffff",
                        color: "#0a0a0a",
                    }}
                    className="text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                    Get Listed
                </Link>
            </nav>
        </header>
    );
}