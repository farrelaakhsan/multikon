import { ImageOff } from "lucide-react";
import { FALLBACK_IMAGE } from "../../utils/format";

export default function ProductImage({ src, alt, className }) {
    return (
        <div className={`relative ${className ?? ""}`}>
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextSibling.style.display = "flex";
                    }}
                />
            ) : null}
            <div
                className={`absolute inset-0 items-center justify-center bg-slate-100 text-slate-300 ${
                    src ? "hidden" : "flex"
                }`}
            >
                <ImageOff className="w-1/3 h-1/3" strokeWidth={1.5} />
            </div>
        </div>
    );
}
