import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getAllCategories } from "@/lib/supabase/queries";
import { adminClient } from "@/lib/supabase/admin";
import { generatePageMetadata } from "@/lib/metadata";
import JsonLd from "@/components/JsonLd";

export const revalidate = 0;

export async function generateStaticParams() {
    const categories = await getAllCategories();
    return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);
    if (!category) return generatePageMetadata({ title: "Category Not Found", description: "This category could not be found." });
    return generatePageMetadata({
        title: `Best ${category.name} Tools ${new Date().getFullYear()}`,
        description: category.description ?? `Browse the best ${category.name} tools on ToolsAQ.`,
        path: `/category/${slug}`,
    });
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);
    if (!category) return notFound();

    const { data: tools } = await adminClient
        .from("tools")
        .select("*, category:categories(id, name, slug)")
        .eq("category_id", category.id)
        .order("name", { ascending: true });

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://toolsaq.com" },
            { "@type": "ListItem", position: 2, name: "Categories", item: "https://toolsaq.com/category" },
            { "@type": "ListItem", position: 3, name: category.name, item: `https://toolsaq.com/category/${slug}` },
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
                        <Link href="/category" className="hover:text-white transition-colors">Categories</Link>
                        <span>/</span>
                        <span style={{ color: "#d1d5db" }}>{category.name}</span>
                    </nav>

                    <h1 className="text-3xl font-bold text-white">{category.name}</h1>
                    {category.description && (
                        <p style={{ color: "#9ca3af" }} className="mt-2 text-sm max-w-2xl">
                            {category.description}
                        </p>
                    )}
                    <p style={{ color: "#6b7280" }} className="text-xs mt-3">
                        {tools?.length ?? 0} tool{(tools?.length ?? 0) !== 1 ? "s" : ""} found
                    </p>
                </div>
            </section>

            {/* Tools */}
            <section className="px-4 py-10">
                <div className="max-w-5xl mx-auto">
                    {!tools || tools.length === 0 ? (
                        <p style={{ color: "#6b7280" }} className="text-sm">
                            No tools in this category yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {tools.map((tool) => (
                                <Link
                                    key={tool.id}
                                    href={`/tools/${tool.slug}`}
                                    style={{ border: "1px solid #e5e7eb" }}
                                    className="rounded-lg p-4 hover:shadow-md transition-shadow block"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        {tool.logo_url ? (
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-100">
                                                <Image
                                                    src={tool.logo_url}
                                                    alt={tool.name}
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}
                                                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                                            >
                                                {tool.name.charAt(0)}
                                            </div>
                                        )}
                                        <h3 style={{ color: "#111827" }} className="font-semibold text-sm">
                                            {tool.name}
                                        </h3>
                                    </div>
                                    {tool.tagline && (
                                        <p style={{ color: "#6b7280" }} className="text-xs line-clamp-2">
                                            {tool.tagline}
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}