import { Link } from "@inertiajs/react";
import PublicNavbar from "../Components/navbar/PublicNavbar";
import FloatingChatbotLogic from "../Components/Chatbot/FloatingChatbotLogic";

const ADDRESS = "Jl. Jatinegara Kaum No.17A, RT.6/RW.3, Jatinegara Kaum, Kec. Pulo Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13250";
const PHONE_1 = "6281399096871";
const PHONE_2 = "6285885739462";
const INSTAGRAM = "multikon_erindotama";

export default function PublicLayout({
    children,
    chatbotContext = "home",
    chatbotPayload = {},
    hideChatbot = true,
}) {
    const year = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-surface-alt text-slate-800 flex flex-col">
            <PublicNavbar />
            <main className="flex-1">{children}</main>
            {!hideChatbot && (
                <FloatingChatbotLogic
                    context={chatbotContext}
                    payload={chatbotPayload}
                />
            )}

            <footer className="bg-slate-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 mb-[15px]">
                                Alamat Kantor
                            </h4>
                            <p className="text-[13px] text-slate-300 leading-relaxed">
                                {ADDRESS}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 mb-[15px]">
                                Kontak Cepat
                            </h4>
                            <div className="flex flex-col gap-2">
                                <a
                                    href={`https://wa.me/${PHONE_1}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[13px] text-slate-300 hover:text-white transition"
                                >
                                    0813-9909-6871
                                </a>
                                <a
                                    href={`https://wa.me/${PHONE_2}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[13px] text-slate-300 hover:text-white transition"
                                >
                                    0858-8573-9462
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 mb-[15px]">
                                Instagram
                            </h4>
                            <a
                                href="https://www.instagram.com/multikon_erindotama/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[13px] text-slate-300 hover:text-white transition"
                            >
                                @{INSTAGRAM}
                            </a>
                        </div>
                    </div>

                    {/* Informasi */}
                    <div className="border-t border-slate-800 pt-8 mb-8">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 mb-[15px]">
                            Informasi
                        </h4>
                        <div className="flex flex-col gap-3 text-[13px] text-slate-300">
                            <Link href="/about" className="hover:text-white transition">Tentang Kami</Link>
                            <Link href="/tentang-aplikasi" className="hover:text-white transition">Tentang Aplikasi</Link>
                            <Link href="/faq" className="hover:text-white transition">FAQ</Link>
                            <Link href="/cara-belanja" className="hover:text-white transition">Cara Belanja</Link>
                            <Link href="/kebijakan-privasi" className="hover:text-white transition">Kebijakan Privasi</Link>
                            <Link href="/syarat-ketentuan" className="hover:text-white transition">Syarat &amp; Ketentuan</Link>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 text-center">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
                            © {year} Multikon — Kitchen Equipment Stainless Steel
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}