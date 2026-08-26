import { useEffect, useMemo, useRef, useState } from "react";
import FloatingChatbotView from "./FloatingChatbotView";

const WELCOME = {
    id: "welcome",
    role: "assistant",
    text: "Halo! Saya siap membantu Anda seputar produk, desain, dan layanan Multikon. Ada yang bisa saya bantu?",
};

export default function FloatingChatbotLogic({
    context = "home",
    payload = {},
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [svgPreview, setSvg] = useState("");
    const [messages, setMessages] = useState([WELCOME]);
    const messagesEndRef = useRef(null);

    // ─── Auto-scroll ─────────────────────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages, isOpen, svgPreview]);

    const csrfToken = useMemo(
        () =>
            document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content") || "",
        [],
    );

    const pushMessage = (role, text, svg = "") =>
        setMessages((prev) => [
            ...prev,
            {
                id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                role,
                text,
                svg,
            },
        ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = inputValue.trim();
        if (!message || loading) return;

        pushMessage("user", message);
        setInput("");
        setLoading(true);

        const history = messages
            .filter((m) => m.id !== "welcome")
            .slice(-15)
            .map((m) => ({ role: m.role, text: m.text }));

        try {
            const res = await fetch("/chatbot/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({ message, context, payload, history }),
            });
            const data = await res.json();
            if (!res.ok || !data.success)
                throw new Error(data?.message || "failed");
            const result = data.data || {};
            const svg = result.svg || "";
            pushMessage("assistant", result.reply || "Saya sudah siapkan konsep awal.", svg);
        } catch {
            pushMessage(
                "assistant",
                "Maaf, chatbot sedang tidak tersedia. Coba lagi sebentar.",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleShowSvg = (svg) => setSvg(svg || "");

    // Minimize — window tutup, history tetap ada di state
    const handleMinimize = () => setIsOpen(false);

    // Close — tutup window, riwayat tetap ada di state (hilang saat refresh)
    const handleClose = () => setIsOpen(false);

    return (
        <FloatingChatbotView
            isOpen={isOpen}
            onToggle={() => setIsOpen(true)}
            onMinimize={handleMinimize}
            onClose={handleClose}
            messages={messages}
            inputValue={inputValue}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            loading={loading}
            svgPreview={svgPreview}
            onHideSvg={() => setSvg("")}
            onShowSvg={handleShowSvg}
            activeSvg={svgPreview}
            messagesEndRef={messagesEndRef}
        />
    );
}
