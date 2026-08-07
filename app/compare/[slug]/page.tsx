import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import ToolLogo from "@/components/ToolLogo";

const COMPARISON_BY_SLUG_QUERY = defineQuery(`
  *[_type == "comparison" && slug.current == $slug][0] {
    _id,
    slug,
    publishedAt,
    verdict,
    "productA": productA-> {
      name,
      slug,
      logo,
      tagline,
      pros,
      cons,
      website
    },
    "productB": productB-> {
      name,
      slug,
      logo,
      tagline,
      pros,
      cons,
      website
    }
  }
`);

type Product = {
    name?: string;
    slug?: { current?: string };
    logo?: object;
    tagline?: string;
    pros?: string[];
    cons?: string[];
    website?: string;
};

export default async function ComparisonPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const { data: comparison } = await sanityFetch({
        query: COMPARISON_BY_SLUG_QUERY,
        params: { slug },
    });

    if (!comparison) return notFound();

    const { productA, productB } = comparison;

    return (
        <main className="max-w-5xl mx-auto px-4 py-10">
            <Link href="/compare/all" className="text-sm text-gray-500 hover:text-white">
                ← All Comparisons
            </Link>

            {/* Header */}
            <div className="flex items-center justify-center gap-10 my-10">
                <div className="text-center">
                    <div className="flex justify-center mb-3">
                        <ToolLogo logo={productA?.logo} name={productA?.name} size={72} />
                    </div>
                    <h2 className="text-xl font-bold">{productA?.name}</h2>
                    {productA?.tagline && (
                        <p className="text-sm text-gray-400 mt-1 max-w-[160px] mx-auto">
                            {productA.tagline}
                        </p>
                    )}
                </div>

                <span className="text-4xl font-black text-gray-500">VS</span>

                <div className="text-center">
                    <div className="flex justify-center mb-3">
                        <ToolLogo logo={productB?.logo} name={productB?.name} size={72} />
                    </div>
                    <h2 className="text-xl font-bold">{productB?.name}</h2>
                    {productB?.tagline && (
                        <p className="text-sm text-gray-400 mt-1 max-w-[160px] mx-auto">
                            {productB.tagline}
                        </p>
                    )}
                </div>
            </div>

            {/* Verdict */}
            {comparison.verdict && (
                <div className="prose prose-invert max-w-none mb-10">
                    <h2 className="text-2xl font-semibold mb-4">Our Verdict</h2>
                    <PortableText value={comparison.verdict} />
                </div>
            )}

            {/* Pros/Cons side by side */}
            <div className="grid grid-cols-2 gap-8 mt-8">
                {[productA, productB].map((product: Product | undefined, i: number) => (
                    <div key={i} className="border rounded-lg p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <ToolLogo logo={product?.logo} name={product?.name} size={36} />
                            <h3 className="text-lg font-semibold">{product?.name}</h3>
                        </div>
                        {product?.pros?.length ? (
                            <div className="mb-4">
                                <p className="text-green-500 font-medium text-sm mb-2">Pros</p>
                                <ul className="space-y-1 text-sm">
                                    {product.pros.map((pro, j) => (
                                        <li key={j}>✓ {pro}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                        {product?.cons?.length ? (
                            <div className="mb-4">
                                <p className="text-red-500 font-medium text-sm mb-2">Cons</p>
                                <ul className="space-y-1 text-sm">
                                    {product.cons.map((con, j) => (
                                        <li key={j}>✕ {con}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                        {product?.website && (
                            <a
                                href={`/go/${product.slug?.current}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition"
                            >
                                Visit {product.name} →
                            </a>
                        )}
                    </div>
                ))}
            </div>

            {comparison.publishedAt && (
                <p className="text-xs text-gray-500 mt-10">
                    Published:{" "}
                    {new Date(comparison.publishedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
            )}
        </main>
    );
}