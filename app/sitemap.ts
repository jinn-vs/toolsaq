import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";

const baseUrl = "https://toolsaq.com";

const ALL_SLUGS_QUERY = defineQuery(`{
  "software": *[_type == "software"]{ "slug": slug.current },
  "articles": *[_type == "article"]{ "slug": slug.current },
  "categories": *[_type == "category"]{ "slug": slug.current },
  "comparisons": *[_type == "comparison"]{ "slug": slug.current }
}`);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const data = await client.fetch(ALL_SLUGS_QUERY);

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/tools`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/category`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/compare/all`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/write-for-us`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
        },
    ];

    const toolPages: MetadataRoute.Sitemap = data.software
        .filter((s: { slug: string }) => s.slug)
        .flatMap((s: { slug: string }) => [
            {
                url: `${baseUrl}/tools/${s.slug}`,
                lastModified: new Date(),
                changeFrequency: "weekly" as const,
                priority: 0.8,
            },
            {
                url: `${baseUrl}/alternatives/${s.slug}`,
                lastModified: new Date(),
                changeFrequency: "weekly" as const,
                priority: 0.7,
            },
        ]);

    const articlePages: MetadataRoute.Sitemap = data.articles
        .filter((a: { slug: string }) => a.slug)
        .map((a: { slug: string }) => ({
            url: `${baseUrl}/blog/${a.slug}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        }));

    const categoryPages: MetadataRoute.Sitemap = data.categories
        .filter((c: { slug: string }) => c.slug)
        .map((c: { slug: string }) => ({
            url: `${baseUrl}/category/${c.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));

    const comparisonPages: MetadataRoute.Sitemap = data.comparisons
        .filter((c: { slug: string }) => c.slug)
        .map((c: { slug: string }) => ({
            url: `${baseUrl}/compare/${c.slug}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        }));

    return [
        ...staticPages,
        ...toolPages,
        ...articlePages,
        ...categoryPages,
        ...comparisonPages,
    ];
}