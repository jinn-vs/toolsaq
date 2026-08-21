import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "@/lib/supabase/queries";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
    title: "Blog — AI & Developer Tool Guides",
    description: "Read honest guides, reviews, comparisons and tutorials on AI and developer tools.",
    path: "/blog",
});

const SECTIONS = [
    "All",
    "Guides & Tutorials",
    "Software Reviews",
    "Alternatives",
    "Comparisons",
];

function readTime(body: string | null): string {
    if (!body) return "5 min read";
    const words = body.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
}

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ section?: string }>;
}) {
    const { section } = await searchParams;
    const allArticles = await getAllArticles();

    const filtered = section && section !== "All"
        ? allArticles.filter((a) => a.section === section)
        : allArticles;

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://toolsaq.com" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://toolsaq.com/blog" },
        ],
    };

    return (
        <main style={{ backgroundColor: "#ffffff" }}>
            <JsonLd data={breadcrumbSchema} />

            {/* Hero */}
            <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-14">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-black text-white mb-3">ToolsAQ Magazine</h1>
                    <p style={{ color: "#9ca3af" }} className="text-sm max-w-2xl">
                        Expert guides, honest reviews, and practical insights on AI and developer tools.
                        Everything you need to choose, use, and get the most out of modern tech tools.
                    </p>
                </div>
            </section>

            {/* Category tabs */}
            <section style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }} className="px-4 py-3">
                <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto">
                    {SECTIONS.map((s) => (
                        <Link
                            key={s}
                            href={s === "All" ? "/blog" : `/blog?section=${encodeURIComponent(s)}`}
                            style={{
                                backgroundColor: (section === s || (!section && s === "All")) ? "#111827" : "#ffffff",
                                color: (section === s || (!section && s === "All")) ? "#ffffff" : "#6b7280",
                                border: "1px solid #e5e7eb",
                            }}
                            className="text-xs px-4 py-2 rounded-full whitespace-nowrap font-medium hover:bg-gray-800 hover:text-white transition-colors"
                        >
                            {s}
                        </Link>
                    ))}
                </div>
            </section>

            {/* Articles */}
            <section className="px-4 py-10">
                <div className="max-w-6xl mx-auto">
                    {filtered.length === 0 ? (
                        <p style={{ color: "#6b7280" }} className="text-sm">
                            No articles in this section yet.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {filtered.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/blog/${article.slug}`}
                                    style={{ border: "1px solid #e5e7eb" }}
                                    className="rounded-xl overflow-hidden hover:shadow-md transition-shadow block"
                                >
                                    <div className="flex flex-col sm:flex-row">
                                        {/* Image */}
                                        {article.featured_image_url && (
                                            <div className="relative w-full sm:w-64 h-48 flex-shrink-0">
                                                <Image
                                                    src={article.featured_image_url}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        {/* Content */}
                                        <div className="p-5 flex flex-col justify-between flex-1">
                                            <div>
                                                {article.section && (
                                                    <span
                                                        style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}
                                                        className="text-xs px-3 py-1 rounded-full font-semibold inline-block mb-2"
                                                    >
                                                        {article.section}
                                                    </span>
                                                )}
                                                <h2 style={{ color: "#111827" }} className="text-lg font-bold leading-snug mb-2">
                                                    {article.title}
                                                </h2>
                                                {article.excerpt && (
                                                    <p style={{ color: "#6b7280" }} className="text-sm line-clamp-2 leading-relaxed">
                                                        {article.excerpt}
                                                    </p>
                                                )}
                                            </div>
                                            {/* Author + date + read time */}
                                            <div className="flex items-center gap-3 mt-4">
                                                {article.author?.photo_url && (
                                                    <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={article.author.photo_url}
                                                            alt={article.author.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div style={{ color: "#6b7280" }} className="text-xs flex items-center gap-2">
                                                    {article.author && (
                                                        <span className="font-medium" style={{ color: "#374151" }}>
                                                            {article.author.name}
                                                        </span>
                                                    )}
                                                    {article.published_at && (
                                                        <>
                                                            <span>•</span>
                                                            <span>
                                                                {new Date(article.published_at).toLocaleDateString("en-GB", {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                })}
                                                            </span>
                                                        </>
                                                    )}
                                                    <span>•</span>
                                                    <span>{readTime(article.body)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}