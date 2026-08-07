import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_SOFTWARE_QUERY } from "@/sanity/lib/queries";

export default async function ToolsPage() {
  const { data: items } = await sanityFetch({ query: ALL_SOFTWARE_QUERY });

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">All Tools</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">
          Abhi koi tool listed nahi hai.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link
              key={item._id}
              href={`/tools/${item.slug?.current}`}
              className="border rounded-lg p-4 hover:shadow-md transition block"
            >
              <h2 className="text-lg font-semibold">{item.name}</h2>
              {item.category && (
                <span className="text-xs text-gray-500">{item.category}</span>
              )}
              {item.tagline && (
                <p className="text-sm text-gray-400 mt-2">{item.tagline}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}