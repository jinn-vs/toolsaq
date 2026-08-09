import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, getAllToolSlugs } from "@/lib/supabase/queries";
import { generatePageMetadata } from "@/lib/metadata";
import JsonLd from "@/components/JsonLd";

export const revalidate = 3600;

export async function generateStaticParams() {
    const slugs = await getAllToolSlugs();
    return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const tool = await getToolBySlug(slug);
    if (!tool) return generatePageMetadata({ title: "Tool Not Found", description: "This tool could not be found." });
    return generatePageMetadata({
        title: `${tool.name} Review ${new Date().getFullYear()}`,
        description: tool.tagline ?? `Read our honest review of ${tool.name}. Features, pros, cons and alternatives.`,
        path: `/tools/${slug}`,
        ogImage: tool.logo_url ?? undefined,
    });
}

export default async function ToolPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const tool = await getToolBySlug(slug);
    if (!tool) return notFound();

    const faqs = Array.isArray(tool.faqs) ? tool.faqs as { question: string; answer: string }[] : [];

    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: tool.name,
        description: tool.tagline,
        url: tool.website,
        applicationCategory: tool.category?.name ?? "DeveloperApplication",
        operatingSystem: "Web",
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
            { "@type": "ListItem", position: 2, name: "Tools", item: "https://toolsaq.com/tools" },
            { "@type": "ListItem", position: 3, name: tool.name, item: `https://toolsaq.com/tools/${slug}` },
        ],
    };

    return (
        <main style={{ backgroundColor: "#ffffff" }}>
            <JsonLd data={softwareSchema} />
            <JsonLd data={breadcrumbSchema} />
            {faqSchema && <JsonLd data={faqSchema} />}

            {/* Hero */}
            <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-10">
                <div className="max-w-5xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "#6b7280" }}>
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
                        {tool.category && (
                            <>
                                <span>/</span>
                                <Link href={`/category/${tool.category.slug}`} className="hover:text-white transition-colors">
                                    {tool.category.name}
                                </Link>
                            </>
                        )}
                        <span>/</span>
                        <span style={{ color: "#d1d5db" }}>{tool.name}</span>
                    </nav>

                    {/* Tool header */}
                    <div className="flex items-start gap-5">
                        {tool.logo_url ? (
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0">
                                <Image src={tool.logo_url} alt={tool.name} fill className="object-contain p-1.5" />
                            </div>
                        ) : (
                            <div
                                style={{ backgroundColor: "#1f2937", color: "#9ca3af" }}
                                className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black flex-shrink-0"
                            >
                                {tool.name.charAt(0)}
                            </div>
                        )}
                        <div className="flex-1">
                            {tool.category && (
                                <Link
                                    href={`/category/${tool.category.slug}`}
                                    style={{ backgroundColor: "#1f2937", color: "#9ca3af" }}
                                    className="text-xs px-3 py-1 rounded-full inline-block mb-2 hover:bg-gray-700 transition-colors"
                                >
                                    {tool.category.name}
                                </Link>
                            )}
                            <h1 className="text-3xl font-bold text-white">{tool.name}</h1>
                            {tool.tagline && (
                                <p style={{ color: "#9ca3af" }} className="mt-1 text-sm">{tool.tagline}</p>
                            )}
                            <div className="flex items-center gap-3 mt-4 flex-wrap">
                                {tool.website && (
                                    <Link
                                        href={`/go/${tool.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ backgroundColor: "#ffffff", color: "#0a0a0a" }}
                                        className="text-sm font-semibold px-5 py-2 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        Visit Website →
                                    </Link>
                                )}
                                <Link
                                    href={`/alternatives/${tool.slug}`}
                                    style={{ border: "1px solid #374151", color: "#d1d5db" }}
                                    className="text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    See Alternatives
                                </Link>
                                <Link
                                    href="/compare/all"
                                    style={{ border: "1px solid #374151", color: "#d1d5db" }}
                                    className="text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    Compare
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pros & Cons */}
            {
                ((tool.pros?.length ?? 0) > 0 || (tool.cons?.length ?? 0) > 0) && (
                    <section style={{ backgroundColor: "#ffffff" }} className="px-4 py-10">
                        <div className="max-w-5xl mx-auto">
                            <h2 style={{ color: "#111827" }} className="text-xl font-bold mb-6">Pros & Cons</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {(tool.pros?.length ?? 0) > 0 && (
                                    <div style={{ border: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }} className="rounded-lg p-5">
                                        <h3 className="font-semibold text-green-600 mb-3 text-sm uppercase tracking-wide">✓ Pros</h3>
                                        <ul className="space-y-2">
                                            {tool.pros!.map((pro, i) => (
                                                <li key={i} style={{ color: "#374151" }} className="text-sm flex gap-2">
                                                    <span className="text-green-500 mt-0.5">✓</span>{pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {(tool.cons?.length ?? 0) > 0 && (
                                    <div style={{ border: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }} className="rounded-lg p-5">
                                        <h3 className="font-semibold text-red-500 mb-3 text-sm uppercase tracking-wide">✕ Cons</h3>
                                        <ul className="space-y-2">
                                            {tool.cons!.map((con, i) => (
                                                <li key={i} style={{ color: "#374151" }} className="text-sm flex gap-2">
                                                    <span className="text-red-400 mt-0.5">✕</span>{con}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )
            }

            {/* FAQs */}
            {
                faqs.length > 0 && (
                    <section style={{ backgroundColor: "#f9fafb" }} className="px-4 py-10">
                        <div className="max-w-5xl mx-auto">
                            <h2 style={{ color: "#111827" }} className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                {faqs.map((faq, i) => (
                                    <div key={i} style={{ border: "1px solid #e5e7eb", backgroundColor: "#ffffff" }} className="rounded-lg p-5">
                                        <p style={{ color: "#111827" }} className="font-semibold text-sm">{faq.question}</p>
                                        <p style={{ color: "#6b7280" }} className="text-sm mt-2 leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )
            }

            {/* Related links */}
            <section style={{ backgroundColor: "#ffffff" }} className="px-4 py-10">
                <div className="max-w-5xl mx-auto flex flex-wrap gap-3">
                    <Link
                        href={`/alternatives/${tool.slug}`}
                        style={{ border: "1px solid #e5e7eb", color: "#2563eb" }}
                        className="text-sm px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
                    >
                        Best {tool.name} Alternatives →
                    </Link>
                    {tool.category && (
                        <Link
                            href={`/category/${tool.category.slug}`}
                            style={{ border: "1px solid #e5e7eb", color: "#2563eb" }}
                            className="text-sm px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
                        >
                            More {tool.category.name} Tools →
                        </Link>
                    )}
                    <Link
                        href="/compare/all"
                        style={{ border: "1px solid #e5e7eb", color: "#2563eb" }}
                        className="text-sm px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
                    >
                        Compare Tools →
                    </Link>
                </div>
            </section>
        </main >
    );
}