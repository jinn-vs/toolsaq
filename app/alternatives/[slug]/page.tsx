import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";
import ToolLogo from "@/components/ToolLogo";

const TOOL_BY_SLUG_QUERY = defineQuery(`
  *[_type == "software" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    tagline,
    logo,
    "category": category->name,
    "categorySlug": category->slug.current
  }
`);

const ALTERNATIVES_QUERY = defineQuery(`
  *[_type == "software" && slug.current != $slug && category->slug.current == $categorySlug] | order(name asc) {
    _id,
    name,
    slug,
    tagline,
    logo,
    "category": category->name
  }
`);

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const tool = await client.fetch(TOOL_BY_SLUG_QUERY, { slug });

    if (!tool) {
        return generatePageMetadata({
            title: "Tool Not Found",
            description: "This tool could not be found.",
        });
    }

    return generatePageMetadata({
        title: `Best ${tool.name} Alternatives in ${new Date().getFullYear()}`,
        description: `Looking for a ${tool.name} alternative? Compare the best ${tool.category} tools available in ${new Date().getFullYear()}.`,
        path: `/alternatives/${slug}`,
    });
}

export default async function AlternativesPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const { data: tool } = await sanityFetch({
        query: TOOL_BY_SLUG_QUERY,
        params: { slug },
    });

    if (!tool) return notFound();

    const { data: alternatives } = await sanityFetch({
        query: ALTERNATIVES_QUERY,
        params: { slug, categorySlug: tool.categorySlug ?? "" },
    });

    return (
        <main style={{ backgroundColor: "#ffffff" }}>
            {/* Hero */}
            <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "#6b7280" }}>
                        <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
                        <span>/</span>
                        <Link
                            href={`/tools/${tool.slug?.current}`}
                            className="hover:text-white transition-colors"
                        >
                            {tool.name}
                        </Link>
                        <span>/</span>
                        <span style={{ color: "#d1d5db" }}>Alternatives</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <ToolLogo logo={tool.logo as object} name={tool.name ?? ""} size={56} />
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Best {tool.name} Alternatives in {new Date().getFullYear()}
                            </h1>
                            <p style={{ color: "#9ca3af" }} className="text-sm mt-1">
                                Looking for a {tool.name} alternative? Here are the best options
                                in the {tool.category} space.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Alternatives list */}
            <section className="px-4 py-10">
                <div className="max-w-5xl mx-auto">
                    {alternatives.length === 0 ? (
                        <p style={{ color: "#6b7280" }}>
                            Abhi is category me koi alternative listed nahi hai.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {(alternatives as {
                                _id: string;
                                name?: string;
                                slug?: { current?: string };
                                tagline?: string;
                                logo?: object;
                                category?: string;
                            }[]).map((alt, i) => (
                                <div
                                    key={alt._id}
                                    style={{ border: "1px solid #e5e7eb" }}
                                    className="rounded-lg p-5 flex items-start gap-4"
                                >
                                    <span style={{ color: "#9ca3af" }} className="text-sm font-bold mt-1 w-5">
                                        {i + 1}
                                    </span>
                                    <ToolLogo logo={alt.logo} name={alt.name ?? ""} size={44} />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <h2 style={{ color: "#111827" }} className="font-semibold text-sm">
                                                    {alt.name}
                                                </h2>
                                                {alt.category && (
                                                    <span
                                                        style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}
                                                        className="text-xs px-2 py-0.5 rounded-full"
                                                    >
                                                        {alt.category}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <Link
                                                    href={`/tools/${alt.slug?.current}`}
                                                    style={{ border: "1px solid #e5e7eb", color: "#111827" }}
                                                    className="text-xs px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                                                >
                                                    View Details
                                                </Link>

                                                <a
                                                    href={`/go/${alt.slug?.current}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ backgroundColor: "#111827", color: "#ffffff" }}
                                                    className="text-xs px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors"
                                                >
                                                    Visit →
                                                </a>
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
        </main>
    );
}