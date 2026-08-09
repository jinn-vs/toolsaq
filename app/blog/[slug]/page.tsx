import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/supabase/queries";
import { generatePageMetadata } from "@/lib/metadata";
import JsonLd from "@/components/JsonLd";

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

            {/* Hero */}
            <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-10">
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "#6b7280" }}>
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                        <span>/</span>
                        <span style={{ color: "#d1d5db" }} className="truncate max-w-xs">{article.title}</span>
                    </nav>

                    {article.section && (
                        <span
                            style={{ backgroundColor: "#1f2937", color: "#9ca3af" }}
                            className="text-xs px-3 py-1 rounded-full inline-block mb-4"
                        >
                            {article.section}
                        </span>
                    )}
                    <h1 className="text-3xl font-black text-white leading-tight">
                        {article.title}
                    </h1>
                    <div className="flex items-center gap-3 mt-4">
                        {article.author?.photo_url && (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                    src={article.author.photo_url}
                                    alt={article.author.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div style={{ color: "#9ca3af" }} className="text-sm flex gap-3">
                            {article.author && <span>By {article.author.name}</span>}
                            {article.published_at && (
                                <span>
                                    {new Date(article.published_at).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            {article.featured_image_url && (
                <div className="max-w-3xl mx-auto px-4 mt-8">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                        <Image
                            src={article.featured_image_url}
                            alt={article.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Body */}
            {article.body && (
                <section className="px-4 py-10">
                    <div className="max-w-3xl mx-auto">
                        <div
                            className="prose max-w-none text-sm leading-relaxed"
                            style={{ color: "#374151" }}
                            dangerouslySetInnerHTML={{ __html: article.body }}
                        />
                    </div>
                </section>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
                <section style={{ backgroundColor: "#f9fafb" }} className="px-4 py-10">
                    <div className="max-w-3xl mx-auto">
                        <h2 style={{ color: "#111827" }} className="text-xl font-bold mb-6">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div
                                    key={i}
                                    style={{ border: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}
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
                </section>
            )}

            {/* Author bio */}
            {article.author && (
                <section style={{ backgroundColor: "#ffffff" }} className="px-4 py-10">
                    <div className="max-w-3xl mx-auto">
                        <div
                            style={{ border: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}
                            className="rounded-lg p-5 flex items-start gap-4"
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
                    </div>
                </section>
            )}
        </main>
    );
}