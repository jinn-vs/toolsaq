export default function Footer() {
    return (
        <footer className="border-t mt-16">
            <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-gray-500 flex justify-between">
                <span>© {new Date().getFullYear()} ToolsAQ. All rights reserved.</span>
                <div className="flex gap-4">
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                    <a href="/privacy-policy">Privacy</a>
                </div>
            </div>
        </footer>
    );
}