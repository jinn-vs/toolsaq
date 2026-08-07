import type { Metadata } from "next";

const baseUrl = "https://toolsaq.com";

export const siteMetadata = {
    name: "ToolsAQ",
    description:
        "Discover, compare and review the best AI and developer tools. Honest reviews, comparisons and guides for developers and tech teams.",
    url: baseUrl,
    ogImage: `${baseUrl}/og-image.png`,
    twitterHandle: "@toolsaq",
};

export function generatePageMetadata({
    title,
    description,
    path = "",
    ogImage,
}: {
    title: string;
    description: string;
    path?: string;
    ogImage?: string;
}): Metadata {
    const url = `${baseUrl}${path}`;
    const image = ogImage ?? siteMetadata.ogImage;

    return {
        title: `${title} | ${siteMetadata.name}`,
        description,
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: `${title} | ${siteMetadata.name}`,
            description,
            url,
            siteName: siteMetadata.name,
            images: [{ url: image, width: 1200, height: 630 }],
            type: "website",
            locale: "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | ${siteMetadata.name}`,
            description,
            images: [image],
            creator: siteMetadata.twitterHandle,
        },
    };
}