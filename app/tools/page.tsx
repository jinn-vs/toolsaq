import Link from "next/link";
import Image from "next/image";
import { getAllCategories } from "@/lib/supabase/queries";
import { adminClient } from "@/lib/supabase/admin";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import ToolsSearch from "@/components/ToolsSearch";
import { Suspense } from "react";

export const revalidate = 3600;

export const metadata: Metadata = generatePageMetadata({
  title: "Browse AI & Developer Tools",
  description: "Browse and compare the best AI and developer tools. Find reviews, alternatives and comparisons.",
  path: "/tools",
});

type SearchParams = {
  q?: string;
  category?: string;
  sort?: string;
};

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q, category, sort } = await searchParams;
  const categories = await getAllCategories();

  // Server side query build
  let query = adminClient
    .from("tools")
    .select("*, category:categories(id, name, slug)")

  // Search filter
  if (q) {
    query = query.or(`name.ilike.%${q}%,tagline.ilike.%${q}%`)
  }

  // Category filter
  if (category) {
    const cat = categories.find((c) => c.slug === category)
    if (cat) {
      query = query.eq("category_id", cat.id)
    }
  }

  // Sort
  if (sort === "newest") {
    query = query.order("created_at", { ascending: false })
  } else {
    query = query.order("name", { ascending: true })
  }

  const { data: tools } = await query

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://toolsaq.com" },
      { "@type": "ListItem", position: 2, name: "Tools", item: "https://toolsaq.com/tools" },
    ],
  };

  return (
    <main style={{ backgroundColor: "#ffffff" }}>
      <JsonLd data={breadcrumbSchema} />

      {/* Hero */}
      <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">All Tools</h1>
          <p style={{ color: "#9ca3af" }} className="text-sm">
            {tools?.length ?? 0} AI and developer tools
            {q && ` matching "${q}"`}
          </p>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="max-w-6xl mx-auto flex gap-8">

          {/* Sidebar */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            {/* Search */}
            <div className="mb-6">
              <h2 style={{ color: "#111827" }} className="font-semibold text-sm mb-2">
                Search
              </h2>
              <Suspense>
                <ToolsSearch placeholder="Search tools..." />
              </Suspense>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h2 style={{ color: "#111827" }} className="font-semibold text-sm mb-2">
                Sort by
              </h2>
              <div className="space-y-1">
                {[
                  { label: "Name", value: "name" },
                  { label: "Newest", value: "newest" },
                ].map((option) => (
                  <Link
                    key={option.value}
                    href={`/tools?${new URLSearchParams({ ...(q ? { q } : {}), ...(category ? { category } : {}), sort: option.value }).toString()}`}
                    style={{
                      color: sort === option.value || (!sort && option.value === "name") ? "#2563eb" : "#6b7280",
                      backgroundColor: sort === option.value || (!sort && option.value === "name") ? "#eff6ff" : "transparent",
                    }}
                    className="block text-sm px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div>
                <h2 style={{ color: "#111827" }} className="font-semibold text-sm mb-2">
                  Categories
                </h2>
                <div className="space-y-1">
                  <Link
                    href={`/tools?${new URLSearchParams({ ...(q ? { q } : {}), ...(sort ? { sort } : {}) }).toString()}`}
                    style={{
                      color: !category ? "#2563eb" : "#6b7280",
                      backgroundColor: !category ? "#eff6ff" : "transparent",
                    }}
                    className="block text-sm px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    All Categories
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/tools?${new URLSearchParams({ ...(q ? { q } : {}), ...(sort ? { sort } : {}), category: cat.slug }).toString()}`}
                      style={{
                        color: category === cat.slug ? "#2563eb" : "#6b7280",
                        backgroundColor: category === cat.slug ? "#eff6ff" : "transparent",
                      }}
                      className="block text-sm px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Tools Grid */}
          <div className="flex-1">
            {!tools || tools.length === 0 ? (
              <div className="text-center py-12">
                <p style={{ color: "#6b7280" }} className="text-sm">
                  {q ? `No tools found for "${q}"` : "No tools listed yet."}
                </p>
                {q && (
                  <Link
                    href="/tools"
                    style={{ color: "#2563eb" }}
                    className="text-sm hover:underline mt-2 inline-block"
                  >
                    Clear search
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <div>
                        <h3 style={{ color: "#111827" }} className="font-semibold text-sm">
                          {tool.name}
                        </h3>
                        {tool.category && (
                          <span
                            style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}
                            className="text-xs px-2 py-0.5 rounded-full"
                          >
                            {tool.category.name}
                          </span>
                        )}
                      </div>
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
        </div>
      </section>
    </main>
  );
}