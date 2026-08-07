import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";

const ALL_ARTICLES_QUERY = defineQuery(`
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    section,
    publishedAt,
    "author": author->name,
    "authorPhoto": author->photo,
    featuredImage
  }
`);

export default async function BlogPage() {
    const { data: articles } = await sanityFetch({ query: ALL_ARTICLES_QUERY });

    return (
        <main className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-2">Blog</h1>
            <p className="text-gray-400 mb-8">
                Guides, reviews, comparisons and more.
            </p>

            {articles.length === 0 ? (
                <p className="text-gray-500">Abhi koi article publish nahi hua.</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {articles.map((article: {
                        _id: string;
                        title?: string;
                        slug?: { current?: string };
                        section?: string;
                        publishedAt?: string;
                        author?: string;
                        authorPhoto?: object;
                        featuredImage?: object;
                    }) => (
                        <Link
                            key={article._id}
                            href={`/blog/${article.slug?.current}`}
                            className="border rounded-lg overflow-hidden hover:shadow-md transition block"
                        >
                            {article.featuredImage && (
                                <div className="relative w-full h-48">
                                    <Image
                                        src={urlFor(article.featuredImage).width(800).height(400).url()}
                                        alt={article.title ?? ""}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-5">
                                {article.section && (
                                    <span className="text-xs text-blue-500 uppercase tracking-wide font-medium">
                                        {article.section}
                                    </span>
                                )}
                                <h2 className="text-xl font-semibold mt-1">{article.title}</h2>
                                <div className="text-xs text-gray-500 mt-3 flex items-center gap-3">
                                    {article.authorPhoto && (
                                        <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                                            <Image
                                                src={urlFor(article.authorPhoto).width(48).height(48).url()}
                                                alt={article.author ?? ""}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
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
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}