import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";

const ALL_COMPARISONS_QUERY = defineQuery(`
  *[_type == "comparison"] | order(publishedAt desc) {
    _id,
    slug,
    publishedAt,
    "productA": productA-> {
      name,
      slug,
      logo
    },
    "productB": productB-> {
      name,
      slug,
      logo
    }
  }
`);

export default async function ComparisonsPage() {
    const { data: comparisons } = await sanityFetch({ query: ALL_COMPARISONS_QUERY });

    return (
        <main className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-2">Compare Tools</h1>
            <p className="text-gray-400 mb-8">
                Side-by-side comparisons of popular AI and developer tools.
            </p>

            {comparisons.length === 0 ? (
                <p className="text-gray-500">Abhi koi comparison publish nahi hua.</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {comparisons.map((comp: {
                        _id: string;
                        slug?: { current?: string };
                        publishedAt?: string;
                        productA?: { name?: string; slug?: { current?: string }; logo?: object };
                        productB?: { name?: string; slug?: { current?: string }; logo?: object };
                    }) => (
                        <Link
                            key={comp._id}
                            href={`/compare/${comp.slug?.current}`}
                            className="border rounded-lg p-5 hover:shadow-md transition block"
                        >
                            <div className="flex items-center gap-4">
                                {comp.productA?.logo && (
                                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            src={urlFor(comp.productA.logo).width(80).height(80).url()}
                                            alt={comp.productA.name ?? ""}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                )}
                                <span className="font-semibold text-lg">
                                    {comp.productA?.name}
                                </span>
                                <span className="text-gray-500 font-bold">VS</span>
                                <span className="font-semibold text-lg">
                                    {comp.productB?.name}
                                </span>
                                {comp.productB?.logo && (
                                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            src={urlFor(comp.productB.logo).width(80).height(80).url()}
                                            alt={comp.productB.name ?? ""}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                            {comp.publishedAt && (
                                <p className="text-xs text-gray-500 mt-3">
                                    {new Date(comp.publishedAt).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}