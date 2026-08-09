import Link from "next/link";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
    title: "About Us",
    description:
        "Learn about ToolsAQ — a free directory of AI and developer tools built by developers, for developers.",
    path: "/about",
});

export default function AboutPage() {
    return (
        <main style={{ backgroundColor: "#ffffff" }}>
            <section style={{ backgroundColor: "#0a0a0a" }} className="px-4 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-black text-white mb-4">
                        About ToolsAQ
                    </h1>
                    <p style={{ color: "#9ca3af" }} className="text-lg">
                        We help developers and tech teams discover the best AI and developer tools — honestly.
                    </p>
                </div>
            </section>

            <section className="px-4 py-14">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div>
                        <h2 style={{ color: "#111827" }} className="text-xl font-bold mb-3">
                            Our Mission
                        </h2>
                        <p style={{ color: "#6b7280" }} className="text-sm leading-relaxed">
                            The AI and developer tools space is exploding — hundreds of new tools launch every month.
                            Finding the right one is overwhelming. ToolsAQ exists to cut through the noise with
                            honest, hands-on reviews and clear comparisons so you can make smarter decisions faster.
                        </p>
                    </div>

                    <div>
                        <h2 style={{ color: "#111827" }} className="text-xl font-bold mb-3">
                            Who We Are
                        </h2>
                        <p style={{ color: "#6b7280" }} className="text-sm leading-relaxed">
                            ToolsAQ is built by developers, for developers. Our team has hands-on experience
                            with AI/ML workflows, software engineering, and modern dev tooling. Every review
                            on this site is based on real usage — not just marketing copy.
                        </p>
                    </div>

                    <div>
                        <h2 style={{ color: "#111827" }} className="text-xl font-bold mb-3">
                            How We Make Money
                        </h2>
                        <p style={{ color: "#6b7280" }} className="text-sm leading-relaxed">
                            ToolsAQ earns through affiliate partnerships and sponsored listings. When you click
                            "Visit Website" and sign up for a tool, we may earn a commission at no extra cost
                            to you. Sponsored tools are clearly marked. Our editorial opinions are always
                            independent and unbiased.
                        </p>
                    </div>

                    <div>
                        <h2 style={{ color: "#111827" }} className="text-xl font-bold mb-3">
                            Our Editorial Standards
                        </h2>
                        <p style={{ color: "#6b7280" }} className="text-sm leading-relaxed">
                            Every tool we review is tested hands-on by our team. We include real screenshots,
                            genuine pros and cons, and honest verdicts. We never accept payment to change
                            our editorial ratings or reviews.
                        </p>
                    </div>

                    <div
                        style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
                        className="rounded-lg p-6"
                    >
                        <h2 style={{ color: "#111827" }} className="text-lg font-bold mb-2">
                            Want to get listed?
                        </h2>
                        <p style={{ color: "#6b7280" }} className="text-sm mb-4">
                            If you have an AI or developer tool you would like featured on ToolsAQ,
                            get in touch with our team.
                        </p>
                        <Link
                            href="/contact"
                            style={{ backgroundColor: "#111827", color: "#ffffff" }}
                            className="text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors inline-block"
                        >
                            Contact Us →
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
