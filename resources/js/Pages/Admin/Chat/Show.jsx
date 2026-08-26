import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function ChatShow({ conversation, messages }) {
    const { props } = usePage();
    const adminName = props.auth?.user?.name || "Admin";
    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);
    const sendingRef = useRef(false);
    const messagesEndRef = useRef(null);
    const pollRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        pollRef.current = setInterval(() => {
            if (document.visibilityState !== "visible") return;
            if (sendingRef.current) return;

            router.reload({
                only: ["messages"],
                preserveScroll: true,
                preserveState: true,
            });
        }, 7000);

        return () => {
            clearInterval(pollRef.current);
            pollRef.current = null;
        };
    }, []);

    const handleReply = (e) => {
        e.preventDefault();
        const text = replyText.trim();
        if (!text || sending) return;

        setSending(true);
        sendingRef.current = true;

        router.post(
            `/admin/chats/${conversation.id}/reply`,
            { message: text },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setReplyText("");
                    setSending(false);
                    sendingRef.current = false;
                },
                onError: () => {
                    setSending(false);
                    sendingRef.current = false;
                },
            }
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleReply(e);
        }
    };

    const userInitial = (conversation.user.name || "U").charAt(0).toUpperCase();

    return (
        <AdminLayout title="Konsultasi Custom">
            <Head title="Konsultasi Custom" />

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[calc(100vh-120px)] min-h-[420px]">
                {/* Header */}
                <div className="shrink-0 bg-[#1E293B] px-5 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link
                            href="/admin/chats"
                            className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                            aria-label="Kembali ke daftar konsultasi"
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                        <div className="w-10 h-10 rounded-full bg-[#F59E0B] flex items-center justify-center shrink-0">
                            <span className="text-[#1E293B] text-sm font-black">{userInitial}</span>
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold text-white truncate">
                                    {conversation.user.name}
                                </h2>
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-amber-300 font-medium tracking-wide shrink-0">
                                    KONSULTASI
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">
                                {conversation.user.email}
                            </p>
                        </div>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0 hidden sm:block">
                        Sejak{" "}
                        {new Date(conversation.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8F9FA]">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <span className="text-4xl mb-3">💬</span>
                            <p className="text-sm font-bold text-[#1E293B]">Belum ada pesan</p>
                            <p className="text-xs text-slate-400 mt-1">
                                Balas pesan pertama untuk memulai konsultasi.
                            </p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={[
                                "flex gap-3 max-w-[70%] lg:max-w-[65%]",
                                msg.sender_type === "admin" ? "ml-auto flex-row-reverse" : "",
                            ].join(" ")}
                        >
                            {msg.sender_type === "user" && (
                                <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center shrink-0 mt-1">
                                    <span className="text-[#1E293B] text-[10px] font-black">
                                        {userInitial}
                                    </span>
                                </div>
                            )}
                            {msg.sender_type === "admin" && (
                                <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center shrink-0 mt-1">
                                    <span className="text-white text-[10px] font-black">A</span>
                                </div>
                            )}
                            <div>
                                <div
                                    className={[
                                        "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                                        msg.sender_type === "admin"
                                            ? "bg-[#1E293B] text-white rounded-tr-md"
                                            : "bg-white text-[#1E293B] shadow-sm rounded-tl-md border border-slate-100",
                                    ].join(" ")}
                                >
                                    {msg.message}
                                </div>
                                <p
                                    className={[
                                        "text-[10px] text-slate-400 mt-1",
                                        msg.sender_type === "admin" ? "text-right" : "",
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

                    <div ref={messagesEndRef} />
                </div>

                {/* Reply Form */}
                <form onSubmit={handleReply} className="shrink-0 border-t border-slate-200 p-4 bg-white">
                    <div className="flex items-end gap-3">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ketik balasan..."
                            rows={2}
                            className="flex-1 resize-none border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#F59E0B]/50 focus:border-[#F59E0B] transition placeholder:text-slate-400"
                        />
                        <button
                            type="submit"
                            disabled={!replyText.trim() || sending}
                            className="shrink-0 px-5 py-3 rounded-xl bg-[#F59E0B] text-[#1E293B] text-sm font-black disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
                        >
                            {sending ? "..." : "Kirim"}
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                        Kirim sebagai <span className="font-bold">{adminName}</span>
                    </p>
                </form>
            </div>
        </AdminLayout>
    );
}
