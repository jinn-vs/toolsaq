import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getComparisonBySlug, getAllComparisonSlugs } from "@/lib/supabase/queries";
import { generatePageMetadata } from "@/lib/metadata";
import JsonLd from "@/components/JsonLd";

export const revalidate = 3600;

export async function generateStaticParams() {
    const slugs = await getAllComparisonSlugs();
    return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const comparison = await getComparisonBySlug(slug);
    if (!comparison) return generatePageMetadata({ title: "Comparison Not Found", description: "This comparison could not be found." });

    const toolA = comparison.tool_a as { name: string } | null
    const toolB = comparison.tool_b as { name: string } | null

    return generatePageMetadata({
        title: `${toolA?.name} vs ${toolB?.name} — Which is Better?`,
        description: `Compare ${toolA?.name} vs ${toolB?.name}. See features, pros, cons and our verdict.`,
        path: `/compare/${slug}`,
    });
}

export default async function ComparisonPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const comparison = await getComparisonBySlug(slug);
    if (!comparison) return notFound();

    type CompTool = {
        name: string;
        slug: string;
        logo_url: string | null;
        tagline: string | null;
        pros: string[] | null;
        cons: string[] | null;
        website: string | null;
        category: { name: string; slug: string } | null;
    }

    const toolA = comparison.tool_a as CompTool | null
    const toolB = comparison.tool_b as CompTool | null

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://toolsaq.com" },
            { "@type": "ListItem", position: 2, name: "Comparisons", item: "https://toolsaq.com/compare/all" },
            { "@type": "ListItem", position: 3, name: `${toolA?.name} vs ${toolB?.name}`, item: `https://toolsaq.com/compare/${slug}` },
        ],
    };

    return (
        <main style={{ backgroundColor: "#ffffff" }}>
            <JsonLd data={breadcrumbSchema} />

            {/* Hero */}
            <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-10">
                <div className="max-w-5xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "#6b7280" }}>
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/compare/all" className="hover:text-white transition-colors">Comparisons</Link>
                        <span>/</span>
                        <span style={{ color: "#d1d5db" }}>{toolA?.name} vs {toolB?.name}</span>
                    </nav>

                    {/* VS Header */}
                    <div className="flex items-center justify-center gap-10 py-4">
                        <div className="text-center">
                            {toolA?.logo_url ? (
                                <div className="relative w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden bg-white">
                                    <Image src={toolA.logo_url} alt={toolA.name} fill className="object-contain p-1.5" />
                                </div>
                            ) : (
                                <div
                                    style={{ backgroundColor: "#1f2937", color: "#9ca3af" }}
                                    className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center text-2xl font-black"
                                >
                                    {toolA?.name.charAt(0)}
                                </div>
                            )}
                            <h2 className="text-xl font-bold text-white">{toolA?.name}</h2>
                            {toolA?.tagline && (
                                <p style={{ color: "#9ca3af" }} className="text-xs mt-1 max-w-[140px] mx-auto">
                                    {toolA.tagline}
                                </p>
                            )}
                        </div>

                        <span className="text-4xl font-black" style={{ color: "#6b7280" }}>VS</span>

                        <div className="text-center">
                            {toolB?.logo_url ? (
                                <div className="relative w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden bg-white">
                                    <Image src={toolB.logo_url} alt={toolB.name} fill className="object-contain p-1.5" />
                                </div>
                            ) : (
                                <div
                                    style={{ backgroundColor: "#1f2937", color: "#9ca3af" }}
                                    className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center text-2xl font-black"
                                >
                                    {toolB?.name.charAt(0)}
                                </div>
                            )}
                            <h2 className="text-xl font-bold text-white">{toolB?.name}</h2>
                            {toolB?.tagline && (
                                <p style={{ color: "#9ca3af" }} className="text-xs mt-1 max-w-[140px] mx-auto">
                                    {toolB.tagline}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Verdict */}
            {comparison.verdict && (
                <section style={{ backgroundColor: "#f9fafb" }} className="px-4 py-10">
                    <div className="max-w-5xl mx-auto">
                        <h2 style={{ color: "#111827" }} className="text-xl font-bold mb-4">Our Verdict</h2>
                        <div
                            style={{ color: "#374151" }}
                            className="prose max-w-none text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: comparison.verdict }}
                        />
                    </div>
                </section>
            )}

            {/* Pros/Cons */}
            <section style={{ backgroundColor: "#ffffff" }} className="px-4 py-10">
                <div className="max-w-5xl mx-auto">
                    <h2 style={{ color: "#111827" }} className="text-xl font-bold mb-6">Pros & Cons</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[toolA, toolB].map((tool, i) => (
                            <div key={i} style={{ border: "1px solid #e5e7eb" }} className="rounded-lg p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    {tool?.logo_url ? (
                                        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-100">
                                            <Image src={tool.logo_url} alt={tool.name} fill className="object-contain p-0.5" />
                                        </div>
                                    ) : (
                                        <div
                                            style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0"
                                        >
                                            {tool?.name.charAt(0)}
                                        </div>
                                    )}
                                    <h3 style={{ color: "#111827" }} className="font-semibold text-sm">{tool?.name}</h3>
                                </div>

                                {(tool?.pros?.length ?? 0) > 0 && (
                                    <div className="mb-4">
                                        <p className="text-green-600 font-medium text-xs mb-2 uppercase tracking-wide">Pros</p>
                                        <ul className="space-y-1">
                                            {tool!.pros!.map((pro, j) => (
                                                <li key={j} style={{ color: "#374151" }} className="text-sm flex gap-2">
                                                    <span className="text-green-500">✓</span>{pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {(tool?.cons?.length ?? 0) > 0 && (
                                    <div className="mb-4">
                                        <p className="text-red-500 font-medium text-xs mb-2 uppercase tracking-wide">Cons</p>
                                        <ul className="space-y-1">
                                            {tool!.cons!.map((con, j) => (
                                                <li key={j} style={{ color: "#374151" }} className="text-sm flex gap-2">
                                                    <span className="text-red-400">✕</span>{con}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {tool?.website && (
                                    <Link
                                        href={`/go/${tool.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ backgroundColor: "#111827", color: "#ffffff" }}
                                        className="text-xs px-4 py-2 rounded-full hover:bg-gray-800 transition-colors inline-block mt-2"
                                    >
                                        Visit {tool.name} →
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {
                comparison.published_at && (
                    <div className="max-w-5xl mx-auto px-4 pb-10">
                        <p style={{ color: "#9ca3af" }} className="text-xs">
                            Published:{" "}
                            {new Date(comparison.published_at).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                )
            }
        </main >
    );
}