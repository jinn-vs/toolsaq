import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
    title: "Terms of Service",
    description:
        "Read ToolsAQ's terms of service — the rules and guidelines for using our platform.",
    path: "/terms",
});

export default function TermsPage() {
    return (
        <main style={{ backgroundColor: "#ffffff" }}>
            <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-black text-white mb-4">
                        Terms of Service
                    </h1>
                    <p style={{ color: "#9ca3af" }}>
                        Last updated:{" "}
                        {new Date().toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </section>

            <section className="px-4 py-14">
                <div className="max-w-3xl mx-auto space-y-8">
                    {[
                        {
                            title: "1. Acceptance of Terms",
                            content:
                                "By accessing and using ToolsAQ, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our site.",
                        },
                        {
                            title: "2. Use of Content",
                            content:
                                "All content on ToolsAQ including reviews, comparisons, guides, and tool listings is for informational purposes only. You may not reproduce, distribute, or commercially exploit any content without prior written permission.",
                        },
                        {
                            title: "3. Affiliate Disclaimer",
                            content:
                                "ToolsAQ participates in affiliate programs. Some links on our site are affiliate links, meaning we may earn a commission if you click and make a purchase. This does not affect our editorial independence or the price you pay.",
                        },
                        {
                            title: "4. Accuracy of Information",
                            content:
                                "We strive to keep all tool listings, reviews, and comparisons accurate and up to date. However, software products change frequently. We recommend verifying details directly with the tool provider before making any purchasing decisions.",
                        },
                        {
                            title: "5. Third-Party Links",
                            content:
                                "ToolsAQ contains links to third-party websites. We are not responsible for the content, privacy practices, or accuracy of any third-party sites. Visiting external links is at your own risk.",
                        },
                        {
                            title: "6. Limitation of Liability",
                            content:
                                "ToolsAQ is provided on an 'as is' basis. We make no warranties regarding the accuracy or completeness of information on this site. We shall not be liable for any damages arising from your use of this site or reliance on its content.",
                        },
                        {
                            title: "7. Changes to Terms",
                            content:
                                "We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated date. Continued use of ToolsAQ after changes constitutes acceptance of the revised terms.",
                        },
                        {
                            title: "8. Contact",
                            content:
                                "If you have any questions about these Terms of Service, please contact us at contact@toolsaq.com.",
                        },
                    ].map((section) => (
                        <div key={section.title}>
                            <h2 style={{ color: "#111827" }} className="text-lg font-bold mb-3">
                                {section.title}
                            </h2>
                            <p style={{ color: "#6b7280" }} className="text-sm leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}