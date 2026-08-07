import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
    title: "Privacy Policy",
    description:
        "Read ToolsAQ's privacy policy — how we collect, use, and protect your information.",
    path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
    return (
        <main style={{ backgroundColor: "#ffffff" }}>
            <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-black text-white mb-4">
                        Privacy Policy
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
                            title: "1. Information We Collect",
                            content:
                                "ToolsAQ does not require you to create an account or provide personal information to use our site. We may collect anonymous usage data (pages visited, time on site) through analytics tools to improve our service.",
                        },
                        {
                            title: "2. Cookies",
                            content:
                                "We use cookies to understand how visitors interact with our site. These are anonymous and do not identify you personally. You can disable cookies in your browser settings at any time.",
                        },
                        {
                            title: "3. Affiliate Links",
                            content:
                                "Some links on ToolsAQ are affiliate links. When you click these links and make a purchase or sign up, we may earn a commission at no additional cost to you. Affiliate links are clearly indicated throughout the site.",
                        },
                        {
                            title: "4. Third-Party Services",
                            content:
                                "We may use third-party services such as Google Analytics for usage tracking. These services have their own privacy policies. We do not sell or share your data with third parties for marketing purposes.",
                        },
                        {
                            title: "5. Data Security",
                            content:
                                "We take reasonable measures to protect any information collected. However, no method of transmission over the internet is 100% secure. We encourage you to use secure networks when browsing.",
                        },
                        {
                            title: "6. Changes to This Policy",
                            content:
                                "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of ToolsAQ after changes constitutes acceptance of the new policy.",
                        },
                        {
                            title: "7. Contact",
                            content:
                                "If you have any questions about this Privacy Policy, please contact us at contact@toolsaq.com.",
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