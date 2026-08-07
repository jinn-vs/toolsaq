import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
    title: "Write for Us",
    description:
        "Contribute to ToolsAQ — share your expertise on AI and developer tools with thousands of developers.",
    path: "/write-for-us",
});

export default function WriteForUsPage() {
    return (
        <main style={{ backgroundColor: "#ffffff" }}>
            <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-black text-white mb-4">
                        Write for ToolsAQ
                    </h1>
                    <p style={{ color: "#9ca3af" }} className="text-lg">
                        Share your expertise with thousands of developers and tech teams.
                    </p>
                </div>
            </section>

            <section className="px-4 py-14">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div>
                        <h2 style={{ color: "#111827" }} className="text-xl font-bold mb-3">
                            Why Write for Us?
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                {
                                    title: "Reach Developers",
                                    desc: "Your article will be read by developers and tech teams from US and UK.",
                                },
                                {
                                    title: "Build Authority",
                                    desc: "Get a byline with your name, photo, and bio on every article you write.",
                                },
                                {
                                    title: "DoFollow Backlink",
                                    desc: "Every accepted article includes a dofollow backlink to your site or profile.",
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    style={{ border: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}
                                    className="rounded-lg p-5"
                                >
                                    <h3 style={{ color: "#111827" }} className="font-semibold text-sm mb-2">
                                        {item.title}
                                    </h3>
                                    <p style={{ color: "#6b7280" }} className="text-xs leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 style={{ color: "#111827" }} className="text-xl font-bold mb-3">
                            What We Accept
                        </h2>
                        <ul className="space-y-2">
                            {[
                                "In-depth tool reviews (hands-on, with screenshots)",
                                "AI & developer tool comparisons",
                                "Guides and tutorials for developers",
                                "Alternatives roundups (e.g. Best X alternatives)",
                                "Opinion pieces on AI/dev tooling trends",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#374151" }}>
                                    <span style={{ color: "#2563eb" }} className="mt-0.5">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 style={{ color: "#111827" }} className="text-xl font-bold mb-3">
                            Our Guidelines
                        </h2>
                        <ul className="space-y-2">
                            {[
                                "Minimum 1,000 words, ideally 1,500-2,500 words",
                                "Must be original — not published elsewhere",
                                "Include real screenshots and hands-on testing",
                                "No promotional or AI-generated content",
                                "Include a short author bio and photo",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#374151" }}>
                                    <span style={{ color: "#6b7280" }} className="mt-0.5">→</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div
                        style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
                        className="rounded-lg p-6"
                    >
                        <h2 style={{ color: "#111827" }} className="text-lg font-bold mb-2">
                            Ready to contribute?
                        </h2>
                        <p style={{ color: "#6b7280" }} className="text-sm mb-4">
                            Send us your article idea or a draft to get started. We typically
                            respond within 2-3 business days.
                        </p>

                        <a
                            href="mailto:contact@toolsaq.com?subject=Write for ToolsAQ"
                            style={{ backgroundColor: "#111827", color: "#ffffff" }}
                            className="text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors inline-block"
                        >
                            Submit Your Pitch →
                        </a>
                    </div>
                </div>
            </section>
        </main >
    );
}