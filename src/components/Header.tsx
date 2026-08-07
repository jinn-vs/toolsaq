import Link from "next/link";

export default function Header() {
    return (
        <header className="border-b">
            <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="text-lg font-bold">
                    ToolsAQ
                </Link>
                <div className="flex gap-6 text-sm font-medium">
                    <Link href="/tools">Tools</Link>
                    <Link href="/category">Categories</Link>
                    <Link href="/compare">Compare</Link>
                    <Link href="/blog">Blog</Link>
                </div>
            </nav>
        </header>
    );
}