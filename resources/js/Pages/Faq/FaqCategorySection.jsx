import FAQ_CATEGORIES from "../../data/faqData.jsx";

export default function FaqCategorySection({ openItems, toggleItem }) {
    return (
        <section className="bg-white py-16 md:py-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-14">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F59E0B] mb-3">
                        Kategori
                    </p>
                    <h2 className="text-3xl font-black text-[#1E293B]">
                        Yang Perlu Anda Ketahui
                    </h2>
                    <div className="w-10 h-1 bg-[#F59E0B] rounded-full mx-auto mt-4" />
                </div>

                <div className="space-y-6">
                    {FAQ_CATEGORIES.map((category) => (
                        <div
                            key={category.id}
                            className="bg-[#1E293B] rounded-3xl overflow-hidden shadow-xl"
                        >
                            <div className="flex items-center gap-3 p-5 md:p-6 bg-[#1E293B] border-b border-white/5">
                                <span className="w-9 h-9 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center text-[#F59E0B] shrink-0">
                                    {category.icon}
                                </span>
                                <h3 className="text-base md:text-lg font-black text-white">
                                    {category.title}
                                </h3>
                                <span className="ml-auto text-[11px] font-bold text-slate-500 bg-white/5 px-2.5 py-1 rounded-full">
                                    {category.questions.length}
                                </span>
                            </div>

                            <div>
                                {category.questions.map((q, qIdx) => {
                                    const isOpen = openItems.has(q.id);
                                    const isLast = qIdx === category.questions.length - 1;

                                    return (
                                        <div
                                            key={q.id}
                                            className={
                                                "border-white/5 " +
                                                (isLast ? "" : "border-b")
                                            }
                                        >
                                            <button
                                                onClick={() => toggleItem(q.id)}
                                                className="w-full flex items-start gap-3 p-4 md:px-6 md:py-4 text-left transition hover:bg-white/[0.03] focus:outline-none"
                                            >
                                                <span
                                                    className={
                                                        "mt-0.5 w-5 h-5 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 " +
                                                        (isOpen
                                                            ? "bg-[#F59E0B] rotate-180"
                                                            : "bg-white/10")
                                                    }
                                                >
                                                    <svg
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        className="w-3 h-3 text-white"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </span>
                                                <span className="text-sm md:text-base font-bold text-white leading-snug pt-0.5">
                                                    {q.question}
                                                </span>
                                            </button>

                                            <div
                                                className={
                                                    "overflow-hidden transition-all duration-300 ease-in-out " +
                                                    (isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")
                                                }
                                            >
                                                <div className="px-4 md:px-6 pb-4 md:pb-5">
                                                    <div className="pl-8">
                                                        <div className="w-6 h-0.5 bg-[#F59E0B]/50 rounded-full mb-3" />
                                                        <p className="text-slate-300 text-sm leading-relaxed">
                                                            {q.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
