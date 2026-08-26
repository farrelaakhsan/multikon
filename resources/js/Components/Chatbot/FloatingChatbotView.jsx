import { usePage } from "@inertiajs/react";

/* ─── Icons ─────────────────────────────────────────────────────────── */

function BotIcon({ className = "h-5 w-5" }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            aria-hidden="true"
        >
            <rect
                x="3"
                y="8"
                width="18"
                height="13"
                rx="4"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M9 12h.01M15 12h.01"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path
                d="M9 16c.8.6 1.8.9 3 .9s2.2-.3 3-.9"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            <path
                d="M12 8V5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <circle cx="12" cy="4.5" r="1.2" fill="currentColor" />
            <path
                d="M7 8V6a2 2 0 012-2h6a2 2 0 012 2v2"
                stroke="currentColor"
                strokeWidth="1.8"
            />
        </svg>
    );
}

function MinIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path
                d="M4 10h12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function XIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function SendIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path
                d="M3 10l14-7-4 14-2.7-5.1L3 10Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/* ─── Sub-components ────────────────────────────────────────────────── */

function Avatar() {
    return (
        <div className="h-8 w-8 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-200">
            <BotIcon className="h-4 w-4" />
        </div>
    );
}

function TypingDots() {
    return (
        <div className="flex items-end gap-2 max-w-[88%]">
            <Avatar />
            <div className="rounded-3xl rounded-bl-md px-5 py-4 bg-white border border-slate-200 shadow-sm flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#F59E0B] dot-1" />
                <span className="h-2 w-2 rounded-full bg-[#F59E0B]/70 dot-2" />
                <span className="h-2 w-2 rounded-full bg-[#F59E0B]/40 dot-3" />
            </div>
        </div>
    );
}

function Message({ message, onShowSvg, activeSvg }) {
    const isBot = message.role === "assistant";
    const hasSvg = !!(isBot && message.svg);
    const isActive = hasSvg && activeSvg === message.svg;

    return (
        <div
            className={`w-full flex chatbot-message-enter ${isBot ? "justify-start" : "justify-end"}`}
        >
            {isBot ? (
                <div className="flex items-end gap-2 max-w-[88%]">
                    <Avatar />
                    <div>
                        <div className="rounded-3xl rounded-bl-md px-4 py-3 text-sm leading-6 whitespace-pre-wrap break-words bg-white text-slate-900 border border-slate-200 shadow-sm">
                            {message.text}
                        </div>
                        {hasSvg && (
                            <button
                                type="button"
                                onClick={() => onShowSvg(isActive ? "" : message.svg)}
                                className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition bg-white hover:bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]"
                            >
                                {isActive ? "✕ Tutup" : "📐 Sketsa"}
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="max-w-[82%] rounded-3xl rounded-br-md px-4 py-3 text-sm leading-6 whitespace-pre-wrap break-words bg-[#1E293B] text-white shadow-lg shadow-slate-300">
                    {message.text}
                </div>
            )}
        </div>
    );
}

/* ─── Main View ─────────────────────────────────────────────────────── */

export default function FloatingChatbotView({
    isOpen,
    onToggle,
    onMinimize,
    onClose,
    messages,
    inputValue,
    onInputChange,
    onSubmit,
    loading,
    svgPreview,
    onHideSvg,
    onShowSvg,
    activeSvg,
    messagesEndRef,
}) {
    const { props } = usePage();
    const appName = props.appName || "Multikon";

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-[9999] pointer-events-auto flex flex-col items-end gap-3">
            {/* Chat window */}
            {isOpen && (
                <div className="chatbot-window-enter w-[min(92vw,400px)] rounded-[1.75rem] border border-slate-200/80 bg-[#F8F9FA] shadow-2xl shadow-slate-300/40 overflow-hidden flex flex-col max-h-[75vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#1E293B] text-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-2xl bg-[#F59E0B] text-white flex items-center justify-center shadow-lg shadow-amber-900">
                                <BotIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#F59E0B]">
                                    Multikon
                                </p>
                                <h3 className="text-sm font-extrabold tracking-tight">
                                    Chatbot
                                </h3>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            {/* Online dot */}
                            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />

                            <button
                                type="button"
                                onClick={onMinimize}
                                className="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition flex items-center justify-center"
                                aria-label="Minimize"
                                title="Minimize — riwayat tetap tersimpan"
                            >
                                <MinIcon />
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="h-8 w-8 rounded-xl bg-white/10 hover:bg-red-500/80 text-white/80 hover:text-white transition flex items-center justify-center"
                                aria-label="Tutup"
                                title="Tutup"
                            >
                                <XIcon />
                            </button>
                        </div>
                    </div>

                    {/* Subtitle bar */}
                    <div className="px-4 py-2.5 bg-[#F59E0B]/10 border-b border-[#F59E0B]/20 shrink-0">
                        <p className="text-[11px] text-[#1E293B] font-semibold leading-relaxed">
                            💡 Tanya konsep produk, ukuran, material, atau
                            desain custom kitchen equipment.
                        </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F9FA] scroll-smooth">
                        {messages.map((msg) => (
                            <Message key={msg.id} message={msg} onShowSvg={onShowSvg} activeSvg={activeSvg} />
                        ))}
                        {loading && <TypingDots />}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* SVG Preview */}
                    {svgPreview && (
                        <div className="px-4 pt-3 shrink-0 border-t border-slate-200 bg-white">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F59E0B]">
                                    Sketsa Teknis
                                </p>
                                <button
                                    type="button"
                                    onClick={onHideSvg}
                                    className="text-[10px] font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest transition"
                                >
                                    Hide
                                </button>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-[#F8F9FA] p-2 overflow-auto max-h-40">
                                <div
                                    className="min-w-[280px]"
                                    dangerouslySetInnerHTML={{
                                        __html: svgPreview,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="px-3 pt-2 pb-1 bg-white border-t border-slate-200 shrink-0">
                        <form
                            onSubmit={onSubmit}
                            className="flex gap-2 items-center"
                        >
                            <textarea
                                rows="2"
                                value={inputValue}
                                onChange={(e) => onInputChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Contoh: buat meja kerja stainless 120×60 cm..."
                                className="flex-1 min-h-[44px] max-h-28 resize-none rounded-xl border border-slate-200 bg-[#F8F9FA] px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/20 leading-5 transition"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="shrink-0 h-10 w-10 rounded-xl bg-[#F59E0B] text-white hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-amber-200"
                            >
                                <SendIcon />
                            </button>
                        </form>
                        <p className="text-[9px] text-slate-400 text-center mt-0.5 tracking-wide">
                            Enter = kirim &nbsp;·&nbsp; Shift+Enter = baris baru
                        </p>
                    </div>
                </div>
            )}

            {/* Toggle button */}
            <button
                type="button"
                onClick={onToggle}
                className={[
                    "h-14 w-14 rounded-2xl bg-[#F59E0B] text-white shadow-2xl shadow-amber-300 flex items-center justify-center transition hover:scale-110 active:scale-95",
                    !isOpen ? "chatbot-toggle-pulse" : "",
                ].join(" ")}
                aria-label="Buka chatbot"
            >
                <BotIcon className="h-6 w-6" />
            </button>
        </div>
    );
}
