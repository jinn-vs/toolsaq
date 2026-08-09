import { MetadataRoute } from "next";
import { adminClient } from "@/lib/supabase/admin";

const baseUrl = "https://toolsaq.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [
        { data: tools },
        { data: articles },
        { data: categories },
        { data: comparisons },
    ] = await Promise.all([
        adminClient.from("tools").select("slug, updated_at"),
        adminClient.from("articles").select("slug, updated_at").eq("is_published", true),
        adminClient.from("categories").select("slug, updated_at"),
        adminClient.from("comparisons").select("slug, updated_at").eq("is_published", true),
    ]);

    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
        { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: `${baseUrl}/category`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/compare/all`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/write-for-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
        { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ];

    const toolPages: MetadataRoute.Sitemap = (tools ?? []).flatMap((t) => [
        { url: `${baseUrl}/tools/${t.slug}`, lastModified: new Date(t.updated_at ?? Date.now()), changeFrequency: "weekly" as const, priority: 0.8 },
        { url: `${baseUrl}/alternatives/${t.slug}`, lastModified: new Date(t.updated_at ?? Date.now()), changeFrequency: "weekly" as const, priority: 0.7 },
    ]);

    const articlePages: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
        url: `${baseUrl}/blog/${a.slug}`,
        lastModified: new Date(a.updated_at ?? Date.now()),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
        url: `${baseUrl}/category/${c.slug}`,
        lastModified: new Date(c.updated_at ?? Date.now()),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    const comparisonPages: MetadataRoute.Sitemap = (comparisons ?? []).map((c) => ({
        url: `${baseUrl}/compare/${c.slug}`,
        lastModified: new Date(c.updated_at ?? Date.now()),
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    return [...staticPages, ...toolPages, ...articlePages, ...categoryPages, ...comparisonPages];
}