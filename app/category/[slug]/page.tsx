import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";

const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description
  }
`);

const SOFTWARE_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "software" && category->slug.current == $slug] | order(name asc) {
    _id,
    name,
    slug,
    tagline,
    "category": category->name
  }
`);

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const category = await client.fetch(CATEGORY_BY_SLUG_QUERY, { slug });

    if (!category) {
        return generatePageMetadata({
            title: "Category Not Found",
            description: "This category could not be found.",
        });
    }

    return generatePageMetadata({
        title: `Best ${category.name} Tools`,
        description:
            category.description ??
            `Browse the best ${category.name} tools on ToolsAQ. Compare features, read reviews and find the right tool.`,
        path: `/category/${slug}`,
    });
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const [{ data: category }, { data: tools }] = await Promise.all([
        sanityFetch({ query: CATEGORY_BY_SLUG_QUERY, params: { slug } }),
        sanityFetch({ query: SOFTWARE_BY_CATEGORY_QUERY, params: { slug } }),
    ]);

    if (!category) return notFound();

    return (
        <main style={{ backgroundColor: "#ffffff" }}>
            {/* Hero */}
            <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    <Link
                        href="/category"
                        style={{ color: "#6b7280" }}
                        className="text-sm hover:text-white transition-colors inline-block mb-4"
                    >
                        ← All Categories
                    </Link>
                    <h1 className="text-3xl font-bold text-white">{category.name}</h1>
                    {category.description && (
                        <p style={{ color: "#9ca3af" }} className="mt-2 text-sm max-w-2xl">
                            {category.description}
                        </p>
                    )}
                    <p style={{ color: "#6b7280" }} className="text-xs mt-3">
                        {tools.length} tool{tools.length !== 1 ? "s" : ""} found
                    </p>
                </div>
            </section>

            {/* Tools grid */}
            <section className="px-4 py-10">
                <div className="max-w-5xl mx-auto">
                    {tools.length === 0 ? (
                        <p style={{ color: "#6b7280" }}>
                            Is category me abhi koi tool listed nahi hai.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {tools.map((tool: {
                                _id: string;
                                name?: string;
                                slug?: { current?: string };
                                tagline?: string;
                                category?: string;
                            }) => (
                                <Link
                                    key={tool._id}
                                    href={`/tools/${tool.slug?.current}`}
                                    style={{ border: "1px solid #e5e7eb" }}
                                    className="rounded-lg p-4 hover:shadow-md transition-shadow block"
                                >
                                    <h2 style={{ color: "#111827" }} className="font-semibold text-sm">
                                        {tool.name}
                                    </h2>
                                    {tool.tagline && (
                                        <p style={{ color: "#6b7280" }} className="text-xs mt-1 line-clamp-2">
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