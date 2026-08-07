import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type Props = {
    logo?: object;
    name?: string;
    size?: number;
};

export default function ToolLogo({ logo, name, size = 40 }: Props) {
    if (!logo) {
        return (
            <div
                className="rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 font-bold text-white uppercase"
                style={{ width: size, height: size, fontSize: size * 0.4 }}
            >
                {name?.charAt(0) ?? "?"}
            </div>
        );
    }

    return (
        <div
            className="rounded-full overflow-hidden flex-shrink-0 bg-white"
            style={{ width: size, height: size }}
        >
            <Image
                src={urlFor(logo).width(size * 2).height(size * 2).format("png").url()}
                alt={name ?? ""}
                width={size * 2}
                height={size * 2}
                className="object-contain w-full h-full"
            />
        </div>
    );
}