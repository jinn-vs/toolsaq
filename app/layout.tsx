import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ToolLogo from "@/components/ToolLogo";
import JsonLd from "@/components/JsonLd";
import { generatePageMetadata } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";

const SOFTWARE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "software" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    tagline,
    website,
    logo,
    "category": category->name,
    "categorySlug": category->slug.current,
    pros,
    cons,
    faqs
  }
`);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = await client.fetch(SOFTWARE_BY_SLUG_QUERY, { slug });

  if (!tool) {
    return generatePageMetadata({
      title: "Tool Not Found",
      description: "This tool could not be found.",
    });
  }

  return generatePageMetadata({
    title: `${tool.name} Review`,
    description:
      tool.tagline ??
      `Read our honest review of ${tool.name}. Features, pros, cons, pricing and alternatives.`,
    path: `/tools/${slug}`,
  });
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: tool } = await sanityFetch({
    query: SOFTWARE_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!tool) return notFound();

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.tagline,
    url: tool.website,
    applicationCategory: tool.category ?? "DeveloperApplication",
    operatingSystem: "Web",
  };

  const faqSchema = tool.faqs?.length
    ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: tool.faqs.map((faq: { question: string; answer: string }) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    }
    : null;

  return (
    <main style={{ backgroundColor: "#ffffff" }}>
      <JsonLd data={softwareSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      {/* Hero — black */}
      <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "#6b7280" }}>
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <span>/</span>
            {tool.category && (
              <>
                <Link
                  href={`/category/${tool.categorySlug}`}
                  className="hover:text-white transition-colors"
                >
                  {tool.category}
                </Link>
                <span>/</span>
              </>
            )}
            <span style={{ color: "#d1d5db" }}>{tool.name}</span>
          </div>

          {/* Tool header */}
          <div className="flex items-start gap-5">
            <ToolLogo logo={tool.logo as object} name={tool.name ?? ""} size={72} />
            <div className="flex-1">
              {tool.category && (
                <Link
                  href={`/category/${tool.categorySlug}`}
                  style={{ backgroundColor: "#1f2937", color: "#9ca3af" }}
                  className="text-xs px-3 py-1 rounded-full inline-block mb-2 hover:bg-gray-700 transition-colors"
                >
                  {tool.category}
                </Link>
              )}
              <h1 className="text-3xl font-bold text-white">{tool.name}</h1>
              {tool.tagline && (
                <p style={{ color: "#9ca3af" }} className="mt-1 text-sm">
                  {tool.tagline}
                </p>
              )}

              {/* CTAs */}
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                {tool.website && (
                  <a
                    href={`/go/${tool.slug?.current}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: "#ffffff", color: "#0a0a0a" }}
                    className="text-sm font-semibold px-5 py-2 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Visit Website →
                  </a>
                )}
                <Link
                  href={`/alternatives/${tool.slug?.current}`}
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
        (tool.pros?.length || tool.cons?.length) && (
          <section style={{ backgroundColor: "#ffffff" }} className="px-4 py-10">
            <div className="max-w-5xl mx-auto">
              <h2 style={{ color: "#111827" }} className="text-xl font-bold mb-6">
                Pros & Cons
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {tool.pros?.length ? (
                  <div
                    style={{ border: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}
                    className="rounded-lg p-5"
                  >
                    <h3 className="font-semibold text-green-600 mb-3 text-sm uppercase tracking-wide">
                      ✓ Pros
                    </h3>
                    <ul className="space-y-2">
                      {tool.pros.map((pro: string, i: number) => (
                        <li key={i} style={{ color: "#374151" }} className="text-sm flex gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {tool.cons?.length ? (
                  <div
                    style={{ border: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}
                    className="rounded-lg p-5"
                  >
                    <h3 className="font-semibold text-red-500 mb-3 text-sm uppercase tracking-wide">
                      ✕ Cons
                    </h3>
                    <ul className="space-y-2">
                      {tool.cons.map((con: string, i: number) => (
                        <li key={i} style={{ color: "#374151" }} className="text-sm flex gap-2">
                          <span className="text-red-400 mt-0.5">✕</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        )
      }

      {/* FAQs */}
      {
        tool.faqs?.length ? (
          <section style={{ backgroundColor: "#f9fafb" }} className="px-4 py-10">
            <div className="max-w-5xl mx-auto">
              <h2 style={{ color: "#111827" }} className="text-xl font-bold mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {tool.faqs.map((faq: { question: string; answer: string }, i: number) => (
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
                ))}
              </div>
            </div>
          </section>
        ) : null
      }

      {/* Related links */}
      <section style={{ backgroundColor: "#ffffff" }} className="px-4 py-10">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-3">
          <Link
            href={`/alternatives/${tool.slug?.current}`}
            style={{ border: "1px solid #e5e7eb", color: "#2563eb" }}
            className="text-sm px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            Best {tool.name} Alternatives →
          </Link>
          {tool.category && (
            <Link
              href={`/category/${tool.categorySlug}`}
              style={{ border: "1px solid #e5e7eb", color: "#2563eb" }}
              className="text-sm px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
            >
              More {tool.category} Tools →
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
    </main>
  );
}