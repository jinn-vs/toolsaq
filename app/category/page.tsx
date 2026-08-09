import Link from "next/link";
import { getAllCategories } from "@/lib/supabase/queries";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
    title: "Browse Tool Categories",
    description: "Browse AI and developer tools by category. Find the best tools for your workflow.",
    path: "/category",
});

export default async function CategoriesPage() {
    const categories = await getAllCategories();

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://toolsaq.com" },
            { "@type": "ListItem", position: 2, name: "Categories", item: "https://toolsaq.com/category" },
        ],
    };

    return (
        <main style={{ backgroundColor: "#ffffff" }}>
            <JsonLd data={breadcrumbSchema} />

            {/* Hero */}
            <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-2">Browse by Category</h1>
                    <p style={{ color: "#9ca3af" }} className="text-sm">
                        Explore AI and developer tools organized by category.
                    </p>
                </div>
            </section>

            <section className="px-4 py-10">
                <div className="max-w-6xl mx-auto">
                    {categories.length === 0 ? (
                        <p style={{ color: "#6b7280" }} className="text-sm">No categories yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/category/${cat.slug}`}
                                    style={{ border: "1px solid #e5e7eb" }}
                                    className="rounded-lg p-5 hover:shadow-md transition-shadow block"
                                >
                                    <h2 style={{ color: "#111827" }} className="font-semibold">
                                        {cat.name}
                                    </h2>
                                    {cat.description && (
                                        <p style={{ color: "#6b7280" }} className="text-sm mt-2 line-clamp-3">
                                            {cat.description}
                                        </p>
                                    )}
                                    <span style={{ color: "#2563eb" }} className="text-xs mt-3 inline-block">
                                        Explore →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}