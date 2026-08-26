import { useState, useEffect, useRef, useCallback } from "react";
import { usePage } from "@inertiajs/react";

export default function FloatingAdminChat({ isOpen, onClose }) {
    const { props } = usePage();
    const user = props.auth?.user;

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [sinceId, setSinceId] = useState(0);
    const messagesEndRef = useRef(null);
    const pollRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (!isOpen) return;

        setSinceId(0);
        setMessages([]);

        fetch(`/chat/poll?since_id=0`, {
            headers: { Accept: "application/json", "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content },
        })
            .then((r) => r.json())
            .then((res) => {
                if (res.success && res.data.length > 0) {
                    setMessages(res.data);
                    setSinceId(res.data[res.data.length - 1].id);
                }
            })
            .catch(() => {});

        pollRef.current = setInterval(() => {
            setSinceId((prev) => {
                fetch(`/chat/poll?since_id=${prev}`, {
                    headers: { Accept: "application/json", "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content },
                })
                    .then((r) => r.json())
                    .then((res) => {
                        if (res.success && res.data.length > 0) {
                            setMessages((m) => [...m, ...res.data]);
                            setSinceId(res.data[res.data.length - 1].id);
                        }
                    })
                    .catch(() => {});
                return prev;
            });
        }, 7000);

        return () => {
            clearInterval(pollRef.current);
            pollRef.current = null;
        };
    }, [isOpen]);

    const handleSubmit = async () => {
        const text = inputValue.trim();
        if (!text || loading) return;

        setLoading(true);
        setInputValue("");

        const tempId = Date.now();
        setMessages((m) => [
            ...m,
            { id: tempId, message: text, sender_type: "user", created_at: new Date().toISOString() },
        ]);

        try {
            const res = await fetch("/chat/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({ message: text }),
            });

            const data = await res.json();
            if (data.success) {
                setMessages((m) =>
                    m.map((msg) =>
                        msg.id === tempId
                            ? { ...msg, id: data.data.id, created_at: data.data.created_at }
                            : msg
                    )
                );
                setSinceId((prev) => Math.max(prev, data.data.id));
            }
        } catch {
            setMessages((m) =>
                m.map((msg) =>
                    msg.id === tempId ? { ...msg, failed: true } : msg
                )
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay backdrop */}
            <div
                className="fixed inset-0 bg-black/30 z-[9998] transition-opacity"
                onClick={onClose}
            />

            {/* Chat Panel */}
            <div
                className={[
                    "fixed z-[9999] bg-white shadow-2xl flex flex-col transition-all duration-300 overflow-hidden",
                    expanded
                        ? "inset-4 rounded-2xl"
                        : "w-[400px] h-[600px] max-w-[92vw] max-h-[85vh] rounded-2xl bottom-4 right-4",
                ].join(" ")}
            >
                {/* Header */}
                <div className="shrink-0 bg-[#1E293B] rounded-t-2xl px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg bg-[#F59E0B] flex items-center justify-center">
                            <span className="text-[#1E293B] text-sm font-black">M</span>
                        </span>
                        <div>
                            <p className="text-white text-sm font-bold">Konsultasi Product Custom</p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                                Admin Multikon
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setExpanded((p) => !p)}
                            className="p-2 text-slate-400 hover:text-white transition rounded-lg hover:bg-white/10"
                            aria-label={expanded ? "Perkecil" : "Perbesar"}
                        >
                            {expanded ? (
                                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                                    <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                                    <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-white transition rounded-lg hover:bg-white/10"
                            aria-label="Tutup"
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8F9FA]">
                    {messages.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <span className="text-4xl mb-3">💬</span>
                            <p className="text-sm font-bold text-[#1E293B]">Mulai Konsultasi</p>
                            <p className="text-xs text-slate-400 mt-1 max-w-xs">
                                Kirim pesan untuk berkonsultasi tentang product custom stainless steel sesuai kebutuhan Anda.
                            </p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={[
                                "flex gap-3 max-w-[85%]",
                                msg.sender_type === "user" ? "ml-auto flex-row-reverse" : "",
                            ].join(" ")}
                        >
                            {msg.sender_type === "admin" && (
                                <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center shrink-0 mt-1">
                                    <span className="text-white text-[10px] font-black">A</span>
                                </div>
                            )}
                            <div>
                                <div
                                    className={[
                                        "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                                        msg.sender_type === "user"
                                            ? "bg-[#1E293B] text-white rounded-tr-md"
                                            : "bg-white text-[#1E293B] shadow-sm rounded-tl-md border border-slate-100",
                                    ].join(" ")}
                                >
                                    {msg.message}
                                </div>
                                <p
                                    className={[
                                        "text-[10px] text-slate-400 mt-1",
                                        msg.sender_type === "user" ? "text-right" : "",
                                    ].join(" ")}
                                >
                                    {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center shrink-0">
                                <span className="text-white text-[10px] font-black">A</span>
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-md shadow-sm border border-slate-100">
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="shrink-0 border-t border-slate-200 p-4 bg-white">
                    <div className="flex items-end gap-3">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ketik pesan..."
                            rows={1}
                            className="flex-1 resize-none border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]/50 focus:border-[#F59E0B] transition placeholder:text-slate-400"
                        />
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!inputValue.trim() || loading}
                            className="shrink-0 w-11 h-11 rounded-xl bg-[#F59E0B] text-[#1E293B] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    {!user && (
                        <p className="text-[10px] text-red-500 mt-2 text-center">
                            Silakan <a href="/login" className="underline font-bold">login</a> untuk berkonsultasi
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
