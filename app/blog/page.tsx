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

export default async function BlogPage() {
    const articles = await getAllArticles();

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
            <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-2">Blog</h1>
                    <p style={{ color: "#9ca3af" }} className="text-sm">
                        Guides, reviews, comparisons and more.
                    </p>
                </div>
            </section>

            <section className="px-4 py-10">
                <div className="max-w-6xl mx-auto">
                    {articles.length === 0 ? (
                        <p style={{ color: "#6b7280" }} className="text-sm">
                            No articles published yet.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {articles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/blog/${article.slug}`}
                                    style={{ border: "1px solid #e5e7eb" }}
                                    className="rounded-lg overflow-hidden hover:shadow-md transition-shadow block"
                                >
                                    <div className="flex flex-col sm:flex-row">
                                        {article.featured_image_url && (
                                            <div className="relative w-full sm:w-56 h-48 sm:h-auto flex-shrink-0">
                                                <Image
                                                    src={article.featured_image_url}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="p-5 flex flex-col justify-center">
                                            {article.section && (
                                                <span style={{ color: "#2563eb" }} className="text-xs font-semibold uppercase tracking-wide">
                                                    {article.section}
                                                </span>
                                            )}
                                            <h2 style={{ color: "#111827" }} className="text-xl font-semibold mt-1">
                                                {article.title}
                                            </h2>
                                            {article.excerpt && (
                                                <p style={{ color: "#6b7280" }} className="text-sm mt-2 line-clamp-2">
                                                    {article.excerpt}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-3 mt-3">
                                                {article.author?.photo_url && (
                                                    <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={article.author.photo_url}
                                                            alt={article.author.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div style={{ color: "#9ca3af" }} className="text-xs flex gap-2">
                                                    {article.author && <span>By {article.author.name}</span>}
                                                    {article.published_at && (
                                                        <span>
                                                            {new Date(article.published_at).toLocaleDateString("en-GB", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                    )}
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