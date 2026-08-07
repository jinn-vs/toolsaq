import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/studio",
                    "/studio/",
                    "/go/",
                    "/api/",
                ],
            },
        ],
        sitemap: "https://toolsaq.com/sitemap.xml",
    };
}