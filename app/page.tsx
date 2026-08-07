import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_SOFTWARE_QUERY, ALL_CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { defineQuery } from "next-sanity";
import ToolLogo from "@/components/ToolLogo";

const LATEST_ARTICLES_QUERY = defineQuery(`
  *[_type == "article"] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    section,
    publishedAt,
    "author": author->name,
  }
`);

const FEATURED_TOOLS_QUERY = defineQuery(`
  *[_type == "software"] | order(_createdAt desc) [0...6] {
    _id,
    name,
    slug,
    tagline,
    logo,
    "category": category->name
  }
`);

export default async function HomePage() {
  const [
    { data: tools },
    { data: categories },
    { data: articles },
  ] = await Promise.all([
    sanityFetch({ query: FEATURED_TOOLS_QUERY }),
    sanityFetch({ query: ALL_CATEGORIES_QUERY }),
    sanityFetch({ query: LATEST_ARTICLES_QUERY }),
  ]);

  return (
    <main>
      {/* Hero — black background */}
      <section style={{ backgroundColor: "#0a0a0a" }} className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Find the right AI & Developer Tools
          </h1>
          <p style={{ color: "#9ca3af" }} className="text-lg max-w-2xl mb-8">
            ToolsAQ helps you discover the best tools for your workflow.
            Compare options, read honest reviews, and make smarter decisions.
          </p>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug?.current}`}
                style={{
                  backgroundColor: "#1f2937",
                  color: "#d1d5db",
                  border: "1px solid #374151",
                }}
                className="text-sm px-4 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex gap-3">
            <Link
              href="/tools"
              style={{ backgroundColor: "#ffffff", color: "#0a0a0a" }}
              className="text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              Browse Tools
            </Link>
            <Link
              href="/blog"
              style={{
                border: "1px solid #374151",
                color: "#ffffff",
              }}
              className="text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
            >
              Read Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tools — white background */}
      {tools.length > 0 && (
        <section style={{ backgroundColor: "#ffffff" }} className="py-14 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <p style={{ color: "#6b7280" }} className="text-xs font-semibold uppercase tracking-widest">
                Popular Tools
              </p>
            </div>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: "#111827" }} className="text-2xl font-bold">
                The #1 destination for finding the right AI & Dev tools
              </h2>
              <Link
                href="/tools"
                style={{ color: "#2563eb" }}
                className="text-sm font-medium hover:underline whitespace-nowrap ml-4"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {tools.map((tool: {
                _id: string;
                name?: string;
                slug?: { current?: string };
                tagline?: string;
                logo?: object;
                category?: string;
              }) => (
                <Link
                  key={tool._id}
                  href={`/tools/${tool.slug?.current}`}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                  }}
                  className="rounded-lg p-4 hover:shadow-md transition-shadow block"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <ToolLogo logo={tool.logo} name={tool.name ?? ""} size={40} />
                    <div>
                      <h3 style={{ color: "#111827" }} className="font-semibold text-sm">
                        {tool.name}
                      </h3>
                      {tool.category && (
                        <span
                          style={{
                            backgroundColor: "#f3f4f6",
                            color: "#6b7280",
                          }}
                          className="text-xs px-2 py-0.5 rounded-full"
                        >
                          {tool.category}
                        </span>
                      )}
                    </div>
                  </div>
                  {tool.tagline && (
                    <p style={{ color: "#6b7280" }} className="text-xs mt-1 line-clamp-2">
                      {tool.tagline}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories — light gray background */}
      {categories.length > 0 && (
        <section style={{ backgroundColor: "#f9fafb" }} className="py-14 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: "#111827" }} className="text-2xl font-bold">
                Popular Categories
              </h2>
              <Link
                href="/category"
                style={{ color: "#2563eb" }}
                className="text-sm font-medium hover:underline"
              >
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug?.current}`}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                  }}
                  className="rounded-lg p-4 hover:shadow-md transition-shadow block"
                >
                  <h3 style={{ color: "#111827" }} className="font-semibold text-sm">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p style={{ color: "#6b7280" }} className="text-xs mt-1 line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                  <span style={{ color: "#2563eb" }} className="text-xs mt-3 inline-block">
                    Explore →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles — white background */}
      {articles.length > 0 && (
        <section style={{ backgroundColor: "#ffffff" }} className="py-14 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: "#111827" }} className="text-2xl font-bold">
                Latest from Blog
              </h2>
              <Link
                href="/blog"
                style={{ color: "#2563eb" }}
                className="text-sm font-medium hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {articles.map((article: {
                _id: string;
                title?: string;
                slug?: { current?: string };
                section?: string;
                publishedAt?: string;
                author?: string;
              }) => (
                <Link
                  key={article._id}
                  href={`/blog/${article.slug?.current}`}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                  }}
                  className="rounded-lg p-5 hover:shadow-md transition-shadow block"
                >
                  {article.section && (
                    <span style={{ color: "#2563eb" }} className="text-xs font-semibold uppercase tracking-wide">
                      {article.section}
                    </span>
                  )}
                  <h3 style={{ color: "#111827" }} className="font-semibold mt-1 text-sm leading-snug">
                    {article.title}
                  </h3>
                  <div style={{ color: "#9ca3af" }} className="text-xs mt-2 flex gap-2">
                    {article.author && <span>By {article.author}</span>}
                    {article.publishedAt && (
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About blurb — light gray */}
      <section style={{ backgroundColor: "#f9fafb" }} className="py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 style={{ color: "#111827" }} className="text-2xl font-bold mb-4">
            Welcome to ToolsAQ!
          </h2>
          <p style={{ color: "#6b7280" }} className="text-sm leading-relaxed mb-3">
            ToolsAQ is your ultimate destination for discovering and comparing the best AI and developer tools.
            Whether you are looking for a coding assistant, an automation platform, or a no-code solution,
            we have got you covered with honest, hands-on reviews.
          </p>
          <p style={{ color: "#6b7280" }} className="text-sm leading-relaxed">
            Browse our curated collection, compare tools side by side, and find the perfect alternative
            to meet your needs — all for free, no sign-up required.
          </p>
        </div>
      </section>

      {/* FAQ — white background */}
      <section style={{ backgroundColor: "#ffffff" }} className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <p style={{ color: "#6b7280" }} className="text-xs font-semibold uppercase tracking-widest text-center mb-2">
            Everything you need to know
          </p>
          <h2 style={{ color: "#111827" }} className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What is ToolsAQ?",
                a: "ToolsAQ is a free directory of AI and developer tools. We provide honest reviews, comparisons, and guides to help you find the right tool faster.",
              },
              {
                q: "Do I need to sign up?",
                a: "No. ToolsAQ is completely free to use — no account required. Just browse, compare, and find the tools you need.",
              },
              {
                q: "How do you make money?",
                a: "We earn through affiliate partnerships and sponsored listings. Our editorial content is always independent and unbiased.",
              },
              {
                q: "Can I submit my tool?",
                a: "Yes! Use the Contact page to get in touch and we will review your submission.",
              },
              {
                q: "How often is the tool list updated?",
                a: "We update our listings regularly to ensure you always have access to the latest and best tools available.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                style={{ border: "1px solid #e5e7eb" }}
                className="rounded-lg p-5"
              >
                <p style={{ color: "#111827" }} className="font-semibold text-sm">
                  {faq.q}
                </p>
                <p style={{ color: "#6b7280" }} className="text-sm mt-2 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
          <p style={{ color: "#6b7280" }} className="text-sm text-center mt-8">
            Still have questions?{" "}
            <Link href="/contact" style={{ color: "#2563eb" }} className="hover:underline font-medium">
              Contact Our Team
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}