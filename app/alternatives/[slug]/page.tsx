import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, getAlternativeTools, getAllToolSlugs } from "@/lib/supabase/queries";
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
        title: `Best ${tool.name} Alternatives in ${new Date().getFullYear()}`,
        description: `Looking for a ${tool.name} alternative? Compare the best ${tool.category?.name ?? "AI"} tools available in ${new Date().getFullYear()}.`,
        path: `/alternatives/${slug}`,
    });
}

export default async function AlternativesPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const tool = await getToolBySlug(slug);
    if (!tool) return notFound();

    const alternatives = tool.category_id
        ? await getAlternativeTools(slug, tool.category_id)
        : [];

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://toolsaq.com" },
            { "@type": "ListItem", position: 2, name: "Tools", item: "https://toolsaq.com/tools" },
            { "@type": "ListItem", position: 3, name: tool.name, item: `https://toolsaq.com/tools/${slug}` },
            { "@type": "ListItem", position: 4, name: "Alternatives", item: `https://toolsaq.com/alternatives/${slug}` },
        ],
    };

    return (
        <main style={{ backgroundColor: "#ffffff" }}>
            <JsonLd data={breadcrumbSchema} />

            {/* Hero */}
            <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "#6b7280" }}>
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
                        <span>/</span>
                        <Link href={`/tools/${tool.slug}`} className="hover:text-white transition-colors">
                            {tool.name}
                        </Link>
                        <span>/</span>
                        <span style={{ color: "#d1d5db" }}>Alternatives</span>
                    </nav>

                    <div className="flex items-center gap-4">
                        {tool.logo_url ? (
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white flex-shrink-0">
                                <Image src={tool.logo_url} alt={tool.name} fill className="object-contain p-1.5" />
                            </div>
                        ) : (
                            <div
                                style={{ backgroundColor: "#1f2937", color: "#9ca3af" }}
                                className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0"
                            >
                                {tool.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Best {tool.name} Alternatives in {new Date().getFullYear()}
                            </h1>
                            <p style={{ color: "#9ca3af" }} className="text-sm mt-1">
                                Looking for a {tool.name} alternative? Here are the best options
                                {tool.category && ` in the ${tool.category.name} space`}.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Alternatives list */}
            <section className="px-4 py-10">
                <div className="max-w-5xl mx-auto">
                    {alternatives.length === 0 ? (
                        <p style={{ color: "#6b7280" }} className="text-sm">
                            No alternatives listed yet in this category.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {alternatives.map((alt, i) => (
                                <div
                                    key={alt.id}
                                    style={{ border: "1px solid #e5e7eb" }}
                                    className="rounded-lg p-5 flex items-start gap-4"
                                >
                                    <span style={{ color: "#9ca3af" }} className="text-sm font-bold mt-1 w-5 flex-shrink-0">
                                        {i + 1}
                                    </span>
                                    {alt.logo_url ? (
                                        <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-100">
                                            <Image src={alt.logo_url} alt={alt.name} fill className="object-contain p-1" />
                                        </div>
                                    ) : (
                                        <div
                                            style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}
                                            className="w-11 h-11 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                                        >
                                            {alt.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-4 flex-wrap">
                                            <div>
                                                <h2 style={{ color: "#111827" }} className="font-semibold text-sm">
                                                    {alt.name}
                                                </h2>
                                                {alt.category && (
                                                    <span
                                                        style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}
                                                        className="text-xs px-2 py-0.5 rounded-full"
                                                    >
                                                        {alt.category.name}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/tools/${alt.slug}`}
                                                    style={{ border: "1px solid #e5e7eb", color: "#111827" }}
                                                    className="text-xs px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                                                >
                                                    View Details
                                                </Link>
                                                {alt.website && (
                                                    <Link
                                                        href={`/go/${alt.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ backgroundColor: "#111827", color: "#ffffff" }}
                                                        className="text-xs px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors"
                                                    >
                                                        Visit →
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                        {alt.tagline && (
                                            <p style={{ color: "#6b7280" }} className="text-sm mt-2">
                                                {alt.tagline}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main >
    );
}