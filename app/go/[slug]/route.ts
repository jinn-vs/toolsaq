import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";

const TOOL_WEBSITE_QUERY = defineQuery(`
  *[_type == "software" && slug.current == $slug][0] {
    website,
    name
  }
`);

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const tool = await client.fetch(TOOL_WEBSITE_QUERY, { slug });

        if (!tool?.website) {
            return NextResponse.redirect(new URL("/tools", request.url));
        }

        // Click log (console me abhi, baad me database me save karenge)
        console.log(`[CLICK] ${tool.name} | ${slug} | ${new Date().toISOString()}`);

        // Affiliate URL pe redirect
        return NextResponse.redirect(tool.website, { status: 302 });
    } catch (error) {
        console.error("Go route error:", error);
        return NextResponse.redirect(new URL("/tools", request.url));
    }
}