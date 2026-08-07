import Link from "next/link";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
    title: "Contact Us",
    description:
        "Get in touch with ToolsAQ — submit your tool, write for us, or ask about partnership opportunities.",
    path: "/contact",
});

export default function ContactPage() {
    return (
        <main style={{ backgroundColor: "#ffffff" }}>
            <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-black text-white mb-4">
                        Contact Us
                    </h1>
                    <p style={{ color: "#9ca3af" }} className="text-lg">
                        Have a question, partnership inquiry, or want to get your tool listed?
                    </p>
                </div>
            </section>

            <section className="px-4 py-14">
                <div className="max-w-3xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                        {[
                            {
                                title: "Get Listed",
                                desc: "Want your AI or developer tool featured on ToolsAQ? Submit your tool for review.",
                                cta: "Submit Tool",
                                href: "mailto:contact@toolsaq.com?subject=Get Listed",
                            },
                            {
                                title: "Write for Us",
                                desc: "Are you a developer or tech writer? Contribute a guest article to ToolsAQ.",
                                cta: "Learn More",
                                href: "/write-for-us",
                            },
                            {
                                title: "Partnerships",
                                desc: "Interested in sponsorship or affiliate partnership opportunities?",
                                cta: "Get in Touch",
                                href: "mailto:contact@toolsaq.com?subject=Partnership",
                            },
                            {
                                title: "General Enquiry",
                                desc: "Any other questions or feedback? We would love to hear from you.",
                                cta: "Send Email",
                                href: "mailto:contact@toolsaq.com",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                style={{ border: "1px solid #e5e7eb" }}
                                className="rounded-lg p-6"
                            >
                                <h2 style={{ color: "#111827" }} className="font-bold mb-2">
                                    {item.title}
                                </h2>
                                <p style={{ color: "#6b7280" }} className="text-sm mb-4 leading-relaxed">
                                    {item.desc}
                                </p>
                                <Link
                                    href={item.href}
                                    style={{ backgroundColor: "#111827", color: "#ffffff" }}
                                    className="text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-800 transition-colors inline-block"
                                >
                                    {item.cta} →
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div
                        style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
                        className="rounded-lg p-6 text-center"
                    >
                        <p style={{ color: "#6b7280" }} className="text-sm mb-2">
                            Prefer to email directly?
                        </p>
                        <a
                            href="mailto:contact@toolsaq.com"
                            style={{ color: "#2563eb" }}
                            className="font-semibold hover:underline"
                        >
                            contact@toolsaq.com
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}