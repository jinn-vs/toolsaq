import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";
import JsonLd from "@/components/JsonLd";

const ARTICLE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    section,
    publishedAt,
    "author": author->name,
    "authorPhoto": author->photo,
    featuredImage,
    body,
    faqs
  }
`);

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const article = await client.fetch(ARTICLE_BY_SLUG_QUERY, { slug });

    if (!article) {
        return generatePageMetadata({
            title: "Article Not Found",
            description: "This article could not be found.",
        });
    }

    return generatePageMetadata({
        title: article.title ?? "Article",
        description: `Read ${article.title} on ToolsAQ — honest guides and reviews for developers.`,
        path: `/blog/${slug}`,
        ogImage: article.featuredImage
            ? urlFor(article.featuredImage).width(1200).height(630).url()
            : undefined,
    });
}

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const { data: article } = await sanityFetch({
        query: ARTICLE_BY_SLUG_QUERY,
        params: { slug },
    });

    if (!article) return notFound();

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        author: {
            "@type": "Person",
            name: article.author ?? "ToolsAQ Team",
        },
        publisher: {
            "@type": "Organization",
            name: "ToolsAQ",
            url: "https://toolsaq.com",
        },
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        image: article.featuredImage
            ? urlFor(article.featuredImage).width(1200).height(630).url()
            : "https://toolsaq.com/og-image.png",
        url: `https://toolsaq.com/blog/${slug}`,
    };

    const faqSchema = article.faqs?.length
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: article.faqs.map(
                (faq: { question?: string; answer?: string }) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: faq.answer,
                    },
                })
            ),
        }
        : null;

    return (
        <main style={{ backgroundColor: "#ffffff" }}>
            <JsonLd data={articleSchema} />
            {faqSchema && <JsonLd data={faqSchema} />}

            {/* Hero */}
            <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-10">
                <div className="max-w-3xl mx-auto">
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
                        {article.authorPhoto && (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                    src={urlFor(article.authorPhoto).width(64).height(64).url()}
                                    alt={article.author ?? ""}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div style={{ color: "#9ca3af" }} className="text-sm flex gap-3">
                            {article.author && <span>By {article.author}</span>}
                            {article.publishedAt && (
                                <span>
                                    {new Date(article.publishedAt).toLocaleDateString("en-GB", {
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
            {article.featuredImage && (
                <div className="max-w-3xl mx-auto px-4 mt-8">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                        <Image
                            src={urlFor(article.featuredImage).width(1200).height(600).url()}
                            alt={article.title ?? ""}
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
                        >
                            <PortableText
                                value={article.body}
                                components={{
                                    marks: {
                                        link: ({ children, value }) => {
                                            const href = value?.href ?? "";
                                            const isExternal = href.startsWith("http");
                                            return (
                                                <a
                                                    href={href}
                                                    target={isExternal ? "_blank" : "_self"}
                                                    rel={isExternal ? "noopener noreferrer" : undefined}
                                                    style={{ color: "#2563eb" }}
                                                    className="hover:underline"
                                                >
                                                    {children}
                                                </a>
                                            );
                                        },
                                    },
                                    types: {
                                        image: ({ value }) => {
                                            if (!value?.asset) return null;
                                            return (
                                                <div className="my-6 rounded-lg overflow-hidden">
                                                    <img
                                                        src={urlFor(value).width(800).url()}
                                                        alt={value.alt ?? ""}
                                                        className="w-full h-auto"
                                                    />
                                                </div>
                                            );
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* FAQs */}
            {article.faqs?.length ? (
                <section style={{ backgroundColor: "#f9fafb" }} className="px-4 py-10">
                    <div className="max-w-3xl mx-auto">
                        <h2 style={{ color: "#111827" }} className="text-xl font-bold mb-6">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {article.faqs.map(
                                (faq: { question?: string; answer?: string }, i: number) => (
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
                                )
                            )}
                        </div>
                    </div>
                </section>
            ) : null}
        </main>
    );
}