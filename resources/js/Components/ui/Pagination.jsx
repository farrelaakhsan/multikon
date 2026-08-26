import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
            {links.map((link, i) => {
                if (link.url) {
                    return (
                        <Link
                            key={i}
                            href={link.url}
                            className={[
                                "min-w-[36px] h-9 flex items-center justify-center rounded-pill text-xs font-semibold border transition",
                                link.active
                                    ? "bg-brand-900 text-white border-brand-900 shadow-sm"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300",
                            ].join(" ")}
                        >
                            {link.label.includes("Previous") ? (
                                <ChevronLeft className="w-4 h-4" />
                            ) : link.label.includes("Next") ? (
                                <ChevronRight className="w-4 h-4" />
                            ) : (
                                link.label
                            )}
                        </Link>
                    );
                }
                return (
                    <span
                        key={i}
                        className="min-w-[36px] h-9 flex items-center justify-center rounded-pill text-xs font-semibold border border-slate-100 text-slate-300 cursor-not-allowed"
                    >
                        {link.label.includes("Previous") ? (
                            <ChevronLeft className="w-4 h-4" />
                        ) : link.label.includes("Next") ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            link.label
                        )}
                    </span>
                );
            })}
        </div>
    );
}
