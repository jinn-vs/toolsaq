import Link from "next/link";
import Image from "next/image";
import { getAllComparisons } from "@/lib/supabase/queries";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
    title: "Compare AI & Developer Tools",
    description: "Side-by-side comparisons of popular AI and developer tools. Find the best tool for your needs.",
    path: "/compare/all",
});

export default async function ComparisonsPage() {
    const comparisons = await getAllComparisons();

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://toolsaq.com" },
            { "@type": "ListItem", position: 2, name: "Comparisons", item: "https://toolsaq.com/compare/all" },
        ],
    };

    return (
        <main style={{ backgroundColor: "#ffffff" }}>
            <JsonLd data={breadcrumbSchema} />

            {/* Hero */}
            <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-2">Compare Tools</h1>
                    <p style={{ color: "#9ca3af" }} className="text-sm">
                        Side-by-side comparisons of popular AI and developer tools.
                    </p>
                </div>
            </section>

            <section className="px-4 py-10">
                <div className="max-w-6xl mx-auto">
                    {comparisons.length === 0 ? (
                        <p style={{ color: "#6b7280" }} className="text-sm">
                            No comparisons published yet.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {comparisons.map((comp) => {
                                const toolA = comp.tool_a as { name: string; slug: string; logo_url: string | null; tagline: string | null } | null
                                const toolB = comp.tool_b as { name: string; slug: string; logo_url: string | null; tagline: string | null } | null

                                return (
                                    <Link
                                        key={comp.id}
                                        href={`/compare/${comp.slug}`}
                                        style={{ border: "1px solid #e5e7eb" }}
                                        className="rounded-lg p-5 hover:shadow-md transition-shadow block"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Tool A */}
                                            <div className="flex items-center gap-3">
                                                {toolA?.logo_url ? (
                                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-100">
                                                        <Image
                                                            src={toolA.logo_url}
                                                            alt={toolA.name}
                                                            fill
                                                            className="object-contain p-1"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                                                    >
                                                        {toolA?.name.charAt(0)}
                                                    </div>
                                                )}
                                                <span style={{ color: "#111827" }} className="font-semibold text-sm">
                                                    {toolA?.name}
                                                </span>
                                            </div>

                                            <span style={{ color: "#9ca3af" }} className="font-black text-lg">VS</span>

                                            {/* Tool B */}
                                            <div className="flex items-center gap-3">
                                                {toolB?.logo_url ? (
                                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-100">
                                                        <Image
                                                            src={toolB.logo_url}
                                                            alt={toolB.name}
                                                            fill
                                                            className="object-contain p-1"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                                                    >
                                                        {toolB?.name.charAt(0)}
                                                    </div>
                                                )}
                                                <span style={{ color: "#111827" }} className="font-semibold text-sm">
                                                    {toolB?.name}
                                                </span>
                                            </div>
                                        </div>

                                        {comp.published_at && (
                                            <p style={{ color: "#9ca3af" }} className="text-xs mt-3">
                                                {new Date(comp.published_at).toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}