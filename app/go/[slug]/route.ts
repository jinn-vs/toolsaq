import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const { data: tool } = await adminClient
            .from("tools")
            .select("id, name, website")
            .eq("slug", slug)
            .single();

        if (!tool?.website) {
            return NextResponse.redirect(new URL("/tools", request.url));
        }

        // Click track
        await adminClient
            .from("clicks")
            .insert({ tool_id: tool.id, tool_slug: slug });

        return NextResponse.redirect(tool.website, { status: 302 });
    } catch {
        return NextResponse.redirect(new URL("/tools", request.url));
    }
}