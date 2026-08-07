import Link from "next/link";

export default function Footer() {
    return (
        <footer style={{ backgroundColor: "#0a0a0a", color: "#ffffff" }}>
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Top section */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="text-xl font-bold text-white">
                            ToolsAQ
                        </Link>
                        <p style={{ color: "#9ca3af" }} className="text-sm mt-3 max-w-xs leading-relaxed">
                            ToolsAQ helps you discover the best AI and developer tools.
                            Compare options, read honest reviews, and make smarter decisions.
                        </p>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Categories</h4>
                        <ul className="space-y-2">
                            {[
                                { label: "AI Tools", href: "/category/ai-tools" },
                                { label: "Dev Tools", href: "/category/dev-tools" },
                                { label: "No-Code Tools", href: "/category/no-code" },
                                { label: "SEO Tools", href: "/category/seo-tools" },
                            ].map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        style={{ color: "#9ca3af" }}
                                        className="text-sm hover:text-white transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Topics */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Topics</h4>
                        <ul className="space-y-2">
                            {[
                                { label: "Software Reviews", href: "/blog" },
                                { label: "Alternatives", href: "/blog" },
                                { label: "Guides & Tutorials", href: "/blog" },
                                { label: "Comparisons", href: "/compare/all" },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        style={{ color: "#9ca3af" }}
                                        className="text-sm hover:text-white transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-2">
                            {[
                                { label: "About Us", href: "/about" },
                                { label: "Write for Us", href: "/write-for-us" },
                                { label: "Contact Us", href: "/contact" },
                            ].map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        style={{ color: "#9ca3af" }}
                                        className="text-sm hover:text-white transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ borderColor: "#1f2937" }} className="border-t pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p style={{ color: "#6b7280" }} className="text-xs">
                            © {new Date().getFullYear()} ToolsAQ. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            {[
                                { label: "Privacy Policy", href: "/privacy-policy" },
                                { label: "Terms of Service", href: "/terms" },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    style={{ color: "#6b7280" }}
                                    className="text-xs hover:text-white transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}