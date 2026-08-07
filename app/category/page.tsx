import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_CATEGORIES_QUERY } from "@/sanity/lib/queries";

export default async function CategoriesPage() {
    const { data: categories } = await sanityFetch({ query: ALL_CATEGORIES_QUERY });

    return (
        <main className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-2">Browse by Category</h1>
            <p className="text-gray-400 mb-8">
                Explore AI and developer tools organized by category.
            </p>

            {categories.length === 0 ? (
                <p className="text-gray-500">Abhi koi category nahi hai.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat._id}
                            href={`/category/${cat.slug?.current}`}
                            className="border rounded-lg p-5 hover:shadow-md transition block"
                        >
                            <h2 className="text-lg font-semibold">{cat.name}</h2>
                            {cat.description && (
                                <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                                    {cat.description}
                                </p>
                            )}
                            <span className="text-xs text-blue-500 mt-3 inline-block">
                                Explore →
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}