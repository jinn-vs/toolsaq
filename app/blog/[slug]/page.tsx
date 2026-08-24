import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/supabase/queries";
import { generatePageMetadata } from "@/lib/metadata";
import JsonLd from "@/components/JsonLd";
import TableOfContents from "@/components/TableOfContents";

export const revalidate = 3600;

export async function generateStaticParams() {
    const slugs = await getAllArticleSlugs();
    return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    if (!article) return generatePageMetadata({ title: "Article Not Found", description: "This article could not be found." });
    return generatePageMetadata({
        title: article.title,
        description: article.excerpt ?? `Read ${article.title} on ToolsAQ.`,
        path: `/blog/${slug}`,
        ogImage: article.featured_image_url ?? undefined,
    });
}

function readTime(body: string | null): string {
    if (!body) return "5 min read";
    const words = body.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
}

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    if (!article) return notFound();

    const faqs = Array.isArray(article.faqs)
        ? article.faqs as { question: string; answer: string }[]
        : [];

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        author: {
            "@type": "Person",
            name: article.author?.name ?? "ToolsAQ Team",
        },
        publisher: {
            "@type": "Organization",
            name: "ToolsAQ",
            url: "https://toolsaq.com",
        },
        datePublished: article.published_at,
        dateModified: article.updated_at,
        image: article.featured_image_url ?? "https://toolsaq.com/og-image.png",
        url: `https://toolsaq.com/blog/${slug}`,
        description: article.excerpt,
    };

    const faqSchema = faqs.length ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
    } : null;

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://toolsaq.com" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://toolsaq.com/blog" },
            { "@type": "ListItem", position: 3, name: article.title, item: `https://toolsaq.com/blog/${slug}` },
        ],
    };

    return (
        <main style={{ backgroundColor: "#ffffff" }}>
            <JsonLd data={articleSchema} />
            <JsonLd data={breadcrumbSchema} />
            {faqSchema && <JsonLd data={faqSchema} />}

            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "#6b7280" }}>
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
                    <span>/</span>
                    <span style={{ color: "#374151" }} className="truncate max-w-xs">{article.title}</span>
                </nav>

                {/* Category */}
                {article.section && (
                    <span
                        style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}
                        className="text-xs px-3 py-1 rounded-full font-semibold inline-block mb-4"
                    >
                        {article.section}
                    </span>
                )}

                {/* Title */}
                <h1 style={{ color: "#111827" }} className="text-3xl font-black leading-tight mb-3">
                    {article.title}
                </h1>

                {/* Excerpt */}
                {article.excerpt && (
                    <p style={{ color: "#6b7280" }} className="text-base mb-4 leading-relaxed max-w-3xl">
                        {article.excerpt}
                    </p>
                )}

                {/* Author + date + read time */}
                <div className="flex items-center gap-3 mb-6">
                    {article.author?.photo_url && (
                        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                                src={article.author.photo_url}
                                alt={article.author.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div style={{ color: "#6b7280" }} className="text-sm flex items-center gap-2">
                        {article.author && (
                            <span className="font-semibold" style={{ color: "#111827" }}>
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

                {/* Featured Image */}
                {article.featured_image_url && (
                    <div className="relative w-full h-72 rounded-xl overflow-hidden mb-8">
                        <Image
                            src={article.featured_image_url}
                            alt={article.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                {/* Two column layout */}
                <div className="flex gap-10 items-start">
                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                        {article.body && (
                            <div
                                className="article-body"
                                dangerouslySetInnerHTML={{ __html: article.body }}
                            />
                        )}

                        {/* FAQs */}
                        {faqs.length > 0 && (
                            <div className="mt-10">
                                <h2 style={{ color: "#111827" }} className="text-2xl font-bold mb-6">
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-4">
                                    {faqs.map((faq, i) => (
                                        <div
                                            key={i}
                                            style={{ border: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}
                                            className="rounded-lg p-5"
                                        >
                                            <p style={{ color: "#111827" }} className="font-semibold text-sm">
                                                {faq.question}
                                            </p>
                                            <p style={{ color: "#6b7280" }} className="text-sm mt-2 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Author bio */}
                        {article.author && (
                            <div
                                style={{ border: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}
                                className="rounded-xl p-5 flex items-start gap-4 mt-10"
                            >
                                {article.author.photo_url && (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={article.author.photo_url}
                                            alt={article.author.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div>
                                    <p style={{ color: "#111827" }} className="font-semibold text-sm">
                                        {article.author.name}
                                    </p>
                                    {article.author.bio && (
                                        <p style={{ color: "#6b7280" }} className="text-xs mt-1 leading-relaxed">
                                            {article.author.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar — Table of Contents */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div>
                            <TableOfContents html={article.body ?? ""} />
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}