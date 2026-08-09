import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

// Force Next.js to render this page dynamically on every request (SSR)
export const dynamic = "force-dynamic";

interface PageProps {
    params: {
        id: string;
    };
}

interface Category {
    id: string;
    name?: string;
    slug?: string;
    created_at?: string;
}

export default async function CategoryPage({ params }: PageProps) {
    const { id } = params;

    let categoryData: Category = {
        id,
        name: "Category Not Found",
    };

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .eq("id", id)
            .single();

        if (!error && data) {
            categoryData = data;
        }
    } catch (err) {
        console.error("Server-side fetch error (Category):", err);
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-800">Category Details</h1>
                <Link
                    href="/admin/dashboard/categories"
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded transition"
                >
                    ← Back to Categories
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg p-6 border space-y-4">
                <div>
                    <span className="text-xs text-gray-400 block uppercase font-mono">ID</span>
                    <p className="text-sm font-mono text-gray-600">{categoryData.id}</p>
                </div>

                <div>
                    <span className="text-xs text-gray-400 block uppercase font-mono">Name</span>
                    <p className="text-lg font-medium text-gray-900">{categoryData.name || "N/A"}</p>
                </div>

                {categoryData.slug && (
                    <div>
                        <span className="text-xs text-gray-400 block uppercase font-mono">Slug</span>
                        <p className="text-sm font-mono text-gray-700">{categoryData.slug}</p>
                    </div>
                )}
            </div>
        </div>
    );
}